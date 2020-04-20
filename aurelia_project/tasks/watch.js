import gulp from 'gulp';
import minimatch from 'minimatch';
import gulpWatch from 'gulp-watch';
import debounce from 'debounce';
import project from '../aurelia.json';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import processJson from './process-json';
import copyFiles from './copy-files';
import { build } from 'aurelia-cli';

const debounceWaitTime = 100;
let isBuilding = false;
const pendingRefreshPaths = [];
let watchCallback = () => {};
const watches = [
  { name: 'transpile', callback: transpile, source: project.transpiler.source },
  { name: 'markup', callback: processMarkup, source: project.markupProcessor.source },
  { name: 'CSS', callback: processCSS, source: project.cssProcessor.source },
  { name: 'JSON', callback: processJson, source: project.jsonProcessor.source }
];

const log = (message) => {
  const logger = console;
  logger.log(message);
};

const readProjectConfiguration = () => {
  return build.src(project);
};

const writeBundles = () => {
  return build.dest();
};

if (typeof project.build.copyFiles === 'object') {
  for (const src of Object.keys(project.build.copyFiles)) {
    watches.push({ name: 'file copy', callback: copyFiles, source: src });
  }
}

const watch = (callback) => {
  watchCallback = callback || watchCallback;

  for(const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for(const glob of watcher.source) {
        watchPath(glob);
      }
    } else {
      watchPath(watcher.source);
    }
  }
};

const watchPath = (p) => {
  gulpWatch(
    p,
    {
      read: false,
      verbose: true
    },
    (vinyl) => processChange(vinyl));
};

const processChange = (vinyl) => {
  if (vinyl.path && vinyl.cwd && vinyl.path.startsWith(vinyl.cwd)) {
    const pathToAdd = vinyl.path.slice(vinyl.cwd.length + 1);
    log(`Watcher: Adding path ${pathToAdd} to pending build changes...`);
    pendingRefreshPaths.push(pathToAdd);
    refresh();
  }
};

const refresh = debounce(() => {
  if (isBuilding) {
    log('Watcher: A build is already in progress, deferring change detection...');
    return;
  }

  isBuilding = true;

  const paths = pendingRefreshPaths.splice(0);
  const refreshTasks = [];

  for (const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for(const source of watcher.source) {
        if (paths.find(path => minimatch(path, source))) {
          refreshTasks.push(watcher);
        }
      }
    }
    else {
      if (paths.find(path => minimatch(path, watcher.source))) {
        refreshTasks.push(watcher);
      }
    }
  }

  if (refreshTasks.length === 0) {
    log('Watcher: No relevant changes found, skipping next build.');
    isBuilding = false;
    return;
  }

  log(`Watcher: Running ${refreshTasks.map(x => x.name).join(', ')} tasks on next build...`);

  const toExecute = gulp.series(
    readProjectConfiguration,
    gulp.parallel(refreshTasks.map(x => x.callback)),
    writeBundles,
    (done) => {
      isBuilding = false;
      watchCallback();
      done();
      if (pendingRefreshPaths.length > 0) {
        log('Watcher: Found more pending changes after finishing build, triggering next one...');
        refresh();
      }
    }
  );

  toExecute();
}, debounceWaitTime);

export default watch;
