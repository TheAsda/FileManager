import React, { useState, useEffect, useMemo } from 'react';
import {
  useManagers,
  usePreview,
  FocusProvider,
  useCommands,
  useHotKeys,
  useTerminals,
  useTheme,
} from '@fm/hooks';
import { noop, map, reject } from 'lodash';
import './style.css';
import { FileInfo, Commands } from '@fm/common';
import {
  SplitPanels,
  ExplorerPanels,
  TerminalPanels,
  CommandPalette,
  Popup,
  PreviewPanel,
  CSSApplicator,
} from '@fm/components';
import { remote, app } from 'electron';
import { GoToPalette } from '../modals';

const Window = () => {
  const { keysManager, getIdentityManager, settingsManager, directoryManager } = useManagers();
  const { dispatch: keysAction } = useHotKeys();
  const { data: commands } = useCommands();

  const themeSelectorManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const { resetTheme, theme, setTheme } = useTheme();
  const [themeSelectorState, setThemeSelectorState] = useState<{
    isShown: boolean;
    options: string[];
  }>({
    isShown: false,
    options: [],
  });
  const openThemeSelector = async () => {
    const options = map(
      reject(
        await directoryManager.listDirectory((app || remote.app).getPath('userData') + '/themes'),
        ['name', '..']
      ),
      (item) => item.name.substr(0, item.name.lastIndexOf('.'))
    );

    setThemeSelectorState({
      isShown: true,
      options,
    });

    keysAction({
      type: 'setHotKeys',
      hotkeys: themeSelectorManager.getHotkeys(),
      push: true,
    });
  };
  const closeThemeSelector = () => {
    setThemeSelectorState({
      isShown: false,
      options: [],
    });

    keysAction({
      type: 'setHotKeys',
      pop: true,
    });
  };
  const onThemeSelect = (themeName: string) => {
    setTheme(themeName), closeThemeSelector();
  };

  const commandPaletteManager = useMemo(() => {
    return getIdentityManager();
  }, []);
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

  const { data: terminals } = useTerminals();
  const [terminalSelect, setTerminalSelect] = useState<{
    isShown: boolean;
    onSelect: (index: number) => void;
  }>({
    isShown: false,
    onSelect: noop,
  });
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

  const { hidden, item, toggleHidden, setItem } = usePreview();
  const previewHandler = (item: FileInfo) => {
    setItem(item);
  };
  const togglePreview = () => {
    toggleHidden();
  };

  const hotkeys = {
    togglePreview,
    openCommandPalette,
  };

  const localCommands: Commands = {
    'Toggle preview': togglePreview,
    'Reload window': () => {
      remote.getCurrentWindow().reload();
    },
    'Reset theme': resetTheme,
    'Select theme': openThemeSelector,
  };

  useEffect(() => {
    keysAction({
      type: 'setKeyMap',
      keymap: keysManager.getKeyMap(),
    });
  }, []);

  return (
    <CSSApplicator theme={theme}>
      <div className="window">
        <FocusProvider settingsManager={settingsManager}>
          <SplitPanels minSize={200} splitType="vertical">
            <ExplorerPanels
              commands={localCommands}
              hotkeys={hotkeys}
              onPreview={previewHandler}
              openInTerminal={openInTerminal}
            />
            {!hidden &&
              (({ width }) => {
                return (
                  <PreviewPanel
                    hotkeys={hotkeys}
                    item={item}
                    onHide={togglePreview}
                    width={width}
                  />
                );
              })}
            <TerminalPanels
              commands={localCommands}
              hotkeys={hotkeys}
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
      <GoToPalette
        isOpened={themeSelectorState?.isShown}
        manager={themeSelectorManager}
        onClose={closeThemeSelector}
        onSelect={onThemeSelect}
        options={themeSelectorState.options}
      />
      <Popup />
    </CSSApplicator>
  );
};

export { Window };
