const { src, dest } = require("gulp");
const through2 = require('through2');
const Path = require('path');
const yaml = require('js-yaml');
function defaultTask(cb) {
  // place code for your default task here
  cb();
  return src('input.scss')
    .pipe(through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {
        file.contents = Buffer.from(file.contents);

        file.path = Path.basename(file.path, ".scss") + ".yml"; //change path ext to .yml


        //dump 
        file.contents = Buffer.from(yaml.safeDump({ test: "hi", test2: [{ name: "farbe", color: "red" }] }, {
          'styles': {
            '!!null': 'canonical' // dump null as ~
          },
          'sortKeys': true        // sort object keys
        }));
      }
      cb(null, file);
    }))
    .pipe(dest('output/'));
}

exports.default = defaultTask