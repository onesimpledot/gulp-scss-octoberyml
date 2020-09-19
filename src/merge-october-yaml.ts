import * as Stream from "readable-stream";
import * as yaml from "js-yaml";
import * as fs from "fs";

function mergeOctoberFormFields(obj) {
    if (!obj) throw new Error("Argument required");

    var stream = new Stream.Transform({ objectMode: true });

    stream._transform = function (originalFile, _, callback) {
        var file = originalFile.clone({ contents: false });

        if (file.isBuffer()) {

            const input = yaml.load(file.contents.toString());

            const toMerge = yaml.load(fs.readFileSync(obj).toString());

            input.form = {};
            input.form.fields = {};
            input.form.fields = { ...input.form.fields, ...toMerge };
            console.log(toMerge);

            //dump 
            file.contents = Buffer.from(yaml.safeDump(input, {
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
export { mergeOctoberFormFields };