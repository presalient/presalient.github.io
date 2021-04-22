uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;
uniform sampler2D u_noise;
uniform sampler2D u_buffer;
uniform bool u_renderpass;
uniform int u_frame;

#define PI 3.141592653589793
#define TAU 6.283185307179586

const float contrast = 1.16;

vec2 hash2(vec2 p)
{
  vec2 o = texture2D( u_noise, (p+0.5)/256.0, -100.0 ).xy;
  return o;
}
float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                            6.0)-3.0)-1.0,
                    0.0,
                    1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

vec3 domain(vec2 z){
  return vec3(hsb2rgb(vec3(atan(z.y,z.x)/TAU,1.,1.)));
}
vec3 colour(vec2 z) {
    return domain(z);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
  vec2 sample = gl_FragCoord.xy / u_resolution.xy;

  vec2 texStep = 1. / u_resolution.xy;

  vec2 mouse = u_mouse.xy - uv;

  float shade = smoothstep(.0055, .001, length(mouse));

  vec4 fragcolour = texture2D(u_buffer, sample);
  float size = 5.;

  if(u_renderpass == true) {
    if(u_frame < 2) {
      float _rand = rand(uv*256.);
      gl_FragColor = vec4(1.) * clamp(floor(_rand * _rand * _rand * contrast), 0., 1.);
    } else {
      float neighbours = 0.;
      for(float i = -1.; i < 2.; i+=1.) {
        for(float j = -1.; j < 2.; j+=1.) {
          if(i != 0. || j != 0.) {
            float alive = texture2D(u_buffer, sample + (texStep * vec2(i, j))).x;
            if(alive > .5) {
              neighbours += 1.;
            }
          }
        }
      }
      float lifestatus = floor(fragcolour.x+.5);
      gl_FragColor = vec4(lifestatus);
      if(lifestatus == 1.) {
        if(neighbours < 2. || neighbours > 3.) {
          gl_FragColor = vec4(0.);
        }
      } else {
        if(neighbours == 3. || neighbours == 3.) {
          gl_FragColor = vec4(1.);
        }
      }

      if(u_mouse.z == 1.) {
        gl_FragColor += shade;
      }

      if(u_frame > 2) {
        gl_FragColor.y = fragcolour.y * .988 + gl_FragColor.x; // this introduces a motion fade
        if(gl_FragColor.y < .15) {

          gl_FragColor.y  *= .99;
        }
      }
    }
  } else {
      if(u_mouse.z == 1.) {
    fragcolour += shade;
      }
        gl_FragColor = vec4(fragcolour.y);
  }
}