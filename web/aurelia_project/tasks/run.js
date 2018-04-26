import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import { CLIOptions } from 'aurelia-cli';
import project from '../aurelia.json';
import build from './build';
import watch from './watch';
import  php  from 'gulp-connect-php';

const bs = browserSync.create();
const bsApi = browserSync.create();

gulp.task('php', (done) => {
  php.server({ base: 'api', port: 8010, keepalive: true});
  done();
});

let serve = gulp.series(
  build,
  'php',
  done => {
    bs.init({
      tunnel: false,
      open: 'external',
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
    bsApi.init({
      proxy: '127.0.0.1:8100',
      port: 8001,
      open: false,
      ui: false,
      notify: false
    }, (err, cb) => {
      if (err) return done(err);
      let urls = cb.options.get('urls').toJS();
      log(`API available At: ${urls.local}`);
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
  bsApi.reload();
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
