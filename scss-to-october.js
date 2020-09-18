const through2 = require('through2');
const Path = require('path');
const yaml = require('js-yaml');

const scssToOctoberYml = through2.obj(function (file, _, cb) {
    if (file.isBuffer()) {
        file.path = Path.basename(file.path, ".scss") + ".yml"; //change path ext to .yml

        //split scss file into lines, only lines including octoberyml: {} will be converted to a configuration option
        const lines = file.contents.toString().split(/(?:\r\n|\r|\n)/g);

        var commentPattern = / {0,}\$(.{1,})\: {0,}(.{1,}) {0,}; {0,}\/{2} {0,}octoberyml: {0,}(\{ {0,}.{0,} {0,}\})/i;

        let variables = {};

        for (const line of lines) {
            var match = line.match(commentPattern);
            if (match != null) {
                const variableName = match[1];
                const sanatizedVariableName = variableName.replace("-", "_");
                const defaultValue = match[2];
                let options;
                try {
                    options = looseJsonParse(match[3]);
                } catch (e) {
                    throw new Error("invalid options string: " + options);
                }
                variables[sanatizedVariableName] = { default: defaultValue, assetVar: variableName, ...options };
            }
        }

        //dump 
        file.contents = Buffer.from(yaml.safeDump(variables, {
            'styles': {
                '!!null': 'canonical' // dump null as ~
            },
        }));
        console.log("\n### OUTPUT ###\n");
        console.log(file.contents.toString());
    }
    cb(null, file);
});


//from https://developer.mozilla.org/
function looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')(); //@reviewer, don't use Function? alternative would be JSON.parse()
}

module.exports = scssToOctoberYml;