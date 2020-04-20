import gulp from 'gulp';
import path from 'path';
import minimatch from 'minimatch';
import project from '../aurelia.json';

const getNormalizedInstruction = () => {
  const files = project.build.copyFiles;
  const normalizedInstruction = {};

  for (const key in files) {
    normalizedInstruction[path.posix.normalize(key)] = files[key];
  }

  return normalizedInstruction;
};

const prepareFilePath = (filePath) => {
  let preparedPath = filePath.replace(process.cwd(), '').slice(1);

  if (/^win/.test(process.platform)) {
    preparedPath = preparedPath.replace(/\\/g, '/');
  }

  return preparedPath;
};

const copyFiles = (done) => {
  if (typeof project.build.copyFiles !== 'object') {
    done();
    return;
  }

  const instruction = getNormalizedInstruction();
  const files = Object.keys(instruction);

  return gulp.src(files, { since: gulp.lastRun(copyFiles) })
    .pipe(gulp.dest(x => {
      const filePath = prepareFilePath(x.path);
      const key = files.find(f => minimatch(filePath, f));
      return instruction[key];
    }));
};

export default copyFiles;
