import React, { useState } from 'react';
import './style.css';
import { HotKeys } from 'react-hotkeys';
import { useCache, useManagers } from '@fm/hooks';
import { Layout, IDirectoryManager, ITerminalManager, IExplorerManager } from '@fm/common';
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
    getExplorerManager,
  } = useManagers();
  const [layout, setLayout] = useState<Layout>(cloneDeep(panelsManager.layout));
  const [terminals, setTerminals] = useState<ITerminalManager[]>([getTerminalManager()]);
  const [explorers, setExplorers] = useState<IExplorerManager[]>([getExplorerManager()]);
  const [previewFile, setPreviewFile] = useState<string>();

  const previewHandler = (path: string) => setPreviewFile(path);

  const splitExplorer = () => {
    // panelsManager.registerNewPanel('explorer');
    // setLayout(cloneDeep(panelsManager.layout));
    setExplorers((state) => [state[0], getExplorerManager()]);
  };

  const splitTerminal = () => {
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
          <ExplorerPanels
            directoryManager={directoryManager}
            managers={explorers}
            onPreview={previewHandler}
            onSplit={splitExplorer}
          />
          <Preview path={previewFile} />
          <TerminalPanels managers={terminals} onSplit={splitTerminal} />
        </SplitPanels>
      </HotKeys>
    </div>
  );
};

export { Window };
