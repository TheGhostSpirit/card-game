import gulp from 'gulp';
import { build } from 'aurelia-cli';
import cache from 'gulp-cache';

const clearTraceCache = () => {
  return build.clearCache();
};

const clearTranspileCache = () => {
  return cache.clearAll();
};

export default gulp.series(
  clearTraceCache,
  clearTranspileCache
);
