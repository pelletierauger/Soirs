drawTerminal = function(selectedProgram) {
    // let canH = cnvs.height / resolutionScalar / 2;
    // let hh = (window.innerHeight - canH) * 0.5;
    // let mx = map(mouse.x, 0, document.body.clientWidth, -1, 1);
    // let my = map(mouse.y, hh, canH + hh, 1, -1);
    let nx = openSimplex.noise2D(0, drawCount * 5e-2) * 0.0025;
    let ny = openSimplex.noise2D(0, drawCount * 5e-2 + 1e5) * 0.0025;
    if (ge.playback) {
        ge.play();
    }
    fmouse[0] = constrain(Math.floor(map(mouse.x, 78, 1190, 0, 108)), 0, 109);
    fmouse[1] = constrain(Math.floor(map(mouse.y, 96, 695, 0, 25)), 0, 25);
    pmouse[0] = constrain(Math.floor(map(mouse.x, 78, 1190, 0, 108 * 7)), 0, 109 * 7);
    pmouse[1] = constrain(Math.floor(map(mouse.y, 96, 695, 0, 25 * 9)), 0, 25 * 9);
    smouse[0] = Math.floor(pmouse[0] % 7);
    smouse[1] = Math.floor(pmouse[1] % 9);
    //scdDisplay();
    // ———————————————————————————————————————————————————————————————
    //  Grimoire drawing algorithm
    // ———————————————————————————————————————————————————————————————
    // 
    vertices = [];
    let num = 0;
    let colors = [];
    // 
    if (ge.activeTab !== null && ge.t.darkPixels) {
        let d = ge.t.darkPixels.canvas.data;
        let m = (mode == 2) ? 0 : 2;
        for (let y = 0; y < 22 + 1 + m; y++) {
            for (let x = 0; x < 109; x++) {
                if (d[y + ge.t.scroll.y] && d[y + ge.t.scroll.y][x]) {
                    for (let yy = 0; yy < 9; yy++) {
                        for (let xx = 0; xx < 7; xx++) {
                            if (d[y + ge.t.scroll.y][x][xx + (yy * 7)]) {
                                let sc = 0.8;
                                vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 + ny - 0.14) * sc, 11 * sc, 1);
                                num++;
                                colors.push(0, 0, 0);   
                            }
                        }
                    }                    
                }
            }
        }
    }
    // 
    if (ge.brushPositions && mode == 2 && showPatterns) {
        for (let i = 0; i < patterns.length; i++) {
            for (let y = 0; y < 18; y++) {
                let r = 7 * 5 - 2;
                 for (let x = i * r; x < r + (i * r); x++) {
                     let p = patterns[i].grid;
                     let pdim = [p[0].length, p.length];
                     let vv = p[y % pdim[1]][(x - i * r) % pdim[0]];
                     let sel = false;
                     let contour = false;
                     if (patterns[i] == ge.activePattern) {
                         sel = (y==0|x==i*r|x==(r+(i*r)-1)|y==17);
                         if (!sel) {
                             contour = (
                                 y==1||
                                 x==i*r+1||
                                 x==i*r+2||
                                 x==(r+(i*r)-2)||
                                 x==(r+(i*r)-3)||
                                 y==16);
                         }
                     }
                     if ((vv || sel) && !contour) {
                         ge.brushPositions[23 * 9 + y][x] = 1;
                     }
                 }
             }
         }
        if (fmouse[1] > 19 + 3) {
            applyPointer();
        }
    }   
