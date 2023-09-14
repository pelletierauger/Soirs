function setTabs() {

GrimoireTab.prototype.display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    // gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    // currentProgram = getProgram("new-flickering-dots-vert");
    // gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawSwirl(currentProgram);
    // drawDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    // makeFlame();
    
    drawTerminal(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawSwirlTop(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

    justine = ge.makeBlurredArray("quatre.scd", 0, 376, 109, 376 + 25);

ge.getTab("quatre.scd").display = function() {
    flameSize = openSimplex.noise2D(drawCount * 1e-1, drawCount * 1e-1 + 1000) * 0.5 + 0.5;
    
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawSwirl(currentProgram);
    // drawDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    ge.xFadeWithZeroes("quatre.scd", 0, 376, 109, 376 + 25, "quatre.scd", 0, 376 + 25, 1 - flameSize, justine);
    // ge.xFadeWithZeroes("quatre.scd", 0, 376, 109, 376 + 25, "cinq.scd", 0, 0, flameSize, justine);
    makeFlame();
    drawTerminal(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawSwirlTop(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

ge.getTab("deux.scd").darkPixels = ge.getTab("trois.scd");

gastongauche = ge.makeBlurredArray("sept.scd", 0, 75, 109, 75 + 25);
gastondroite = ge.makeBlurredArray("sept.scd", 0, 100, 109, 100 + 25);

ge.getTab("sept.scd").display = function() {
    flameSizeA = openSimplex.noise2D(drawCount * 0.5e-1, drawCount * 0.5e-1 + 1000) * 0.5 + 0.5;
    flameSizeB = openSimplex.noise2D(drawCount * 0.5e-1, drawCount * 0.5e-1 + 10000) * 0.5 + 0.5;
    flameSizeA *= Math.cos(drawCount * 1e-1) * 0.5 + 0.5;
    flameSizeB *= 1 - (Math.cos(drawCount * 1e-1) * 0.5 + 0.5);
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    // drawBG(currentProgram);
    currentProgram = getProgram("new-flickering-dots-vert");
    gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    currentProgram = getProgram("new-flickering-dots");
    gl.useProgram(currentProgram);
    // drawSwirl(currentProgram);
    // drawDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    ge.xFadeWithZeroes("sept.scd", 0, 75, 109 - 2, 75 + 25, "sept.scd",2, 125, 1 - flameSizeA, gastongauche);
    ge.xFadeWithZeroesAdd("sept.scd", 0, 100, 109 - 2, 100 + 25, "sept.scd", 2, 125, 1 - flameSizeB, gastondroite);
    // ge.xFadeWithZeroes("quatre.scd", 0, 376, 109, 376 + 25, "cinq.scd", 0, 0, flameSize, justine);
    drawFlame("sept.scd", 195, 995 + (9*25) + 40, flameSizeA);
    drawFlame("sept.scd", 540, 995 + (9*25) + 40, flameSizeB);
    drawTerminal(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawSwirlTop(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

ge.getTab("deux.scd").display = function() {
    bindFrameBuffer(texture, framebuf);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // draw the scene, presumably on a framebuffer
    let currentProgram = getProgram("pulsar-fog");
    gl.useProgram(currentProgram);
    drawBG(currentProgram);
    // currentProgram = getProgram("new-flickering-dots-vert");
    // gl.useProgram(currentProgram);
    // drawAlligatorQuietVert(currentProgram);
    // currentProgram = getProgram("new-flickering-dots");
    // gl.useProgram(currentProgram);
    // drawSwirl(currentProgram);
    // drawDots(currentProgram);
    currentProgram = getProgram("rounded-square");
    time = gl.getUniformLocation(currentProgram, "time"); 
    disturb = gl.getUniformLocation(currentProgram, "disturb"); 
    gl.useProgram(currentProgram);
    let fs = [];
    for (let i = 0; i < 13; i++) {
        fs.push(openSimplex.noise2D(drawCount * 0.5e-1, drawCount * 0.5e-1 + 1000 * i) * 0.5 + 1);
    }
    drawSmallFlame("deux.scd", 128+25, 48 + (647*9), 0.1+ 0.02 + fs[0]*0.2*0.5, drawCount + 1e4);
    drawSmallFlame("deux.scd", 180+25, 46 + (647*9), 0.11+ 0.02 + fs[1]*0.2*0.5);
    drawSmallFlame("deux.scd", 214+25, 49 + (647*9), 0.12+ 0.02 + fs[2]*0.2*0.5, drawCount + 1e3);
    drawSmallFlame("deux.scd", 265+25, 43 + (647*9), 0.125+ 0.02 + fs[3]*0.1*0.5, drawCount + 1e2);
    drawSmallFlame("deux.scd", 289+25, 43 + (647*9), 0.12+ 0.02 + fs[4]*0.1*0.5, drawCount + 1e1);
    drawSmallFlame("deux.scd", 324+25, 35 + (647*9), 0.11 + 0.02+ fs[5]*0.1*0.5, drawCount - 1e1);
    drawSmallFlame("deux.scd", 378+25, 29 + (647*9), 0.11 + 0.02+ fs[6]*0.1*0.5, drawCount - 1e2);
    drawSmallFlame("deux.scd", 434+25, 37 + (647*9), 0.14 + 0.02+ fs[7]*0.1*0.5, drawCount - 1e3);
    drawSmallFlame("deux.scd", 462+25, 37 + (647*9), 0.13 + 0.02+ fs[8]*0.1*0.5, drawCount - 1e4);
    drawSmallFlame("deux.scd", 491+25, 49 + (647*9), 0.11 + 0.02+ fs[9]*0.2*0.5, drawCount - 1e5);
    drawSmallFlame("deux.scd", 536+25, 50 + (647*9), 0.11 + 0.02+ fs[10]*0.2*0.5, drawCount - 2e5);
    drawSmallFlame("deux.scd", 567+25, 48 + (647*9), 0.11 + 0.02+ fs[11]*0.2*0.5, drawCount - 3e5);
    drawSmallFlame("deux.scd", 622+6, 54 + (647*9), 0.15 + 0.02+ fs[12]*0.15*0.5, drawCount - 4e5);
    drawTerminal(currentProgram);
    // drawSwirl(currentProgram);
    // drawPulsar(currentProgram);
    // unbind the buffer and draw the resulting texture....
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, cnvs.width, cnvs.height);
    // 
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 
    gl.clearColor(0, 0, 0, 1); // clear to white
    // 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
    var textureShader = getProgram("textu");
    gl.useProgram(textureShader);
    // 
    aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([-1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    vbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    itemSize = 2;
    numItems = vertices.length / itemSize;
    textureShader.aVertexPosition = gl.getAttribLocation(textureShader, "a_position");
    gl.enableVertexAttribArray(textureShader.aVertexPosition);
    gl.vertexAttribPointer(textureShader.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);
    // 
    var textureLocation = gl.getUniformLocation(textureShader, "u_texture");
    gl.uniform1i(textureLocation, 0);
    var timeLocation = gl.getUniformLocation(textureShader, "time");
    gl.uniform1f(timeLocation, drawCount * 0.01);
    // 
    var scalar = gl.getUniformLocation(textureShader, "resolution");
    gl.uniform1f(scalar, resolutionScalar);
    // 
    var texcoordLocation = gl.getAttribLocation(textureShader, "a_texcoord");
    gl.enableVertexAttribArray(texcoordLocation);
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
};



    
}

// setTabs();