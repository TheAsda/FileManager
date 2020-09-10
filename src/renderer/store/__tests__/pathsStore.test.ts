import { createEvent } from 'effector';
import { addPath, pathsStore, setRecent } from '../pathsStore';
import { transports } from 'electron-log';

transports.console.level = 'error';

jest.mock('../ipc', () => ({
  sendIpc: jest.fn().mockImplementation(() => []),
}));

describe('Paths store', () => {
  const reset = createEvent();
  pathsStore.reset(reset);

  beforeEach(() => {
    reset();
  });

  it('should be empty on init', () => {
    expect(pathsStore.getState().list).toEqual([]);
  });

  it('should add path to store', () => {
    addPath('test1');

    expect(pathsStore.getState().list).toEqual(['test1']);

    addPath('test2');

    expect(pathsStore.getState().list).toEqual(['test1', 'test2']);
  });

  it('should not add same element more than once', () => {
    addPath('test1');
    addPath('test2');
    addPath('test1');

    expect(pathsStore.getState().list).toEqual(['test1', 'test2']);
  });

  it('should set recent value', () => {
    addPath('test1');
    setRecent('test1');

    expect(pathsStore.getState().recent).toEqual('test1');
  });

  it('should not set recent if item does not exist', () => {
    setRecent('test');

    expect(pathsStore.getState().recent).toBeUndefined();
  });
});
