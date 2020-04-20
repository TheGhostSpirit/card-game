import { build } from 'aurelia-cli';
import gulp from 'gulp';
import project from '../aurelia.json';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import less from 'gulp-less';

const processCSS = () => {
  return gulp.src(project.cssProcessor.source, { sourcemaps: true })
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(less())
    .pipe(build.bundle());
};

export default processCSS;
