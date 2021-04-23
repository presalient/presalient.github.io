uniform sampler2D u_texture;
uniform bool u_renderpass;
uniform vec2 u_resolution;
uniform float u_frame;
varying vec2 vUv;

void main() {
  vec2 uv_pixel_step = 1. / u_resolution.xy;
  int neighbours = 0;

  // if (u_renderpass == true || u_renderpass == false) {
  if (true) {
    for (int i = -1; i < 2; i++) {
        for (int j = -1; j < 2; j++) {
          if (i != 0 || j != 0) {
            float neighAlive = texture(u_texture, vUv + (uv_pixel_step * vec2(i, j))).x;

            // Check if pixel is white
            if (neighAlive > 0.5) { 
              neighbours += 1; 
            } 
          }
        }
      }

      vec4 pixelColor = texture(u_texture, vUv);
      float alive = pixelColor.x;
      if (alive >= 0.5) {
        // Become Dead (red)
        if (neighbours <= 1 || neighbours >= 4) {
          gl_FragColor = vec4(1., 0., 0., 1.);

        // Stay Alive (white)
        } else {
          gl_FragColor = vec4(1., 1., 1., 1.);
        }
      } else {
        // Become Alive (green)
        if (neighbours == 3) {
          gl_FragColor = vec4(0., 1., 0., 1.);
        
        // Stay Dead (black)
        } else {
          gl_FragColor = vec4(0., 0.0001 * u_frame, 0., 1.);
        }
      }
  } else {
    gl_FragColor = texture(u_texture, vUv);
  }
}