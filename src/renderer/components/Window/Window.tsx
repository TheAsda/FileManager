import React, { useState, useEffect } from 'react';
import { useManagers, usePreview, FocusProvider, useCommands, useHotKeys } from '@fm/hooks';
import { Commands, KeyMap } from '@fm/common';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import './style.css';
import { CommandPalette } from '../modals';
import { PreviewPanel } from '../panels/PreviewPanel';
import { GoToPalette } from '../modals/GoToPalette';

const Window = () => {
  const { dispatch: keysAction } = useHotKeys();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const [isGotoPaletteOpen, setGotoPalette] = useState<boolean>(true);
  const openCommandPalette = () => {
    keysAction({
      type: 'activateArea',
      name: 'commandPalette',
    });
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
    keysAction({
      type: 'setWindowCommands',
      handlers,
    });
  }, []);

  const initPaletteHandlers = (keys: KeyMap, options: Commands) => {
    keysAction({
      type: 'setKeyMap',
      keymap: keys,
    });
    keysAction({
      type: 'setGlobalArea',
      handlers: options,
      name: 'commandPalette',
    });
  };

  return (
    <>
      <div className="window">
        <FocusProvider>
          <SplitPanels splitType="vertical">
            <ExplorerPanels directoryManager={directoryManager} onPreview={previewHandler} />
            {preview.display && <PreviewPanel onHide={togglePreview} path={preview.path} />}
            <TerminalPanels />
          </SplitPanels>
        </FocusProvider>
      </div>
      <CommandPalette
        commands={{ ...commands.default, ...commands.custom }}
        initHotKeys={initPaletteHandlers}
        isOpened={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
      <GoToPalette
        directoryManager={directoryManager}
        isOpened={isGotoPaletteOpen}
        onClose={() => setGotoPalette(false)}
        onSelect={console.log}
        path={'D:\\'}
      />
    </>
  );
};

export { Window };