// 
    let editorSelection = false;
    let selections = null;
    let oneD = function(x, y) {return x + (y * 109)};
    if (ge.activeTab !== null) {
        let t = ge.activeTab;
            let sel = false;
    for (let i = 0; i < t.carets.length; i++) {
        let c = t.carets[i];
        // console.log(c);
        if (c.sel !== null) {
            sel = true;
        }
    }
    if (sel) {
        // ctt++;
        selections = [];
        for (let y = 0; y < 22 + 3; y++) {
            selections[y] = [];
            for (let x = 0; x < 109; x++) {
                selections[y][x] = 0;
                for (let i = 0; i < ge.activeTab.carets.length; i++) {
                    let c = ge.activeTab.carets[i];
                    if (c.sel !== null) {
                        let oy = ge.activeTab.scroll.y + y;
                        let span = [oneD(c.x, c.y), oneD(c.sel[0], c.sel[1])].sort(function(a, b) {
                            return a - b;
                        });
                        if (oneD(x, oy) >= span[0] && oneD(x, oy) < span[1]) {
                            selections[y][x] = 1;
                        }
                    }
                }
            }
        }
    }
    if (ge.evaluated) {
        if (selections == null) {selections = []};
        for (let y = 0; y < 22 + 3; y++) {
            selections[y] = [];
            for (let x = ge.evaluatedLines[2]; x < 109; x++) {
                let sy = y + ge.activeTab.scroll.y;
                if (sy >= ge.evaluatedLines[0] && sy < ge.evaluatedLines[1]) {
                    if (x == 0 || x < ge.activeTab.data[sy].length) {
                        selections[y][x] = 1;
                    } else {
                        selections[y][x] = 0;
                    }
                } else {
                    selections[y][x] = 0;
                }
            }
        }
        if (ge.evaluated > 0) {ge.evaluated--};
    }
}
//     
    for (let y = 0; y < Math.floor(nt / 109); y++) {
        for (let x = 0; x < 109; x++) {
            let char;
            let caret = false;
            let selection;
            let blink;
            if (y == 21 + 3 && mode == 0) {
                char = (x >= vt.text.length + 1) ? " " : (">" + vt.text)[x];
                caret = (x == vt.caretPosition + 1);
                let sx0 = vt.selectionBounds[0];
                let sx1 = vt.selectionBounds[1];
                selection = x >= sx0 && x < sx1;
                selection = (vt.enter && x < vt.text.length + 1) ? true : selection;
                blink = (mode == 0);
            } else if (y == 20 + 3 && mode == 0) {
                // char = "-";
                char = (x < swatchesArr.length) ? swatchesArr[x] : " ";
            } else {
                if (ge.activeTab !== null) {
                    let t = ge.activeTab;
                    if (y + t.scroll.y >= t.data.length || x >= t.data[y + t.scroll.y].length) {
                        char = " ";
                    } else {
                        char = t.data[y + t.scroll.y][x];
                    }
                    for (let i = 0; i < t.carets.length; i++) {
                        if ((x + t.scroll.x) == t.carets[i].x && (y + t.scroll.y) == t.carets[i].y) {
                            caret = true;
                            blink = (mode == 1);
                        }
                    }
                } else {
                    char = " ";
                }
            }
            if (mode == 2 && y > 19 + 3) {char = " "; caret = false;};
            let cur = (x == fmouse[0] && y == fmouse[1]);
            // let curP = (x == fmouse[0] && y == fmouse[1]);
            // cur = (mode == 3) ? false : cur;
            let g = (cur && mode !== 2) ? (mode == 1 ? getGlyph("caret") : getGlyph(pchar)) : getGlyph(char);
            if (mode == 0 && x >= fmouse[0] && (x - fmouse[0]) < pchar.length && y == fmouse[1]) {
                char = pchar[x - fmouse[0]];
                g = getGlyph(char);
            }
            if (caret) {
                caret = caret && ((drawCount / 20 % 1 < 0.5) || !blink);
            }
            let paint = false;
            let canvas = null;
            if (ge.activeTab !== null && (y < 20 + 3 || mode == 1 || (mode == 2 && !showPatterns))) {
                if (ge.activeTab.canvas !== null) {
                    canvas = ge.activeTab.canvas.data;
                    if (canvas[y + ge.activeTab.scroll.y]) {
                        if (canvas[y + ge.activeTab.scroll.y][x]) {
                            paint = true;
                        }
                    }
                }
            }
            // if (mode == 3 && cur) {
            //     char = " "
            //     // g = getGlyph(char);
            // };
            if (selections !== null && (y < ((mode == 1) ? 22 + 3 : 20 + 3))) {
                selection = (selections[y][x] && x < ge.activeTab.data[y+ge.activeTab.scroll.y].length + 1) ? true : selection;
            }
            let maxloopy = 0;
            if (char !== " " || caret == true || cur || selection || paint || mode == 2) {
                for (let yy = 0; yy < g.length; yy++) {
                    for (let xx = 0; xx < g[yy].length; xx++) {
                        let brush = false;
                        if (ge.brushPositions) {
                            brush = ge.brushPositions[(y * 9) + yy][(x * 7) + xx];
                        }
                        let test = !selection;
                        test = ((xx == 0) && caret) ? !test : test
                        test = (test) ? "1" : "0";
                        let paintTest = (paint) ? canvas[y + ge.activeTab.scroll.y][x][xx + (yy * 7)] : false;
                        // let curPSub = (xx == smouse[0] && yy == smouse[1]);
                        // paintTest = (cur && curPSub && mode == 3) ? true : paintTest;
                        if (g[yy][xx] == test || paintTest || (brush && mode == 2)) {
                            // let tx = 0, ty = 0;
                            let sc = 0.8;
                            // tx = openSimplex.noise3D((x + (xx * 1e-1)) * 0.1, (y + (yy * 1e-1)) * 0.1, drawCount * 0.5e-1) * 0.0;
                            // ty = openSimplex.noise3D((x + (xx * 1e-1)) * 0.0, (y + (yy * 1e-1)) * 0.1, drawCount * 0.5e-1 + 1e4) * 0.1;
                            // ty = Math.sin((y*9 + (yy))*0.25 + drawCount * 0.2) * 0.01;
                            vertices.push(((x * 7 + xx) * 0.00303 - 1.155 + nx) * sc, ((y * 9 + yy) * -0.0095 + 1.062 - 0.14) * sc, 11 * sc, 1);
                            num++;
                            colors.push(0.75, 0.75, 0.75);   
                            // colors.push(0.95, 0.95, 0.95);   
                        }
                    }
                }
            }
            // console.log(maxloopy);
        }
    }
    if (nt < 2725) {nt = Math.min(2725, nt + 200)};
    // First idea for visualizing some data
    // for (let x = 0; x < 30; x++) {
    //      for (let y = 0; y < 15; y++) {
    //         let m = Math.sin(x * 1e-1 + y * drawCount * 1e-2);
    //          m += Math.cos(x * y * 0.01);
    //          let tx = -0.86, ty = 0;
    //          if (m < 0.5) {
    //              vertices.push(x * 0.01 * (9 / 16) * 4 + tx, -y * 4 * 0.01 + ty - 0.02, 50.0 * sc * 0.9, 1);
    //                          num++;
    //             colors.push(0, 0, 0);
    //              vertices.push(x * 0.01 * (9 / 16) * 4 + tx, -y * 4 * 0.01 + ty, 50.0 * sc * 0.9, 1);
    //                          num++;
    //             colors.push(0.75, 0.75, 0.75);
    //          }
    //     }
    // }
    if (vt.enter > 0) {vt.enter--};
    // logJavaScriptConsole(colors.length);
    // Create an empty buffer object to store the vertex buffer
    // var vertex_buffer = gl.createBuffer();
    //Bind appropriate array buffer to it
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    // Unbind the buffer
    gl.uniform1f(time, drawCount);
    gl.uniform1f(disturb, glitchDist);
    /*======== Associating shaders to buffer objects ========*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, termVBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
//  ----
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, dotsCBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Get the attribute location
    var cols = gl.getAttribLocation(selectedProgram, "colors");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(cols, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(cols);
// ----------
    var scalar = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    /*============= Drawing the primitive ===============*/
    // // Clear the canvas
    // gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Clear the color buffer bit
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, num);
    if (vt.recording || vt.playback) {
        vt.recordingFrame++;
    }
    if (vt.playback) {
        vt.play();
    }
}


