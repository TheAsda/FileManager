import { app } from 'electron';
import { resolve } from 'path';

const setDevAppData = () => {
  app.setPath('userData', resolve('./devAppData'));
};

export { setDevAppData };
