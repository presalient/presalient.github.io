uniform sampler2D u_texture;
uniform bool u_renderpass;
uniform vec2 u_resolution;
uniform float u_frame;
varying vec2 vUv;

void main() {
  vec2 uv_pixel_step = 1. / u_resolution.xy;
  int neighbours = 0;
  vec4 originalColor = texture(u_texture, vUv);

  if (u_renderpass) {
    // Finding Neighbours
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

    // Getting Colors
    vec4 newColor;
    float alive = originalColor.x;

    // float shadeFactor = max(-0.49, u_frame * -0.001);

    if (alive >= 0.5) {
      // Become Dead (red)
      if (neighbours <= 1 || neighbours >= 4) {
        newColor = vec4(0., 0., 0., 1.);

      // Stay Alive (white)
      } else {
        newColor = vec4(1., 1., 1., 1.);
      }
    } else {
      // Become Alive (green)
      if (neighbours == 3) {
        newColor = vec4(1., 1., 1., 1.);
      
      // Stay Dead (black)
      } else {
        newColor = vec4(0., 0., 0., 1.);
      }
    }

    gl_FragColor = newColor;

    // Apply blur effect
    if(u_frame > 2.) {
      gl_FragColor.y = originalColor.y * .988; // gl_FragColor.x; // this introduces a motion fade
      if(gl_FragColor.y < .15) {
        gl_FragColor.y  *= .99;
      }
    }


  } else {
    gl_FragColor = originalColor;
  }
}