import React, { useState, useMemo } from 'react';
import {
  useManagers,
  usePreview,
  useCommands,
  useTerminals,
  useTheme,
  CommandsWrapper,
  useKeyMap,
} from '@fm/hooks';
import { noop, map, reject, toPairs, reduce, merge } from 'lodash';
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
  HotKeysWrapper,
} from '@fm/components';
import { remote, app } from 'electron';
import { GoToPalette } from '../modals';

const Window = () => {
  const { getIdentityManager, directoryManager } = useManagers();
  const { commands } = useCommands();
  const { keymap } = useKeyMap();
  console.log('Window -> keymap', keymap);

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
  };
  const closeThemeSelector = () => {
    setThemeSelectorState({
      isShown: false,
      options: [],
    });
  };
  const onThemeSelect = (themeName: string) => {
    setTheme(themeName);
    closeThemeSelector();
  };

  const commandPaletteManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => {
    setCommandPalette(true);
  };
  const closeCommandPalette = () => {
    setCommandPalette(false);

    closeThemeSelector();
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

  return (
    <HotKeysWrapper keyMap={keymap}>
      <CSSApplicator theme={theme}>
        <HotKeysWrapper handlers={hotkeys}>
          <div className="window">
            <CommandsWrapper commands={localCommands} scope="window">
              <SplitPanels minSize={200} splitType="vertical">
                <ExplorerPanels onPreview={previewHandler} openInTerminal={openInTerminal} />
                {!hidden &&
                  (({ width }) => {
                    return <PreviewPanel item={item} onHide={togglePreview} width={width} />;
                  })}
                <TerminalPanels
                  onSelect={terminalSelect.onSelect}
                  onSelectClose={closeSelect}
                  selectModeActivated={terminalSelect.isShown}
                />
              </SplitPanels>
            </CommandsWrapper>
          </div>
          <CommandPalette
            commands={reduce(
              map(toPairs(commands), ([scope, commands]) => {
                return reduce<[string, () => void], Commands>(
                  toPairs(commands),
                  (acc, [name, command]) => {
                    acc[scope + ': ' + name] = command;

                    return acc;
                  },
                  {}
                );
              }),
              (acc, cur) => {
                return merge(acc, cur);
              },
              {}
            )}
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
        </HotKeysWrapper>
      </CSSApplicator>
    </HotKeysWrapper>
  );
};

export { Window };
