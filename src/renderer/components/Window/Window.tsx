import React, { useState, useEffect } from 'react';
import {
  useManagers,
  useTerminals,
  useExplorers,
  usePreview,
  FocusProvider,
  useCommands,
  useHotKeys,
} from '@fm/hooks';
import { PanelType, Commands, KeyMap } from '@fm/common';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import { Preview } from '../Preview';
import './style.css';
import { CommandPalette } from '../modals';

const Window = () => {
  const { data: hotkeys, dispatch: keysAction } = useHotKeys();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  console.log('Rerender window');
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

  const { dispatch: terminalsAction } = useTerminals();
  const { dispatch: explorersAction } = useExplorers();
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

  const onClose = (type: PanelType) => (index?: number | null) => {
    if (!index) {
      return;
    }

    switch (type) {
      case 'explorer': {
        explorersAction({
          type: 'destroy',
          index: index,
        });
        return;
      }
      case 'preview': {
        previewAction({
          type: 'destroy',
        });
        return;
      }
      case 'terminal': {
        terminalsAction({
          type: 'destroy',
          index: index,
        });
        return;
      }
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
            {preview.display && (
              <Preview onClose={onClose('preview')} path={preview.path} toggle={togglePreview} />
            )}
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
    </>
  );
};

export { Window };
