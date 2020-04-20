import gulp from 'gulp';
import project from '../aurelia.json';
import { build } from 'aurelia-cli';

const processJson = () => {
  return gulp.src(project.jsonProcessor.source, { since: gulp.lastRun(processJson) })
    .pipe(build.bundle());
};

export default processJson;
