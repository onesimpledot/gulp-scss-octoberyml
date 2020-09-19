import * as Stream from "readable-stream";
import * as Path from "path";
import * as yaml from "js-yaml";

import * as rgbRegex from "rgb-regex";
import * as hexRegex from "hex-color-regex";

function scssToOctoberYml() {

    var stream = new Stream.Transform({ objectMode: true });

    stream._transform = function (originalFile, _, callback) {
        var file = originalFile.clone({ contents: false });

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
                    let options: any = {};
                    if (isColor(defaultValue)) {
                        options.type = "colorpicker";
                    }
                    try {
                        options = { ...looseJsonParse(match[3]), ...options };
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
        callback(null, file);
    }

    return stream;
}


//from https://developer.mozilla.org/
function looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')(); //@reviewer, don't use Function? alternative would be JSON.parse()
}

function isColor(strColor) {
    return rgbRegex({ exact: true }).test(strColor) || hexRegex({ exact: true }).test(strColor);
}

export { scssToOctoberYml };