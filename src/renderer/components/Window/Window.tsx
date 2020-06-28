import React, { useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import {
  useManagers,
  useTerminals,
  useExplorers,
  usePreview,
  FocusProvider,
  useCommands,
} from '@fm/hooks';
import { PanelType } from '@fm/common';
import { noop } from 'lodash';
import { SplitPanels } from '../SplitPanels';
import { ExplorerPanels, TerminalPanels } from '../panels';
import { Preview } from '../Preview';
import './style.css';
import { CommandPalette } from '../modals';

const Window = () => {
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

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

  return (
    <>
      <div className="window">
        <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
          <FocusProvider>
            <SplitPanels splitType="vertical">
              <ExplorerPanels directoryManager={directoryManager} onPreview={previewHandler} />
              {preview.display && (
                <Preview onClose={onClose('preview')} path={preview.path} toggle={togglePreview} />
              )}
              <TerminalPanels />
            </SplitPanels>
          </FocusProvider>
        </HotKeys>
      </div>
      <CommandPalette
        commands={{ ...commands.default, ...commands.custom }}
        isOpened={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
    </>
  );
};

export { Window };
