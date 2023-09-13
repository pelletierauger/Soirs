var fs = require('fs');
let computedInput = "";
let fileName = "chandelles-montage";

let sequences = [{
        path: `/Volumes/Volumina/frames/baumes/chandelle/chandelle-`,
        start: 1,
        end: 500,
        copies: 1
    },
    {
        path: `/Volumes/Volumina/frames/baumes/chandelle2/chandelle2-`,
        start: 1,
        end: 500,
        copies: 1
    }
];

for (s of sequences) {
    for (let f = s.start; f <= s.end; f++) {
        var formattedF = "" + f;
        while (formattedF.length < 5) {
            formattedF = "0" + formattedF;
        }
        let line = `file '${s.path}${formattedF}.png'\n`;
        for (let i = 0; i < s.copies; i++) {
            computedInput += line;
        }
    }
}

fs.writeFile(fileName + '.txt', computedInput, function(err) {
    if (err) {
        return console.error(err);
    } else {
        console.log(fileName + '.txt written successfully.');
    }
});