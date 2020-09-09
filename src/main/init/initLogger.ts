import { transports } from 'electron-log';

const initLogger = () => {
  transports.console.level = 'info';
};

export { initLogger };
