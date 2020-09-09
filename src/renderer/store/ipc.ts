import { info } from 'electron-log';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const registerIpc = <T>(
  channel: string,
  handler: (event: IpcRendererEvent, message: T) => void
) => {
  info(`Register handler on ${channel} channel`);
  ipcRenderer.on(channel, handler);
};

interface ISendIpc {
  <T>(channel: string): T;
  <T>(channel: string, message: unknown): T;
}

const sendIpc: ISendIpc = <T>(channel: string, message?: unknown): T => {
  info(`Sending sync message to ${channel} channel`);
  return ipcRenderer.sendSync(channel, message) as T;
};

export { registerIpc, sendIpc };
