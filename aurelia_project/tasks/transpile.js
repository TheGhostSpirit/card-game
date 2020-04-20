import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import cache from 'gulp-cache';
import project from '../aurelia.json';
import fs from 'fs';
import through from 'through2';
import { CLIOptions, build, Configuration } from 'aurelia-cli';

const env = CLIOptions.getEnvironment();
const buildOptions = new Configuration(project.build.options);
const useCache = buildOptions.isApplicable('cache');

const configureEnvironment = () => {
  return gulp.src(`aurelia_project/environments/${env}.js`, {
    since: gulp.lastRun(configureEnvironment)
  })
    .pipe(rename('environment.js'))
    .pipe(through.obj((file, _, cb) => {
      fs.unlink(`${project.paths.root}/${file.relative}`, () => {
        cb(null, file);
      });
    }))
    .pipe(gulp.dest(project.paths.root));
};

const buildJavaScript = () => {
  let transpile = babel(project.transpiler.options);
  if (useCache) {
    transpile = cache(transpile, {
      name: project.name + '-' + env
    });
  }

  return gulp.src(project.transpiler.source, {
    sourcemaps: true,
    since: gulp.lastRun(buildJavaScript)
  })
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(transpile)
    .pipe(build.bundle());
};

export default gulp.series(
  configureEnvironment,
  buildJavaScript
);
