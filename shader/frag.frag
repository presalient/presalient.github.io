uniform sampler2D u_texture;
varying vec2 vUv;

void main() {

  gl_FragColor = texture(u_texture, vUv);
}