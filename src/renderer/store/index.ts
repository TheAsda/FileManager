import { explorerApi } from './explorer';
import { previewApi } from './preview';
import { terminalApi } from './terminal';
import { merge } from 'lodash';

const storeApi = merge(explorerApi, previewApi, terminalApi);

export { storeApi };
export * from './store';
export * from './fileAction';
