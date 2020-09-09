import { transports } from 'electron-log';

const initLogger = () => {
  transports.console.level = 'silly';
};

export { initLogger };
