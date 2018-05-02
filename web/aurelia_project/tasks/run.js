import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import { CLIOptions } from 'aurelia-cli';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';

const bs = browserSync.create();

let serve = gulp.series(
  build,
  done => {
    bs.init({
      ghostMode: false,
      tunnel: false,
      open: 'local',
      port: 8000,
      online: true,
      browser: ['chrome'],
      logLevel: 'silent',
      server: {
        baseDir: [project.platform.baseDir],
        middleware: [historyApiFallback(), (req, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }]
      }
    }, (err, cb) => {
      if (err) return done(err);
      let urls = cb.options.get('urls').toJS();
      log(`Application available At: ${urls.local}`);
      log(`BrowserSync available At: ${urls.ui}`);
      done();
    });
  }
);

function log(message) {
  console.log(message); //eslint-disable-line no-console
}

function reload() {
  log('Refreshing the browser');
  bs.reload();
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    done => { watch(reload); done(); }
  );
} else {
  run = serve;
}

export default run;
