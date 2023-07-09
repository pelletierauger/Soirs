if (false) {

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
    float luma3(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }
    float luma4(vec4 color) {
        return dot(color.rgb, vec3(0.299, 0.587, 0.114));
    }
    float dither8x8Fl(vec2 position, float brightness) {
      int x = int(mod(position.x, 8.0));
      int y = int(mod(position.y, 8.0));
      int index = x + y * 8;
      float limit = 0.0;
      if (x < 8) {
        if (index == 0) limit = 0.015625;
        if (index == 1) limit = 0.515625;
        if (index == 2) limit = 0.140625;
        if (index == 3) limit = 0.640625;
        if (index == 4) limit = 0.046875;
        if (index == 5) limit = 0.546875;
        if (index == 6) limit = 0.171875;
        if (index == 7) limit = 0.671875;
        if (index == 8) limit = 0.765625;
        if (index == 9) limit = 0.265625;
        if (index == 10) limit = 0.890625;
        if (index == 11) limit = 0.390625;
        if (index == 12) limit = 0.796875;
        if (index == 13) limit = 0.296875;
        if (index == 14) limit = 0.921875;
        if (index == 15) limit = 0.421875;
        if (index == 16) limit = 0.203125;
        if (index == 17) limit = 0.703125;
        if (index == 18) limit = 0.078125;
        if (index == 19) limit = 0.578125;
        if (index == 20) limit = 0.234375;
        if (index == 21) limit = 0.734375;
        if (index == 22) limit = 0.109375;
        if (index == 23) limit = 0.609375;
        if (index == 24) limit = 0.953125;
        if (index == 25) limit = 0.453125;
        if (index == 26) limit = 0.828125;
        if (index == 27) limit = 0.328125;
        if (index == 28) limit = 0.984375;
        if (index == 29) limit = 0.484375;
        if (index == 30) limit = 0.859375;
        if (index == 31) limit = 0.359375;
        if (index == 32) limit = 0.0625;
        if (index == 33) limit = 0.5625;
        if (index == 34) limit = 0.1875;
        if (index == 35) limit = 0.6875;
        if (index == 36) limit = 0.03125;
        if (index == 37) limit = 0.53125;
        if (index == 38) limit = 0.15625;
        if (index == 39) limit = 0.65625;
        if (index == 40) limit = 0.8125;
        if (index == 41) limit = 0.3125;
        if (index == 42) limit = 0.9375;
        if (index == 43) limit = 0.4375;
        if (index == 44) limit = 0.78125;
        if (index == 45) limit = 0.28125;
        if (index == 46) limit = 0.90625;
        if (index == 47) limit = 0.40625;
        if (index == 48) limit = 0.25;
        if (index == 49) limit = 0.75;
        if (index == 50) limit = 0.125;
        if (index == 51) limit = 0.625;
        if (index == 52) limit = 0.21875;
        if (index == 53) limit = 0.71875;
        if (index == 54) limit = 0.09375;
        if (index == 55) limit = 0.59375;
        if (index == 56) limit = 1.0;
        if (index == 57) limit = 0.5;
        if (index == 58) limit = 0.875;
        if (index == 59) limit = 0.375;
        if (index == 60) limit = 0.96875;
        if (index == 61) limit = 0.46875;
        if (index == 62) limit = 0.84375;
        if (index == 63) limit = 0.34375;
      }
      return brightness < limit ? 0.0 : 1.0;
    }
    float dither2x2Fl(vec2 position, float brightness) {
      int x = int(mod(position.x, 2.0));
      int y = int(mod(position.y, 2.0));
      int index = x + y * 2;
      float limit = 0.0;
      if (x < 8) {
        if (index == 0) limit = 0.25;
        if (index == 1) limit = 0.75;
        if (index == 2) limit = 1.00;
        if (index == 3) limit = 0.50;
      }
      return brightness < limit ? 0.0 : 1.0;
    }
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float width = 762.;
        float height = 225.;
        float x = fract(id / width);
        x = mod(id, width) / width;
        float y = floor(id / width);
        float n = noise(vec2(x * 5. + cos(time * 2e-3) * 10., y/height * 5. + sin(time * 2e-3) * 10.));
        gl_Position = vec4((x - 0.5) * 1.71 * 1.08, (y/height - 0.5) * 1.7 * -1., 0.0, 1.0);
        gl_PointSize = 12. * resolution * 2.0;
        alph = 0.25 * 0.75;
        float di = dither8x8Fl(vec2(x * width, y * width), n * 0.4);
        col = di * 0.5;
        // col = n;
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
        gl_FragColor = vec4(vec3(col), color);
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();






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
    // float noise(vec2 p){
    //   vec2 ip = floor(p);
    //   vec2 u = fract(p);
    //   u = u*u*(3.0-2.0*u);
    //   float res = mix(
    //     mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    //     mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    //   return res*res;
    // }
    float luma3(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }
    float luma4(vec4 color) {
        return dot(color.rgb, vec3(0.299, 0.587, 0.114));
    }
    float dither8x8Fl(vec2 position, float brightness) {
      int x = int(mod(position.x, 8.0));
      int y = int(mod(position.y, 8.0));
      int index = x + y * 8;
      float limit = 0.0;
      if (x < 8) {
        if (index == 0) limit = 0.015625;
        if (index == 1) limit = 0.515625;
        if (index == 2) limit = 0.140625;
        if (index == 3) limit = 0.640625;
        if (index == 4) limit = 0.046875;
        if (index == 5) limit = 0.546875;
        if (index == 6) limit = 0.171875;
        if (index == 7) limit = 0.671875;
        if (index == 8) limit = 0.765625;
        if (index == 9) limit = 0.265625;
        if (index == 10) limit = 0.890625;
        if (index == 11) limit = 0.390625;
        if (index == 12) limit = 0.796875;
        if (index == 13) limit = 0.296875;
        if (index == 14) limit = 0.921875;
        if (index == 15) limit = 0.421875;
        if (index == 16) limit = 0.203125;
        if (index == 17) limit = 0.703125;
        if (index == 18) limit = 0.078125;
        if (index == 19) limit = 0.578125;
        if (index == 20) limit = 0.234375;
        if (index == 21) limit = 0.734375;
        if (index == 22) limit = 0.109375;
        if (index == 23) limit = 0.609375;
        if (index == 24) limit = 0.953125;
        if (index == 25) limit = 0.453125;
        if (index == 26) limit = 0.828125;
        if (index == 27) limit = 0.328125;
        if (index == 28) limit = 0.984375;
        if (index == 29) limit = 0.484375;
        if (index == 30) limit = 0.859375;
        if (index == 31) limit = 0.359375;
        if (index == 32) limit = 0.0625;
        if (index == 33) limit = 0.5625;
        if (index == 34) limit = 0.1875;
        if (index == 35) limit = 0.6875;
        if (index == 36) limit = 0.03125;
        if (index == 37) limit = 0.53125;
        if (index == 38) limit = 0.15625;
        if (index == 39) limit = 0.65625;
        if (index == 40) limit = 0.8125;
        if (index == 41) limit = 0.3125;
        if (index == 42) limit = 0.9375;
        if (index == 43) limit = 0.4375;
        if (index == 44) limit = 0.78125;
        if (index == 45) limit = 0.28125;
        if (index == 46) limit = 0.90625;
        if (index == 47) limit = 0.40625;
        if (index == 48) limit = 0.25;
        if (index == 49) limit = 0.75;
        if (index == 50) limit = 0.125;
        if (index == 51) limit = 0.625;
        if (index == 52) limit = 0.21875;
        if (index == 53) limit = 0.71875;
        if (index == 54) limit = 0.09375;
        if (index == 55) limit = 0.59375;
        if (index == 56) limit = 1.0;
        if (index == 57) limit = 0.5;
        if (index == 58) limit = 0.875;
        if (index == 59) limit = 0.375;
        if (index == 60) limit = 0.96875;
        if (index == 61) limit = 0.46875;
        if (index == 62) limit = 0.84375;
        if (index == 63) limit = 0.34375;
      }
      return brightness < limit ? 0.0 : 1.0;
    }
    float dither2x2Fl(vec2 position, float brightness) {
      int x = int(mod(position.x, 2.0));
      int y = int(mod(position.y, 2.0));
      int index = x + y * 2;
      float limit = 0.0;
      if (x < 8) {
        if (index == 0) limit = 0.25;
        if (index == 1) limit = 0.75;
        if (index == 2) limit = 1.00;
        if (index == 3) limit = 0.50;
      }
      return brightness < limit ? 0.0 : 1.0;
    }
const float TURBULENCE = 0.009;
//noise function from iq: https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
}
const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
float fbm(vec2 p) {
    float amp = 0.5;
    float h = 0.0;
    for (int i = 0; i < 8; i++) {
        float n = noise(p);
        h += amp * n;
        amp *= 0.5;
        p = m2 * p;
    }
    return  0.5 + 0.5 * h;
}
vec3 smokeEffect(vec2 uv) {
    // float time = 702.0;
    vec3 col = vec3(0.0, 0.0, 0.0);
    // time scale
    float v = 0.0002;
    vec3 smoke = vec3(1.0);
    //uv += mo * 10.0;
    vec2 scale = uv * 0.5;
    vec2 turbulence = TURBULENCE * vec2(noise(vec2(uv.x * 3.5, uv.y * 3.2) * 1.), noise(vec2(uv.x * 2.2, uv.y * 1.5)));
    scale += turbulence;
    float n1 = fbm(vec2(scale.x - abs(sin(time * v * 10.0)), scale.y - 50.0 * abs(sin(time * v * 4.0))));
    col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
    //float y = fragCoord.y/iResolution.y;
    //float fade = exp(-(y*y));
    //col *= fade;
//     col.r * 0.5;
    col = clamp(col, vec3(0.0), vec3(1.0)) * 2.;
    return col;
}
    void main(void) {
        float t = time * 1e-2;
        float id = vertexID;
        float width = 762.;
        float height = 225.;
        float x = fract(id / width);
        x = mod(id, width) / width;
        float y = floor(id / width);
        float n = noise(vec2(x * 4. + cos(time * 3e-4) * 10., y/height * 4. + sin(time * 3e-4) * 10.));
        gl_Position = vec4((x - 0.5) * 1.71 * 1.08 - 0.001, (y/height - 0.5) * 1.7 * -1.006 - 0.005, 0.0, 1.0);
        gl_PointSize = 12. * resolution * 2.0;
        alph = 0.25 * 0.75;
        vec3 smoke2 = smokeEffect(vec2(x * 3., y * 3.) * 10.);
        float di = dither8x8Fl(vec2(x * width, y * width), (smoke2.r * 0.1) + n * 0.4);
        col = di * 0.25;
        gl_PointSize *= di;
        // col = 0.55;
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
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.35);
        // float color = 1.0;
        // float rando = rand(uv * t) * 0.1;
        float b = mix(0.0, 1.0, step(0.25, col));
        gl_FragColor = vec4(vec3(col), color);
        
    }
    // endGLSL
`;
// newFlickeringVert.init();
newFlickeringVert.vertText = newFlickeringVert.vertText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.fragText = newFlickeringVert.fragText.replace(/[^\x00-\x7F]/g, "");
newFlickeringVert.init();

}