import gulp from 'gulp';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback/lib';
import project from '../aurelia.json';
import { CLIOptions } from 'aurelia-cli';
import build from './build';
import watch from './watch';

const bs = browserSync.create();

const log = (message) => {
  const logger = console;
  logger.log(message);
};

const serve = gulp.series(
  build,
  done => {
    bs.init({
      online: false,
      open: CLIOptions.hasFlag('open') || project.platform.open,
      port: CLIOptions.getFlagValue('port') || project.platform.port,
      host: CLIOptions.getFlagValue('host') || project.platform.host || 'localhost',
      logLevel: 'silent',
      server: {
        baseDir: [ project.platform.baseDir ],
        middleware: [ historyApiFallback(), (_, res, next) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        } ]
      }
    }, (err, instance) => {
      if (err) return done(err);
      const urls = instance.options.get('urls').toJS();
      const host = instance.options.get('host');
      const port = instance.options.get('port');

      if (host !== 'localhost') {
        log(`Application Available At: http://${host}:${port}`);
      }

      log(`Application Available At: ${urls.local}`);
      log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });
  }
);

const reload = () => {
  log('Refreshing the browser');
  bs.reload();
};

const run = gulp.series(
  serve,
  done => { watch(reload); done(); }
);

const shutdownAppServer = () => {
  bs.exit();
};

export { run as default, serve, shutdownAppServer };
