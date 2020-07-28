import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

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
  }
}

export { Window };
