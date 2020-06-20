import React, { useState } from 'react';
import './style.css';
import { HotKeys } from 'react-hotkeys';
import { useCache, useManagers } from '@fm/hooks';
import {
  Layout,
  IDirectoryManager,
  ITerminalManager,
  IExplorerManager,
  PreviewPanel,
} from '@fm/common';
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
  const [terminals, setTerminals] = useState<ITerminalManager[]>([getTerminalManager()]);
  const [explorers, setExplorers] = useState<IExplorerManager[]>([getExplorerManager()]);
  const [preview, setPreview] = useState<PreviewPanel>();
  const [previewFile, setPreviewFile] = useState<string>();

  const previewHandler = (path: string) => setPreviewFile(path);

  const splitExplorer = () => {
    if (!panelsManager.checkPanel('explorer')) {
      // TODO: show error
      return;
    }

    const id = panelsManager.registerNewPanel('explorer');
    const manager = getExplorerManager();
    manager.setId(id);

    setExplorers((state) => [...state, manager]);
  };

  const splitTerminal = () => {
    if (!panelsManager.checkPanel('terminal')) {
      // TODO: show error
      return;
    }

    const id = panelsManager.registerNewPanel('terminal');
    const manager = getTerminalManager();
    manager.setId(id);

    setTerminals((state) => [...state, manager]);
  };

  const togglePreview = () => {
    if (preview) {
      panelsManager.unregisterPanel(preview.id);
      setPreview(undefined);
      return;
    }

    if (!panelsManager.checkPanel('preview')) {
      // TODO: show error
      return;
    }

    const id = panelsManager.registerNewPanel('preview');
    const panel: PreviewPanel = {
      id: id,
      type: 'preview',
    };

    setPreview(panel);
  };

  const switchPane = noop;

  const handlers = {
    switchPane,
    togglePreview,
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
          {preview !== undefined && <Preview path={previewFile} toggle={togglePreview} />}
          <TerminalPanels managers={terminals} onSplit={splitTerminal} />
        </SplitPanels>
      </HotKeys>
    </div>
  );
};

export { Window };
