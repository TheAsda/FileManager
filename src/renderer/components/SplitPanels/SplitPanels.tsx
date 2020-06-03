import React from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import { Explorer, Terminal } from '../panels';
import { useCache, useManagers } from '@fm/hooks';

interface SplitPanelsProps {
  panels: SplitPaneProps;
}

const SplitPanels = (props: SplitPanelsProps) => {
  const { getCached, updateStorage } = useCache();
  const { directoryManager, keysManager, getTerminalManager } = useManagers();

  return (
    <SplitPane {...props.panels}>
      <Explorer
        addToCache={updateStorage}
        getCachedDirectory={getCached}
        directoryManager={directoryManager}
        keysManager={keysManager}
        initialDirectoryArray={['C:']}
      />
      <Terminal terminalManager={getTerminalManager()} />
    </SplitPane>
  );
};

export { SplitPanels };
