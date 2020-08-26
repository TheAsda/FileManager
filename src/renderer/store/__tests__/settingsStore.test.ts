import { DEFAULT_THEME } from '@fm/common';
import { createEvent } from 'effector';
import { settingsApi, settingsStore } from '../settingsStore';
import { mocked } from 'ts-jest/utils';
import { transports } from 'electron-log';
import { sendIpc } from '../ipc';

transports.console.level = 'error';

jest.mock('../ipc', () => ({
  sendIpc: jest.fn().mockImplementation(() => DEFAULT_THEME),
}));

describe('Settings store', () => {
  const reset = createEvent();
  settingsStore.reset(reset);
  const mockedSendIpc = mocked(sendIpc);

  beforeEach(() => {
    reset();
    mockedSendIpc.mockClear();
  });

  it('should toggle auto preview', () => {
    const initialAutoPreview = settingsStore.getState().autoPreview;

    settingsApi.toggleAutoPreview();

    expect(settingsStore.getState().autoPreview).toBe(!initialAutoPreview);

    settingsApi.toggleAutoPreview();

    expect(settingsStore.getState().autoPreview).toBe(initialAutoPreview);
  });

  it('should toggle show hidden', () => {
    const initialShowHidden = settingsStore.getState().showHidden;

    settingsApi.toggleShowHidden();

    expect(settingsStore.getState().showHidden).toBe(!initialShowHidden);

    settingsApi.toggleShowHidden();

    expect(settingsStore.getState().showHidden).toBe(initialShowHidden);
  });

  it('should set theme', () => {
    const newTheme = 'custom';
    settingsApi.setTheme(newTheme);

    expect(settingsStore.getState().themeName).toEqual(newTheme);
    expect(mockedSendIpc).toHaveBeenCalledTimes(1);
    expect(mockedSendIpc.mock.calls[0][1]).toEqual(newTheme);
  });
});
