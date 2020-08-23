import { ipcRenderer, IpcRendererEvent } from 'electron';

const registerIpc = <T>(
  channel: string,
  handler: (event: IpcRendererEvent, message: T) => void
) => {
  ipcRenderer.on(channel, handler);
};

const sendIpc = <T, U>(channel: string, message?: U): T => {
  return ipcRenderer.sendSync(channel, message) as T;
};

export { registerIpc, sendIpc };
