#version 300 es
precision mediump float;      // 设置浮点变量的精度

out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform float mixNum;

// texture samplers
uniform sampler2D texture1;
uniform sampler2D texture2;

void main()
{
	// linearly interpolate between both textures (80% container, 20% awesomeface)
	FragColor = mix(texture(texture1, TexCoord), texture(texture2, vec2(1.0 - TexCoord.s, TexCoord.t)), mixNum);
}