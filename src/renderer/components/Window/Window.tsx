import React, { useState } from 'react';
import { useCommands, useTheme, CommandsWrapper, useKeyMap } from '@fm/hooks';
import { noop, map, toPairs, reduce, merge } from 'lodash';
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
import { remote } from 'electron';
import { useStoreState, storeApi, setSectionsSize } from 'renderer/store';
import { ThemeSelector } from '../modals/ThemeSelector';

const Window = () => {
  const state = useStoreState();
  console.log('Window -> state', state);
  const { commands } = useCommands();
  const { keymap } = useKeyMap();

  const { resetTheme, theme } = useTheme();
  const [isThemeSelectorOpened, setThemeSelectorState] = useState<boolean>(false);

  const openThemeSelector = () => {
    console.log('openThemeSelector -> openThemeSelector');
    setThemeSelectorState(true);
  };
  const closeThemeSelector = () => {
    console.log('closeThemeSelector -> setThemeSelectorState');
    setThemeSelectorState(false);
  };

  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => {
    setCommandPalette(true);
  };

  const closeCommandPalette = () => {
    setCommandPalette(false);
  };

  // const { terminals } = useTerminals();
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
        storeApi.changeTerminalDirectory({
          index,
          path,
        });
        // terminals[index].changeDirectory(path);
        closeSelect();
      },
    });
  };

  const previewHandler = (item: FileInfo) => {
    storeApi.setPreviewItem(item);
  };
  const togglePreview = () => {
    storeApi.togglePreview();
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

  const onResize = (value: number[]) => {
    console.log('onResize -> value', value);
    if (!state.explorers.hidden && !state.preview.hidden && !state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: value[0],
        },
        preview: {
          width: value[1],
        },
        terminal: {
          width: value[2],
        },
      });
      return;
    }
    if (state.explorers.hidden && !state.preview.hidden && !state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: 0,
        },
        preview: {
          width: value[0],
        },
        terminal: {
          width: value[1],
        },
      });
      return;
    }
    if (!state.explorers.hidden && state.preview.hidden && !state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: value[0],
        },
        preview: {
          width: 0,
        },
        terminal: {
          width: value[1],
        },
      });
      return;
    }
    if (!state.explorers.hidden && !state.preview.hidden && state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: value[0],
        },
        preview: {
          width: value[1],
        },
        terminal: {
          width: 0,
        },
      });
      return;
    }
    if (!state.explorers.hidden && state.preview.hidden && state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: value[0],
        },
        preview: {
          width: 0,
        },
        terminal: {
          width: 0,
        },
      });
      return;
    }
    if (state.explorers.hidden && !state.preview.hidden && state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: 0,
        },
        preview: {
          width: value[0],
        },
        terminal: {
          width: 0,
        },
      });
      return;
    }
    if (state.explorers.hidden && state.preview.hidden && !state.terminals.hidden) {
      setSectionsSize({
        explorer: {
          width: 0,
        },
        preview: {
          width: 0,
        },
        terminal: {
          width: value[0],
        },
      });
      return;
    }

    console.error('WTF Resizing');
  };
  console.log('Window -> themeSelectorState', isThemeSelectorOpened);

  return (
    <HotKeysWrapper keyMap={keymap}>
      <CSSApplicator theme={theme}>
        <HotKeysWrapper handlers={hotkeys}>
          <div className="window">
            <CommandsWrapper commands={localCommands} scope="window">
              <SplitPanels minSize={200} onResize={onResize} splitType="vertical">
                {!state.explorers.hidden && (
                  <ExplorerPanels onPreview={previewHandler} openInTerminal={openInTerminal} />
                )}
                {!state.preview.hidden &&
                  (({ width }) => {
                    return <PreviewPanel onHide={togglePreview} width={width} />;
                  })}
                {!state.terminals.hidden && (
                  <TerminalPanels
                    onSelect={terminalSelect.onSelect}
                    onSelectClose={closeSelect}
                    selectModeActivated={terminalSelect.isShown}
                  />
                )}
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
            onClose={closeCommandPalette}
          />
          <ThemeSelector isOpened={isThemeSelectorOpened} onClose={closeThemeSelector} />
          <Popup />
        </HotKeysWrapper>
      </CSSApplicator>
    </HotKeysWrapper>
  );
};

export { Window };
