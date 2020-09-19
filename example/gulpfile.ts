import { src, dest, series } from "gulp"; 
import { scssToOctober } from "../src/scss-to-october"; 
import { mergeOctoberYaml } from "../src/merge-october-yaml"; 

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