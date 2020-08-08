import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron';

const defaultWindowSettings = {
  minHeight: 600,
  minWidth: 800,
  width: 1000,
  height: 800,
  webPreferences: {
    nodeIntegration: true,
  },
};

interface WindowProps extends BrowserWindowConstructorOptions {
  file: string;
  openDevTools: boolean;
}

class Window extends BrowserWindow {
  constructor({ file, openDevTools, ...windowSettings }: WindowProps) {
    super({ ...defaultWindowSettings, ...windowSettings });

    this.loadURL(file);

    if (openDevTools) {
      this.webContents.openDevTools();
    }

    this.once('ready-to-show', () => {
      this.show();
    });

    this.on('maximize', () => {
      this.webContents.send('maximized');
    });

    this.on('unmaximize', () => {
      this.webContents.send('unmaximized');
    });

    ipcMain.handle('minimize-event', () => {
      this.minimize();
    });

    ipcMain.handle('maximize-event', () => {
      this.maximize();
    });

    ipcMain.handle('unmaximize-event', () => {
      this.unmaximize();
    });
  }
}

export { Window };
