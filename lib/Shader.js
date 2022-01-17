class Shader {
  constructor(vertexPath, fragmentPath) {
    const vShaderCode = this._loadFileAJAX(vertexPath);
    const fShaderCode = this._loadFileAJAX(fragmentPath);
    // 1、创建着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // 2、向着色器对象中填充着色器程序的源代码
    gl.shaderSource(vertexShader, vShaderCode);
    gl.shaderSource(fragmentShader, fShaderCode);
    // 3、编译着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    // 如果编译失败，则打印错误信息
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(vertexShader);
      window.alert(msg);
      console.log(msg)
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(fragmentShader);
      window.alert(msg);
      console.log(msg)
    }
    // 4、创建程序对象
    const shaderProgram = gl.createProgram();
    // 5、将着色器附加到程序对象
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    // 6、链接着色器程序
    gl.linkProgram(shaderProgram);
    // 如果链接失败，则打印错误信息
    // 即使链接成功了，也有可能运行失败，比如没有为取样器分配纹理单元。这些错误是在运行阶段而不是链接阶段产生的。
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const msg = gl.getProgramInfoLog(shaderProgram);
      window.alert(msg);
      console.log(msg)
    }
    // 删除着色器对象
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    this.shaderProgram = shaderProgram;
  }

  // 请求加载着色器文件
  _loadFileAJAX(path) {
    const xhr = new XMLHttpRequest();
    if (xhr.readyState == 4 && xhr.status == 200) {
      return xhr.responseText;
    } else {
      window.alert("shader equest was unsuccessful: " + xhr.status);
      console.log("shader equest was unsuccessful: " + xhr.status);
    }
    xhr.open("GET", path, false);
    xhr.send(null);
  }

  // 使用程序对象
  use() {
    gl.useProgram(this.shaderProgram);
  }

  // 设置着色器的标量属性
  setScalar(name, value) {
    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, name), value);
  }
}