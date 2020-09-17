const { src, dest } = require("gulp");
const through2 = require('through2');
const Path = require('path');
const yaml = require('js-yaml');
const readline = require('readline');

function defaultTask(cb) {
  // place code for your default task here
  cb();
  return src('input.scss')
    .pipe(through2.obj(function (file, _, cb) {
      if (file.isBuffer()) {

        file.path = Path.basename(file.path, ".scss") + ".yml"; //change path ext to .yml

        //split scss file into lines, only lines including octoberyml: {} will be converted to a configuration option
        const lines = file.contents.toString().split(/(?:\r\n|\r|\n)/g);

        var commentPattern = / {0,}\$(.{1,})\: {0,}(.{1,}) {0,}; {0,}\/{2} {0,}octoberyml: {0,}\{ {0,}(.{0,}) {0,}\}/i;

        let variables = {};

        for(const line of lines) {
          var match = line.match(commentPattern);
          if(match != null) {
            const variableName = match[1];
            const defaultValue = match[2];
            const options = match[3];
            const optionsObject = {};
            variables[variableName] = {test: "hi"};
            console.log(variables);
          } 
        }

        //dump 
        file.contents = Buffer.from(yaml.safeDump(variables, {
          'styles': {
            '!!null': 'canonical' // dump null as ~
          },
          'sortKeys': true        // sort object keys
        }));
        console.log("OUTPUT");
        console.log(file.contents.toString());
      }
      cb(null, file);
    }))
    .pipe(dest('output/'));
}

exports.default = defaultTask