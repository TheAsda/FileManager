import React, { useState } from 'react';
import './style.css';
import { HotKeys } from 'react-hotkeys';
import { useManagers } from '@fm/hooks';
import { ITerminalManager, IExplorerManager, PreviewPanel, PanelType } from '@fm/common';
import { noop, filter } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import { Preview } from '../Preview';

const Window = () => {
  const {
    directoryManager,
    getTerminalManager,
    keysManager,
    panelsManager,
    getExplorerManager,
  } = useManagers();
  const [terminals, setTerminals] = useState<ITerminalManager[]>([getTerminalManager()]);
  const [explorers, setExplorers] = useState<IExplorerManager[]>([getExplorerManager()]);
  const [preview, setPreview] = useState<PreviewPanel | undefined>(
    panelsManager.getLayout().preview.panel
  );
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

  const onClose = (type: PanelType) => (id?: number) => {
    if (id && panelsManager.unregisterPanel(id)) {
      switch (type) {
        case 'explorer':
          setExplorers(filter(explorers, (item) => item.getId() === id));
          return;
        case 'preview':
          setPreview(undefined);
          return;
        case 'terminal':
          setTerminals(filter(terminals, (item) => item.getId() === id));
          return;
      }
    } else {
      throw new Error(`Cannot unregister ${id} panel`);
    }
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
            onClose={onClose('explorer')}
            onPreview={previewHandler}
            onSplit={splitExplorer}
          />
          {preview !== undefined && (
            <Preview onClose={onClose('preview')} path={previewFile} toggle={togglePreview} />
          )}
          <TerminalPanels
            managers={terminals}
            onClose={onClose('terminal')}
            onSplit={splitTerminal}
          />
        </SplitPanels>
      </HotKeys>
    </div>
  );
};

export { Window };
