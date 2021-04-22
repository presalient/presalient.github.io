uniform sampler2D u_texture;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(u_texture, vUv); // Displays Nothing
  // gl_FragColor = vec4(0.5, 0.2, 1.0, 1.0); // Works; Displays Flat Color
}