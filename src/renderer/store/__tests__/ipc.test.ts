import { registerIpc, sendIpc } from '../ipc';
import { transports } from 'electron-log';
import { ipcRenderer } from 'electron';
import { mocked } from 'ts-jest/utils';
import { noop } from 'lodash';

transports.console.level = 'error';

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    sendSync: jest.fn(),
  },
}));

describe('Ipc', () => {
  const mockedIpcRenderer = mocked(ipcRenderer);

  beforeEach(() => {
    mockedIpcRenderer.on.mockClear();
    mockedIpcRenderer.sendSync.mockClear();
  });

  it('should send message to ipc', () => {
    sendIpc('TEST', 'message');

    expect(mockedIpcRenderer.sendSync).toBeCalledTimes(1);
    expect(mockedIpcRenderer.sendSync.mock.calls[0][0]).toEqual('TEST');
    expect(mockedIpcRenderer.sendSync.mock.calls[0][1]).toEqual('message');
  });

  it('should register new handler', () => {
    const handler = noop;
    registerIpc('TEST', handler);

    expect(mockedIpcRenderer.on).toBeCalledTimes(1);
    expect(mockedIpcRenderer.on.mock.calls[0][0]).toEqual('TEST');
    expect(mockedIpcRenderer.on.mock.calls[0][1]).toEqual(handler);
  });
});