let roundedSquare = new ShaderProgram("rounded-square");

roundedSquare.vertText = `
    // beginGLSL
    precision mediump float;
    attribute vec4 coordinates;
    attribute vec3 colors;
    uniform float time;
    uniform float resolution;
    uniform float disturb;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        // CRT curve
        // gl_Position.x += floor(sin(gl_Position.y * 1e2 + time)) * 0.1
        float disturbance = (floor(sin(gl_Position.y * 5. + time * 0.25 + tan(gl_Position.y * 1e3) * 0.125) * 2.)) * 0.125 * 0.125;
        float fluctuate = floor(mod(time * 1e5, 100.)/50.);
        float distr2 = (floor(sin(gl_Position.y * 1e-7 + time * 0.125 + tan(gl_Position.y * 2. + gl_Position.x * 1e-1) * 0.5) * 0.01)) * 10.1 * fluctuate;
        // distr2 *= 0.;
        // gl_Position.x += disturbance * 0.02 * disturb * (1. + distr2);
        // gl_Position.x += tan(floor(sin(gl_Position.y * 1e3))) * 0.1;
        // gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = coordinates.z * resolution * 2.;
        size = gl_PointSize;
        cols = colors;
        t = time;
        float vig = (roundedRectangle(myposition, vec2(0.0, 0.0), vec2(1.85, 1.9) * 0.5, 0.001, 0.05));
        gl_PointSize *= vig;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
roundedSquare.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangleFlicker (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // vec2 uv = gl_PointCoord.xy;
        float t2 = mod(t * 0.125, 3.14159 * 2.) * 1.;
        // t = 100. + (t * 1e-4);
        float w = 0.15 + (sin(t2 * 1e-2 * tan(t2 * 2e-2)) + 1.0) * 0.25;
        float d = length(max(abs(uv - pos), size * 0.5) - size * 0.5) * w - radius * 0.01;
        float oscFull = (sin(t2) * 0.5 + 0.5) * 3.75 * 0.;
        float oscScanning = (sin(gl_FragCoord.y * 1e-2 + t2) * 0.5 + 0.5) * 4.;
        return smoothstep(2.99 + oscFull + oscScanning, 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos), size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
         // float resolution = 1.0;
         vec2 screenSize = vec2(2560.0, 1440.0) * resolution;
         vec2 uv = gl_PointCoord.xy;
        uv = uv * 2. - 1.;
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.5);
        float rando = rand(uv * t) * 0.1;
        gl_FragColor = vec4(cols, color - rando);
    }
    // endGLSL
`;
roundedSquare.init();




