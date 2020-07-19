import React, { useState, useEffect, useMemo } from 'react';
import { useManagers, usePreview, FocusProvider, useCommands, useHotKeys } from '@fm/hooks';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import './style.css';
import { CommandPalette, Commands } from '../modals';
import { PreviewPanel } from '../panels/PreviewPanel';

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
    });
  };

  const closeCommandPalette = () => {
    setCommandPalette(false);
  };

  const { data: preview, dispatch: previewAction } = usePreview();

  const { data: commands } = useCommands();

  const previewHandler = (path: string) => {
    previewAction({
      type: 'display',
      path: path,
    });
  };

  const togglePreview = () => {
    if (preview.display) {
      previewAction({
        type: 'destroy',
      });
    } else {
      previewAction({
        type: 'display',
        path: null,
      });
    }
  };

  const switchPane = noop;

  const handlers = {
    switchPane,
    togglePreview,
    openCommandPalette,
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
              directoryManager={directoryManager}
              hotkeys={handlers}
              onPreview={previewHandler}
            />
            {preview.display && (
              <PreviewPanel hotkeys={handlers} onHide={togglePreview} path={preview.path} />
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
