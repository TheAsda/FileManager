import React, { useState, useEffect } from 'react';
import { useManagers, usePreview, FocusProvider, useCommands, useHotKeys } from '@fm/hooks';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import './style.css';
import { CommandPalette } from '../modals';
import { PreviewPanel } from '../panels/PreviewPanel';

const Window = () => {
  const { dispatch: keysAction } = useHotKeys();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => {
    setCommandPalette(true);
  };

  const closeCommandPalette = () => {
    setCommandPalette(false);
  };

  const { directoryManager, keysManager } = useManagers();

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

  const hotkeys = {
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
              hotkeys={hotkeys}
              onPreview={previewHandler}
            />
            {preview.display && (
              <PreviewPanel hotkeys={hotkeys} onHide={togglePreview} path={preview.path} />
            )}
            <TerminalPanels hotkeys={hotkeys} />
          </SplitPanels>
        </FocusProvider>
      </div>
      <CommandPalette
        commands={commands}
        hotkeys={hotkeys}
        isOpened={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
    </>
  );
};

export { Window };
