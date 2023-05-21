uniform sampler2D u_texture;
uniform bool u_renderpass;
uniform vec2 u_resolution;
uniform float u_frame;
uniform vec2 u_mouse_position;
uniform bool u_click;
varying vec2 vUv;

float ALIVE_THRESH = 0.6;
float ORANGE = 0.9;
float DEAD_ORANGE = 0.1;
float WHITE = 1.;
float DEAD_WHITE = 0.2;
float EPS = 0.09;

float rand(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv_pixel_step = 1. / u_resolution.xy;
  vec4 originalColor = texture(u_texture, vUv);

  int orange_count = 0;
  int white_count = 0;
  int neighbours = 0;

  if (u_renderpass) {
    // Finding Neighbours
    for (int i = -1; i < 2; i++) {
      for (int j = -1; j < 2; j++) {
        if (i != 0 || j != 0) {
          float neighColor = texture(u_texture, vUv + (uv_pixel_step * vec2(i, j))).x;

          // Check if neighbor is alive
          if (neighColor >= ALIVE_THRESH) { 
            neighbours += 1;
            if (abs(neighColor - ORANGE) < EPS) {
              orange_count += 1; 
            } else if (abs(neighColor - WHITE) < EPS) {
              white_count += 1;
            }
          }
        }
      }
    }

    // Getting Colors
    float alive = originalColor.x;
    bool stayedAlive = false;

    gl_FragColor = vec4(0., 0., 0., 0.);

    if (alive >= ALIVE_THRESH) {
      // Become Dead
      if (neighbours <= 1 || neighbours >= 4) {
        if (abs(originalColor.x - ORANGE) < EPS) {
          gl_FragColor.x = DEAD_ORANGE;
        } else if (abs(originalColor.x - WHITE) < EPS) {
          gl_FragColor.x = DEAD_WHITE;
        }

      // Stay Alive 
      } else {
        if (abs(originalColor.x - ORANGE) < EPS) {
          gl_FragColor.x = ORANGE;
        } else if (abs(originalColor.x - WHITE) < EPS) {
          gl_FragColor.x = WHITE;
        }

        stayedAlive = true;
      }
    } else {
      // Become Alive
      if (neighbours == 3) {
        gl_FragColor.x = orange_count > white_count ? ORANGE : WHITE;
      
      // Stay Dead
      } else {
        gl_FragColor.x = originalColor.x;
      }
    }

    // Overrwrite computation and make alive if near mouse pointer
    float radius = u_click ? 50. : 5.;
    if (length(gl_FragCoord.xy - u_mouse_position) < radius && 
    rand(gl_FragCoord.x * gl_FragCoord.y / u_frame) > 0.7) {
      gl_FragColor.x = ORANGE;
    }

    // We store post processing effects inside the g/y value of the fragColor
    // x is where the live or dead state is
    if(u_frame > 2.) {
      // Create blur if pixel has changed in this frame (maybe died)
      float aliveness = (gl_FragColor.x >= ALIVE_THRESH) ? 1. : 0.;
      gl_FragColor.y = originalColor.y * .988 + aliveness; // this introduces a motion fade

      gl_FragColor.y = min(gl_FragColor.y, 1.);

      // the threshold of when to slow down fading the blur
      if(gl_FragColor.y < .2) {
        // Fade away the blur even slower
        // This fails and creates an unintended grey background due to convert from float [0, 1] to 0-255 and back etc
        gl_FragColor.y  *= .99; 
      }
    }

    // Age factor
    gl_FragColor.w = originalColor.w;
    if (stayedAlive) {
      gl_FragColor.w *= 0.99;
    } else {
      gl_FragColor.w = 1.;
    }

    // Centre circle fade factor
    vec2 centre = u_resolution / 2.;
    float centreFactor =  (1. / ((centre.y * centre.y))) *
      (
        ((gl_FragCoord.x - centre.x - 0.5) * (gl_FragCoord.x - centre.x - 0.5)) +
        ((gl_FragCoord.y - centre.y - 0.5) * (gl_FragCoord.y - centre.y - 0.5)) -
        ((u_resolution.y / 10.) * (u_resolution.y / 10.))
      );

    centreFactor = min(centreFactor, 1.); // Can't be bigger than 1
    centreFactor = max(centreFactor, 0.); // Can't be smaller than 0

    gl_FragColor.z = centreFactor;
  } else {
    float f = originalColor.y * originalColor.z * originalColor.w;
    if (abs(originalColor.x - ORANGE) < EPS || abs(originalColor.x - DEAD_ORANGE) < EPS) {
      gl_FragColor = vec4(1., 0.5, 0., 1.) * f;
    } else if (abs(originalColor.x - WHITE) < EPS || abs(originalColor.x - DEAD_WHITE) < EPS) {
      gl_FragColor = vec4(1., 1., 1., 1.) * f;
    }
  }
}

