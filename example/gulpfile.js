const { src, dest, series } = require("gulp");
const scssToOctober = require('../src/scss-to-october');
const mergeOctoberYaml = require("../src/merge-october-yaml");

function buildExampleYmlFromScss() {
  return src('example.scss')
    .pipe(scssToOctober())
    .pipe(dest('output/'));
}

function mergeOctoberYamlTask() {
  return src("october.yml")
    .pipe(mergeOctoberYaml("output/example.yml"))
    .pipe(dest("output/"));
}

exports.default = series(buildExampleYmlFromScss, mergeOctoberYamlTask);