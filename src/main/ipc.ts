import { ipcMain, IpcMainEvent } from 'electron';
import { debug } from 'electron-log';

const registerIpc = <T>(channel: string, handler: (event: IpcMainEvent, message: T) => void) => {
  const handlerWithLog = (event: IpcMainEvent, message: T) => {
    debug(`Got message: ${JSON.stringify(message)} on channel ${channel}`);
    handler(event, message);
  };
  ipcMain.on(channel, handlerWithLog);
};

const unregisterIpc = (channel: string) => {
  ipcMain.removeHandler(channel);
};

export { registerIpc, unregisterIpc };
