import React, { useState } from 'react';
import './style.css';
import { HotKeys } from 'react-hotkeys';
import { useCache, useManagers } from '@fm/hooks';
import { Layout, IDirectoryManager, ITerminalManager } from '@fm/common';
import { cloneDeep, noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import { Preview } from '../Preview';

const Window = () => {
  const { getCached, updateStorage } = useCache();
  const {
    directoryManager,
    getTerminalManager,
    keysManager,
    settingsManager,
    panelsManager,
  } = useManagers();
  const [layout, setLayout] = useState<Layout>(cloneDeep(panelsManager.layout));
  const [dirCount, setDirCount] = useState<number>(1);
  const [terminals, setTerminals] = useState<ITerminalManager[]>([getTerminalManager()]);

  const splitExplorer = () => {
    panelsManager.registerNewPanel('explorer');
    setLayout(cloneDeep(panelsManager.layout));
  };

  const splitTerminal = () => {
    console.log('split');
    // panelsManager.registerNewPanel('terminal');
    // setLayout(cloneDeep(panelsManager.layout));
    setTerminals((state) => [state[0], getTerminalManager()]);
  };

  const switchPane = noop;

  const handlers = {
    switchPane,
  };

  return (
    <div className="window">
      <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
        <SplitPanels splitType="vertical">
          <ExplorerPanels manager={directoryManager} panelCount={dirCount} />
          <Preview />
          <TerminalPanels managers={terminals} onSplit={splitTerminal} />
        </SplitPanels>
      </HotKeys>
    </div>
  );
};

export { Window };
