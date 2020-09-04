import { info } from 'electron-log';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const registerIpc = <T>(
  channel: string,
  handler: (event: IpcRendererEvent, message: T) => void
) => {
  info(`Register handler on ${channel} channel`);
  ipcRenderer.on(channel, handler);
};

const sendIpc = <T, U>(channel: string, message?: U): T => {
  info(`Sending sync message to ${channel} channel`);
  return ipcRenderer.sendSync(channel, message) as T;
};

export { registerIpc, sendIpc };
