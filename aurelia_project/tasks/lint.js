import gulp from 'gulp';
import eslint from 'gulp-eslint';
import project from '../aurelia.json';

const lint = () => {
  return gulp.src(project.transpiler.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
};

export default lint;
