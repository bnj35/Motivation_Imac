varying vec2 vUv;
uniform float time;

void main() {
    vUv = uv;

    vec3 position = position;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}