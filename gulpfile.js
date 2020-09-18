const { src, dest } = require("gulp");
const scssToOctober = require('./scss-to-october');
const mergeOctoberYaml = require("./merge-october-yaml");

function defaultTask(cb) {
  // place code for your default task here
  cb();
  return src('example.scss')
    .pipe(scssToOctober())
    .pipe(dest('output/'));
}

function mergeYaml(cb) {
  cb();
  return src("october.yml")
    .pipe(mergeOctoberYaml("output/example.yml"))
    .pipe(dest("output/"));
}

exports.default = mergeYaml;