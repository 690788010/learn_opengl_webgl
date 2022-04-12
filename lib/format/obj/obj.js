// import Object from "./object.js";
// import Face from "./face.js";

class Obj {
  constructor(filePath) {
    this._objects = [];
    this._vertexes = [];
    this._texCoords = [];
    this._normals = [];

    const filePromise = this._loadFileAJAX(filePath);
    const resolvePromise = this._resolveFile(filePromise);
    this._readyPromise = this._computeDrawingInfo(resolvePromise);
  }

  get readPromise() {
    return this._readyPromise;
  }

  _computeDrawingInfo(resolvePromise) {
    return new Promise((resolve, reject) => {
      resolvePromise.then(() => {
        const drawingInfo = {
          vertices: [],
          texCoords: [],
          normals: [],
          colors: []
        };
        for (let i = 0, len = this._objects.length; i < len; i++) {   // 遍历每个对象
          const object = this._objects[i];
          const faces = object.Faces;
          const randomColor = [Math.random(), Math.random(), Math.random()];
          for (let j = 0, len2 = faces.length; j < len2; j++) {     // 遍历每个对象的面
            const face = faces[j];
            const vIndices = face.VINDICES;
            for (let k = 0, len3 = vIndices.length; k < len3; k++) {    // 遍历每个面的顶点
              const vertexArr = this._vertexes[vIndices[k]];
              vertexArr.forEach((item) => {
                drawingInfo.vertices.push(item);
              })
              drawingInfo.colors.push(randomColor[0]);         // 随机颜色
              drawingInfo.colors.push(randomColor[1]);
              drawingInfo.colors.push(randomColor[2]);
            }
            const tIndices = face.TINDICES;
            for (let k = 0, len3 = tIndices.length; k < len3; k++) {  // 遍历每个面的纹理坐标
              const texCoord = this._texCoords[tIndices[k]];
              texCoord.forEach((item) => {
                drawingInfo.texCoords.push(item);
              })
            }
            const nIndices = face.NINDICES;
            for (let k = 0, len3 = nIndices.length; k < len3; k++) {    // 遍历每个面的法向量
              const normal = this._normals[nIndices[k]];
              normal.forEach((item) => {
                drawingInfo.normals.push(item);
              })
            }
          }
        }
        resolve(drawingInfo);
      })
    });
  }

  // 解析obj文本数据
  _resolveFile(filePromise) {
    return new Promise((resolve, reject) => {
      filePromise.then((res) => {
        const lines = res.split("\n");    // 拆成逐行的
        for (let i = 0, len = lines.length; i < len; i++) {
          const command = this._getWord(lines[i]);
          switch(command) {
            case "#": 
              continue;     // 解析下一行
            case "mtllib":
              continue;   // 解析下一行
            case "o":
              const objName = lines[i].split(' ')[1];   // 读取对象名
              // 创建对象并添加到集合
              const object = new Object(objName);
              this._objects.push(object);
              continue;   // 解析下一行
            case "v":     // 读取顶点数据
              const vertex = this._parseVertex(lines[i]);
              this._vertexes.push(vertex);
              continue;   // 解析下一行
            case "vt":    // 读取纹理坐标
              const texCoord = this._parseTexCoord(lines[i]);
              this._texCoords.push(texCoord);
              continue;   // 解析下一行
            case "vn":    // 读取法向量数据
              const normal = this._parseNormal(lines[i]);
              this._normals.push(normal);
              continue;  // 解析下一行
            case "usemtl": 
              continue;
            case "f":   // 读取面的顶点数据
              const face = this._parseFace(lines[i]);
              const curObject = this._objects[this._objects.length - 1];
              curObject.Faces.push(face);
              continue;   // 解析下一行
          }
        }
        resolve();
      })
    })
  }

  // 解析面数据
  _parseFace(line) {
    const arr = line.split(' ');
    const face = new Face();
    for (let i = 1, len = arr.length - 2; i < len; i++) {
      // 每次循环解析一个三角形的相关顶点
      let indices = arr[1].split('/');
      face.VINDICES.push(parseFloat(indices[0]) - 1);
      face.TINDICES.push(parseFloat(indices[1]) - 1);
      face.NINDICES.push(parseFloat(indices[2]) - 1);
      indices = arr[i + 1].split('/');
      face.VINDICES.push(parseFloat(indices[0]) - 1);
      face.TINDICES.push(parseFloat(indices[1]) - 1);
      face.NINDICES.push(parseFloat(indices[2]) - 1);
      indices = arr[i + 2].split('/');
      face.VINDICES.push(parseFloat(indices[0]) - 1);
      face.TINDICES.push(parseFloat(indices[1]) - 1);
      face.NINDICES.push(parseFloat(indices[2]) - 1);
    }
    return face;
  }

  // 解析顶点数据
  _parseVertex(line) {
    const arr = line.split(' ');
    const vertex = [];
    for (let i = 1, len = arr.length; i < len; i++) {
      vertex.push(parseFloat(arr[i]));
    }
    return vertex;
  }

  // 解析法向量数据
  _parseNormal(line) {
    const arr = line.split(' ');
    const normal = [];
    for (let i = 1, len = arr.length; i < len; i++) {
      normal.push(parseFloat(arr[i]));
    }
    return normal;
  }

  // 解析纹理坐标
  _parseTexCoord(line) {
    const arr = line.split(' ');
    const texCoord = [];
    for (let i = 1, len = arr.length; i < len; i++) {
      texCoord.push(parseFloat(arr[i]));
    }
    return texCoord;
  }

  // 获取指令名，即某行的第一个单词
  _getWord(line) {
    const endIndex = line.indexOf(' ');
    return line.substring(0, endIndex);
  }

  // 请求加载着色器文件
  _loadFileAJAX(path) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
          const res = xhr.responseText
          resolve(res);
        }
      });
      xhr.open("GET", path, false);
      xhr.send(null);
    });
  }
}

class Object {
  constructor(name) {
    this._name = name;
    this._faces = [];
  }

  get Name() {
    return this._name;
  }
  
  set Name(value) {
    this._name = value;
  }

  get Faces() {
    return this._faces;
  }
}

class Face {
  constructor() {
    this._vIndices = [];
    this._tIndices = [];
    this._nIndices = [];
  }

  get VINDICES() {
    return this._vIndices;
  }

  get TINDICES() {
    return this._tIndices;
  }

  get NINDICES() {
    return this._nIndices;
  }
}

// export default Obj;