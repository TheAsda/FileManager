import { BrowserWindow } from 'electron';

let window: BrowserWindow;

const getWindow = (): BrowserWindow => {
  return window;
};

const setWindow = (w: BrowserWindow) => {
  window = w;
};

export { getWindow, setWindow };
