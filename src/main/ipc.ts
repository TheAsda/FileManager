import { ipcMain, IpcMainEvent } from 'electron';
import { debug, info } from 'electron-log';
import { getWindow } from './window';

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

interface ISendIpc {
  <T>(channel: string): T;
  <T>(channel: string, message: unknown): T;
}

const sendIpc: ISendIpc = (channel: string, message?: unknown) => {
  info(`Sending sync message to ${channel} channel`);
  getWindow().webContents.send(channel, message);
};

export { registerIpc, unregisterIpc, sendIpc };
