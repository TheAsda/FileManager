import React, { useState, useEffect, useMemo } from 'react';
import { useManagers, usePreview, FocusProvider, useCommands, useHotKeys } from '@fm/hooks';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import './style.css';
import { CommandPalette, Commands } from '../modals';
import { PreviewPanel } from '../panels/PreviewPanel';
import { FileInfo } from '@fm/common';

const Window = () => {
  const { directoryManager, keysManager, getIdentityManager } = useManagers();
  const commandPaletteManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const { dispatch: keysAction } = useHotKeys();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => {
    setCommandPalette(true);

    keysAction({
      type: 'setHotKeys',
      hotkeys: commandPaletteManager.getHotkeys(),
      push: true,
    });
  };

  const closeCommandPalette = () => {
    setCommandPalette(false);

    keysAction({
      type: 'setHotKeys',
      pop: true,
    });
  };

  const { data: preview, dispatch: previewAction } = usePreview();

  const { data: commands } = useCommands();

  const previewHandler = (item: FileInfo) => {
    previewAction({
      type: 'setPath',
      item,
    });
  };

  const togglePreview = () => {
    previewAction({
      type: 'toggle',
    });
  };

  const switchPane = noop;

  const handlers = {
    switchPane,
    togglePreview,
    openCommandPalette,
  };

  const coms: Commands = {
    'Toggle preview': togglePreview,
  };

  useEffect(() => {
    keysAction({
      type: 'setKeyMap',
      keymap: keysManager.getKeyMap(),
    });
  }, []);

  return (
    <>
      <div className="window">
        <FocusProvider>
          <SplitPanels minSize={200} splitType="vertical">
            <ExplorerPanels
              commands={coms}
              directoryManager={directoryManager}
              hotkeys={handlers}
              onPreview={previewHandler}
            />
            {preview.display && (
              <PreviewPanel
                direcoryManager={directoryManager}
                hotkeys={handlers}
                onHide={togglePreview}
                item={preview.item}
              />
            )}
            <TerminalPanels hotkeys={handlers} />
          </SplitPanels>
        </FocusProvider>
      </div>
      <CommandPalette
        commands={commands}
        isOpened={isCommandPaletteOpen}
        manager={commandPaletteManager}
        onClose={closeCommandPalette}
      />
    </>
  );
};

export { Window };
