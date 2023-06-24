newFlickeringVert.vertText = `
    // beginGLSL
    attribute float vertexID;
    uniform float time;
    uniform float resolution;
    varying float alph;
    varying float col;
// 
    float map(float value, float min1, float max1, float min2, float max2) {
        float perc = (value - min1) / (max1 - min1);
        return perc * (max2 - min2) + min2;
    }
// 
    vec2 rotate(vec2 pos, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, s, -s, c) * pos;
    }
    float plane(vec3 pos) {
        return pos.y;
    }
    float sphere(vec3 pos, float radius) {
        return length(pos) - radius;
    }
    float box(vec3 pos, vec3 size) {
        return length(max(abs(pos) - size, 0.0));
    }
    float roundedBox(vec3 pos, vec3 size, float radius) {
        return length(max(abs(pos) - size, 0.0)) - radius;
    }
    float map(vec3 pos) {
        float planeDist = plane(pos + vec3(0.0, 10.0, 0.0));
        // float o = (sin(time * 1e1) + 1.) * 5.;
        // pos.xy = rotate(pos.xy, pos.z * 0.01 * sin(time * 0.5e2));
        // pos = mod(pos + 10., 20.) - 10.;
        // return min(planeDist, roundedBox(pos, vec3(2.0), 1.0));
        return min(planeDist, roundedBox(pos, vec3(1.5), 2.0));
    }
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float x = ((fract(id / 762.)) - 0.5);
        float y = ((floor(id / 762.) / 224.) - 0.5);
        vec3 pos = vec3(0.0, 0.0, 0.0);
        vec3 dir = normalize(vec3(x, y, 1.0));
        vec3 color = vec3(0.0);
        for (int i = 0; i < 128; i++) {
            float d = map(pos);
            if ( d < 0.01) {
                // float sh = 1.0 - float(j) * 0.015;
                // color = vec3(sh, sin(pos.y * 0.225) * 0.5 * sh, sin(pos.x * 0.125) * 1.5 * sh);
                break;
            }
            pos += d * dir;
            // x += sin(float(j)) * 0.01;
        }
        // float ds = dot(vec2(x, y), vec2(0.5, 0.5));
        // y -= ( abs(x) * 1. / y * cos(x)) * 0.1;
        // x -= cos( abs(y) * 1. / y * sin(t)) * 0.1;
        // x += ds * 0.9;
        // y += ds * 0.9;
        // // x += cos(x * 0.0625 * sin(t * 1e3) + i * 0.0625e5 / cos(i * 15.5 + t * 1e-2) * 2e-1) * 0.5e-1;
        // y += sin(x * 0.0625 * sin(t * 1e3) + i * 0.0625e5 / sin(i * 15.5 + t * 1e-2) * 2e-1) * 0.5e-1;
        // gl_Position = vec4((x - 0.) * 8., (y - 0.) * 8., 0.0, 1.0);
        float n = noise(vec2(x * 10. + cos(time * 2e-3) * 20., y * 10. + sin(time * 2e-3) * 20.));
        // n = sin(n * 3. * tan(n * 1e1));
        gl_Position = vec4(x * 1.71 * 1.08, y * 1.7 * -1., 0.0, 1.0);
         // gl_Position = vec4((x - 0.25) * 4., (y - 0.25) * 4., 0.0, 1.0);
        // gl_Position = vec4(color.r * 0.25, color.r * 0.25, 0.0, 1.0);
        // gl_PointSize = 12. - n * 7.;
        gl_PointSize = 12. * resolution * 2.0;
        alph = 0.25 * 0.75;
        col = n;
    }
    // endGLSL
`;
newFlickeringVert.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    // uniform float resolution;
//     varying vec2 myposition;
//     varying vec2 center;
    
    varying float alph;
    varying float col;
float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangleFlicker(vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // vec2 uv = gl_PointCoord.xy;
        float t = 1.;
        float t2 = mod(t * 0.125, 3.14159 * 2.) * 1.;
        // t = 100. + (t * 1e-4);
        float w = 0.15 + (sin(t2 * 1e-2 * tan(t2 * 2e-2)) + 1.0) * 0.25;
        float d = length(max(abs(uv - pos), size * 0.5) - size * 0.5) * w - radius * 0.01;
        float oscFull = (sin(t2) * 0.5 + 0.5) * 3.75 * 0.;
        float oscScanning = (sin(gl_FragCoord.y * 1e-2 + t2) * 0.5 + 0.5) * 4.;
        // return smoothstep(2.99 + oscFull + oscScanning, 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
        // No oscScanning anymore.
        return smoothstep(2.99 + oscFull + 1., 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
     }
    float roundedRectangle(vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos), size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        float t = 1.0;
        // vec2 screenSize = vec2(2560.0, 1440.0) * 1.;
        vec2 uv = gl_PointCoord.xy;
        uv = uv * 2. - 1.;
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.5);
        // float color = 1.0;
        // float rando = rand(uv * t) * 0.1;
        float b = mix(0.0, 1.0, step(0.25, col));
        gl_FragColor = vec4(vec3(0.65), color * b);
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();