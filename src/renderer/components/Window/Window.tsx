import React, { useState, useEffect, useMemo } from 'react';
import {
  useManagers,
  usePreview,
  FocusProvider,
  useCommands,
  useHotKeys,
  useTerminals,
} from '@fm/hooks';
import { noop } from 'lodash';
import './style.css';
import { FileInfo, Commands } from '@fm/common';
import {
  SplitPanels,
  ExplorerPanels,
  TerminalPanels,
  CommandPalette,
  Popup,
  PreviewPanel,
} from '@fm/components';
import { remote } from 'electron';

const Window = () => {
  const { keysManager, getIdentityManager } = useManagers();
  const commandPaletteManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const { data: terminals } = useTerminals();
  const { dispatch: keysAction } = useHotKeys();
  const [terminalSelect, setTerminalSelect] = useState<{
    isShown: boolean;
    onSelect: (index: number) => void;
  }>({
    isShown: false,
    onSelect: noop,
  });
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

  const closeSelect = () => {
    setTerminalSelect({
      isShown: false,
      onSelect: noop,
    });
  };

  const openInTerminal = (path: string) => {
    setTerminalSelect({
      isShown: true,
      onSelect: (index: number) => {
        terminals[index].changeDirectory(path);
        closeSelect();
      },
    });
  };

  const handlers = {
    togglePreview,
    openCommandPalette,
  };

  const coms: Commands = {
    'Toggle preview': togglePreview,
    'Reload window': () => {
      remote.getCurrentWindow().reload();
    },
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
              hotkeys={handlers}
              onPreview={previewHandler}
              openInTerminal={openInTerminal}
            />
            {preview.display &&
              (({ width }) => {
                return (
                  <PreviewPanel
                    hotkeys={handlers}
                    item={preview.item}
                    onHide={togglePreview}
                    width={width}
                  />
                );
              })}
            <TerminalPanels
              commands={coms}
              hotkeys={handlers}
              onSelect={terminalSelect.onSelect}
              onSelectClose={closeSelect}
              selectModeActivated={terminalSelect.isShown}
            />
          </SplitPanels>
        </FocusProvider>
      </div>
      <CommandPalette
        commands={commands}
        isOpened={isCommandPaletteOpen}
        manager={commandPaletteManager}
        onClose={closeCommandPalette}
      />
      <Popup />
    </>
  );
};

export { Window };
