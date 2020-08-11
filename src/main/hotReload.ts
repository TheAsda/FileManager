/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { join } from 'path';

const hotReaload = () =>
  require('electron-reload')(__dirname, {
    electron: join(__dirname, 'node_modules', '.bin', 'electron'),
  });

export { hotReaload };
