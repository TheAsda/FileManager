import { createEvent } from 'effector';
import { settingsApi, settingsStore } from '../settingsStore';

describe('Settings store', () => {
  const reset = createEvent();
  settingsStore.reset(reset);

  beforeEach(() => {
    reset();
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

    expect(settingsStore.getState().theme).toEqual(newTheme);
  });
});
