const { src, dest } = require("gulp");

const scssToOctober = require('./scss-to-october');

function defaultTask(cb) {
  // place code for your default task here
  cb();
  return src('example.scss')
    .pipe(scssToOctober)
    .pipe(dest('output/'));
}

exports.default = defaultTask;