// ———————————————————————————————



    roundedSquare.vertText = `
    // beginGLSL
    precision mediump float;
    attribute vec4 coordinates;
    attribute vec3 colors;
    uniform float time;
    uniform float resolution;
    uniform float disturb;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        // CRT curve
        // gl_Position.x += floor(sin(gl_Position.y * 1e2 + time)) * 0.1
        float disturbance = (floor(sin(gl_Position.y * 5. + time * 0.25 + tan(gl_Position.y * 1e3) * 0.125) * 2.)) * 0.125 * 0.125;
        float fluctuate = floor(mod(time * 1e5, 100.)/50.);
        float distr2 = (floor(sin(gl_Position.y * 1e-7 + time * 0.125 + tan(gl_Position.y * 2. + gl_Position.x * 1e-1) * 0.5) * 0.01)) * 10.1 * fluctuate;
        // distr2 *= 0.;
        gl_Position.x += disturbance * 0.1 * disturb * (1. + distr2);
        // gl_Position.x += tan(floor(sin(gl_Position.y * 1e3))) * 0.1;
        // gl_Position.xy *= (1.0 - distance(gl_Position.xy, vec2(0,0)) * 0.1) * 1.05;
        center = vec2(gl_Position.x, gl_Position.y);
        center = 512.0 + center * 512.0;
        myposition = vec2(gl_Position.x, gl_Position.y);
        alph = coordinates.w;
        gl_PointSize = coordinates.z * resolution * 2.;
        size = gl_PointSize;
        cols = colors;
        t = time;
        float vig = (roundedRectangle(myposition, vec2(0.0, 0.0), vec2(1.95, 1.92) * 0.5, 0.001, 0.05));
        gl_PointSize *= vig;
        // gl_PointSize = 25.0 + cos((coordinates.x + coordinates.y) * 4000000.) * 5.;
        // gl_PointSize = coordinates.z / (alph * (sin(myposition.x * myposition.y * 1.) * 3. + 0.5));
    }
    // endGLSL
`;
roundedSquare.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    uniform float resolution;
    varying vec2 myposition;
    varying vec2 center;
    varying float alph;
    varying float size;
    varying vec3 cols;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangleFlicker (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        // vec2 uv = gl_PointCoord.xy;
        float t2 = mod(t * 0.125, 3.14159 * 2.) * 1.;
        // t = 100. + (t * 1e-4);
        float w = 0.15 + (sin(t2 * 1e-2 * tan(t2 * 2e-2)) + 1.0) * 0.25;
        float d = length(max(abs(uv - pos), size * 0.5) - size * 0.5) * w - radius * 0.01;
        float oscFull = (sin(t2) * 0.5 + 0.5) * 3.75 * 0.;
        float oscScanning = (sin(gl_FragCoord.y * 1e-2 + t2) * 0.5 + 0.5) * 4.;
        return smoothstep(2.99 + oscFull + 1., 0.11, d * 10. / thickness * 5.0 * 0.125 * 1.5);
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos), size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
         // float resolution = 1.0;
         vec2 screenSize = vec2(2560.0, 1440.0) * resolution;
         vec2 uv = gl_PointCoord.xy;
        uv = uv * 2. - 1.;
        float color = roundedRectangleFlicker(uv, vec2(0.0, 0.0), vec2(0.125, 0.35) * 0.5, 0.1, 0.5);
        float rando = rand(uv * t) * 0.1;
        gl_FragColor = vec4(cols, color);
    }
    // endGLSL
`;
roundedSquare.init();