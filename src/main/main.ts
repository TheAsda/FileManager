import { app, protocol, ipcMain } from 'electron';
import { resolve, join } from 'path';
import { Window } from './Window';
import { hotReaload } from './hotReload';
import { init } from '@sentry/electron';
import { SettingsManager } from './managers/SettingsManager';
import { ThemesManager } from './managers/ThemesManager';
import { PathManager } from './managers/PathManager';
import { KeyMapManager } from './managers/KeyMapManager';
import { values, isEqual } from 'lodash';
import { Channels } from '../common/Channels';
import { ConfirmTypes } from '../common/ConfirmTypes';

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

let mainWindow: Window | null;
const settingsManager = new SettingsManager();
const themesManager = new ThemesManager();
const pathManager = new PathManager();
const keymapManager = new KeyMapManager();

const createWindow = () => {
  mainWindow = new Window({
    file: `file://${__dirname}/index.html`,
    openDevTools: isDev(),
    frame: false,
  });

  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    console.log('close');
    mainWindow = null;
  });

  registerIconsProtocol();
};

ipcMain.handle('close-event', () => {
  mainWindow?.webContents.send(Channels.BEFORE_QUIT);
  // app.quit();
});

const quitConfirms: string[] = [];

ipcMain.on(Channels.QUIT_CONFIRM, (event, args: string) => {
  quitConfirms.push(args);

  console.log('quitConfirms', quitConfirms);

  if (isEqual(values(ConfirmTypes), quitConfirms)) {
    app.quit();
  }
});

app.on('browser-window-focus', () => {
  mainWindow?.webContents.send('focused');
});

app.on('browser-window-blur', () => {
  mainWindow?.webContents.send('blurred');
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  console.log('window-all-closed');
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
