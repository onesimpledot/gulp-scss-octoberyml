import { src, dest, series } from "gulp"; 
import { scssToOctoberYml } from "../src/scss-to-october"; 
import { mergeOctoberFormFields } from "../src/merge-october-yaml"; 

function buildExampleYmlFromScss() {
  return src('example.scss')
    .pipe(scssToOctoberYml())
    .pipe(dest('output/'));
}

function mergeOctoberYamlTask() {
  return src("october.yml")
    .pipe(mergeOctoberFormFields("output/example.yml"))
    .pipe(dest("output/"));
}

exports.default = series(buildExampleYmlFromScss, mergeOctoberYamlTask);