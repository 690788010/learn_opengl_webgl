#version 300 es
precision mediump float;      // 设置浮点变量的精度

in vec3 v_normal;
in vec3 v_color;


out vec4 FragColor;

void main() {
  vec3 normal = normalize(v_normal);
  //vec4 u_diffuse = vec4(0.0, 0.5, 0.5, 1.0);
  vec3 u_lightDirection = vec3(1.0, 1.0, 1.0);
  float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
	FragColor = vec4(v_color * fakeLight, 1.0);
}