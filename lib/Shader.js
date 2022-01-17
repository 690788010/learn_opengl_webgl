class Shader {
  // constructor generates the shader on the fly
  // ------------------------------------------------------------------------
  constructor(vertexPath, fragmentPath) {
    // retrieve the vertex/fragment source code from filePath
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
    _checkCompileErrors(vertexShader, "VERTEX");
    gl.compileShader(fragmentShader);
    _checkCompileErrors(fragmentShader, "FRAGMENT");
    // 4、创建程序对象
    this.ID = gl.createProgram();
    // 5、将着色器附加到程序对象
    gl.attachShader(this.ID, vertexShader);
    gl.attachShader(this.ID, fragmentShader);
    // 6、链接着色器程序
    gl.linkProgram(this.ID);
    _checkCompileErrors(this.ID, "PROGRAM");
    // delete the shaders as they're linked into our program now and no longer necessary
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
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

  // utility function for checking shader compilation/linking errors.
  // ------------------------------------------------------------------------
  _checkCompileErrors(shader, type) {
    if (type != "PROGRAM") {
      // 如果编译失败，则打印错误信息
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(shader);
        const msg = "ERROR::SHADER_COMPILATION_ERROR of type: " + type + "\n" + infoLog + "\n -- --------------------------------------------------- -- ";
        window.alert(msg);
        console.log(msg)
      }
    } else {
      // 如果链接失败，则打印错误信息
      // 即使链接成功了，也有可能运行失败，比如没有为取样器分配纹理单元。这些错误是在运行阶段而不是链接阶段产生的。
      if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
        const infoLog = gl.getProgramInfoLog(shader);
        const msg = "ERROR::PROGRAM_LINKING_ERROR of type: " + type + "\n" + infoLog + "\n -- --------------------------------------------------- -- ";
        window.alert(msg);
        console.log(msg);
      }
    }
  }

  // 使用程序对象
  use() {
    gl.useProgram(this.ID);
  }

  // 设置着色器的标量属性
  setScalar(name, value) {
    gl.uniform1i(gl.getUniformLocation(this.ID, name), value);
  }
}