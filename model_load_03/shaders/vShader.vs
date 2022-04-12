#version 300 es
layout (location = 0) in vec3 a_pos;
layout (location = 1) in vec3 a_normal;
layout (location = 2) in vec3 a_color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 v_normal;
out vec3 v_color;

void main() {
	gl_Position = projection * view * model * vec4(a_pos, 1.0f);
  v_normal = mat3(model) * a_normal;
  v_color = a_color;
}