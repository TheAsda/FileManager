import { createEvent } from 'effector';
import { fileActionApi, FileActionInfo, fileActionStore } from '../fileActionStore';
import { transports } from 'electron-log';

transports.console.level = 'error';

describe('File action store', () => {
  const reset = createEvent();
  fileActionStore.reset(reset);

  beforeEach(() => {
    reset();
  });

  it('should be empty on init', () => {
    expect(fileActionStore.getState().display).toBe(false);
    expect(fileActionStore.getState().info).toBeUndefined();
  });

  it('should ignore empty array of files on activation', () => {
    const files: FileActionInfo = {
      destinationPath: 'destination/path',
      files: [],
      type: 'copy',
    };

    fileActionApi.activate(files);

    expect(fileActionStore.getState().display).toBe(false);
    expect(fileActionStore.getState().info).toBeUndefined();
  });

  it('should toggle display and save files on activation', () => {
    const files: FileActionInfo = {
      destinationPath: 'destination/path',
      files: [
        {
          name: 'file',
          path: 'path/to/file',
          attributes: {
            directory: false,
            hidden: false,
            readonly: false,
            system: false,
          },
        },
      ],
      type: 'copy',
    };

    fileActionApi.activate(files);

    expect(fileActionStore.getState().display).toBe(true);
    expect(fileActionStore.getState().info).toEqual(files);
  });

  it('should toggle display and empty info on deactivate', () => {
    const files: FileActionInfo = {
      destinationPath: 'destination/path',
      files: [
        {
          name: 'file',
          path: 'path/to/file',
          attributes: {
            directory: false,
            hidden: false,
            readonly: false,
            system: false,
          },
        },
      ],
      type: 'copy',
    };

    fileActionApi.activate(files);
    fileActionApi.deactivate();

    expect(fileActionStore.getState().display).toBe(false);
    expect(fileActionStore.getState().info).toBeUndefined();
  });
});
