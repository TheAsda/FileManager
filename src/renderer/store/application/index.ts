import { explorerApi } from './api/explorer';
import { previewApi } from './api/preview';
import { terminalApi } from './api/terminal';
import { merge } from 'lodash';

const storeApi = merge(explorerApi, previewApi, terminalApi);

export { storeApi };
export * from './store';
export * from './interfaces';
