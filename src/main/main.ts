import { app, protocol } from 'electron';
import { resolve, join } from 'path';
import { Window } from './Window';
import { hotReaload } from './hotReload';
import { init } from '@sentry/electron';

const mode = process.env.NODE_ENV || 'production';
const isDev = () => mode !== 'production';

if (isDev()) {
  if (process.env.SENTRY_DSN) {
    init({
      dsn: process.env.SENTRY_DSN,
    });
  }
  hotReaload();
  app.setPath('userData', resolve('./devAppData'));
}

app.allowRendererProcessReuse = false;

const registerIconsProtocol = () => {
  protocol.registerFileProtocol('icons', (req, callback) => {
    const filePath = join(__dirname, '/icons/' + req.url.substring('icons://'.length));

    callback({ path: filePath });
  });
};

const createWindow = () => {
  const mainWindow = new Window({
    file: `file://${__dirname}/index.html`,
    openDevTools: isDev(),
  });

  registerIconsProtocol();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
