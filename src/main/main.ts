import { app, ipcMain, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { hotReload } from './hotReload';
import { SettingsManager } from './managers/SettingsManager';
import { ThemesManager } from './managers/ThemesManager';
import { PathManager } from './managers/PathManager';
import { KeyMapManager } from './managers/KeyMapManager';
import { values, isEqual } from 'lodash';
import { Channels } from '../common/Channels';
import { ConfirmTypes } from '../common/ConfirmTypes';
import { LayoutManager } from './managers/LayoutManager';
import { setDevAppData } from './setDevAppData';
import { initLogger } from './initLogger';
import { setWindow, getWindow } from './window';
import isDev from 'electron-is-dev';
import { openDevTools } from './openDevTools';
import { initLayoutIpc, layoutStore } from './managers/initLayoutIpc';
import { initSettingsIpc } from './managers/initSettingsIpc';
// import { log } from 'electron-log';

initLogger();

if (isDev) {
  hotReload();
  setDevAppData();
  openDevTools();
}

app.allowRendererProcessReuse = false;

// const settingsManager = new SettingsManager();
const themesManager = new ThemesManager();
const pathManager = new PathManager();
const keymapManager = new KeyMapManager();
// const layoutManager = new LayoutManager();
initLayoutIpc();
initSettingsIpc();

const createWindow = async (): Promise<BrowserWindow> => {
  const window = new BrowserWindow({
    frame: false,
    width: layoutStore.get().window.width,
    height: layoutStore.get().window.height,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    titleBarStyle: 'hiddenInset',
  });

  window.on('ready-to-show', () => {
    window.show();
  });

  window.on('closed', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setWindow(null);
  });

  await window.loadFile(resolve(__dirname, 'index.html'));

  return window;
};

app.on('window-all-closed', () => {
  app.quit();
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('activate', async () => {
  if (!getWindow()) {
    setWindow(await createWindow());
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('ready', async () => {
  setWindow(await createWindow());

  getWindow().once('ready-to-show', () => {
    getWindow().show();
  });

  getWindow().on('maximize', () => {
    getWindow().webContents.send('maximized');
  });

  getWindow().on('unmaximize', () => {
    getWindow().webContents.send('unmaximized');
  });
});

ipcMain.handle('minimize-event', () => {
  getWindow().minimize();
});

ipcMain.handle('maximize-event', () => {
  getWindow().maximize();
});

ipcMain.handle('unmaximize-event', () => {
  getWindow().unmaximize();
});

// ipcMain.handle('close-event', () => {
// mainWindow?.webContents.send(Channels.BEFORE_QUIT);
// });

const quitConfirms: string[] = [];

ipcMain.on(Channels.QUITTER, (event, args: string) => {
  quitConfirms.push(args);

  console.log('quitConfirms', quitConfirms);

  if (isEqual(values(ConfirmTypes), quitConfirms)) {
    app.quit();
  }
});

// app.on('browser-window-focus', () => {
//   mainWindow?.webContents.send('focused');
// });

// app.on('browser-window-blur', () => {
//   mainWindow?.webContents.send('blurred');
// });
