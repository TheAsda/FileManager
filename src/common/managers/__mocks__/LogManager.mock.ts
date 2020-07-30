import { noop } from 'lodash';
import { ILogManager } from '../LogManager';

const mockedLogger: ILogManager = {
  critical: noop,
  debug: noop,
  error: noop,
  log: noop,
};

export { mockedLogger };
