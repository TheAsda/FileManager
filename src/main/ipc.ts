import { ipcMain, IpcMainEvent } from 'electron';

const registerIpc = <T>(channer: string, handler: (event: IpcMainEvent, message: T) => void) => {
  ipcMain.on(channer, handler);
};

const unregisterIpc = (channel: string) => {
  ipcMain.removeHandler(channel);
};

export { registerIpc, unregisterIpc };
