#version 300 es
precision mediump float;      // 设置浮点变量的精度

out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

// texture sampler
uniform sampler2D texture1;

void main()
{
	FragColor = texture(texture1, TexCoord);
  // FragColor = texture(texture1, TexCoord) * vec4(ourColor, 1.0);
}