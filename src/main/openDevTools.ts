import electronDebug from 'electron-debug';

const openDevTools = () =>
  electronDebug({
    devToolsMode: 'detach',
  });

export { openDevTools };
