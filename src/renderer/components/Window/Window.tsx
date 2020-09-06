import React, { useMemo, useState } from 'react';
import { map, toPairs, reduce, merge } from 'lodash';
import './style.css';
import { FileInfo, Commands } from '@fm/common';
import {
  SplitPanels,
  ExplorerPanels,
  TerminalPanels,
  CommandPalette,
  Popup,
  PreviewPanel,
  HotKeysWrapper,
} from '@fm/components';
import { remote } from 'electron';
import {
  setPreviewFile,
  terminalsStateStore,
  explorersStateStore,
  previewStore,
  resizeExplorers,
  resizeTerminals,
  resizePreview,
  commandsStore,
  CommandsWrapper,
  keymapStore,
} from '@fm/store';
import { FileModal } from '../modals';
import { useStore } from 'effector-react';

const Window = () => {
  const terminalsState = useStore(terminalsStateStore);
  const explorersState = useStore(explorersStateStore);
  const previewState = useStore(previewStore);

  const commands = useStore(commandsStore);
  const keymap = useStore(keymapStore);

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

  const previewHandler = (item: FileInfo) => {
    setPreviewFile(item);
  };
  const togglePreview = () => {
    togglePreview();
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
    // 'Reset theme': resetTheme,
    'Select theme': openThemeSelector,
  };

  const onResize = (value: number[]) => {
    // console.log('onResize -> value', value);
    const hiddenState = [explorersState.hidden, previewState.hidden, previewState.hidden];

    const valueCopy = [...value];

    const isEmpty = () => {
      return valueCopy.length === 0;
    };

    if (!hiddenState[0]) {
      resizeExplorers(valueCopy.shift() as number);
    }
    if (isEmpty()) {
      return;
    }
    if (!hiddenState[1]) {
      resizePreview(valueCopy.shift() as number);
    }
    if (isEmpty()) {
      return;
    }
    resizeTerminals(valueCopy[0]);
  };

  const sizes: number[] = useMemo(
    () => [terminalsState.width, previewState.width, previewState.width],
    []
  );

  return (
    <HotKeysWrapper keyMap={keymap}>
      <HotKeysWrapper handlers={hotkeys}>
        <div className="window">
          <CommandsWrapper commands={localCommands} scope="window">
            <SplitPanels
              initialSizes={sizes}
              minSize={200}
              onResize={onResize}
              splitType="vertical"
            >
              {!explorersState.hidden && <ExplorerPanels onPreview={previewHandler} />}
              {!previewState.hidden &&
                (({ width }) => {
                  return <PreviewPanel onHide={togglePreview} width={width} />;
                })}
              {!terminalsState.hidden && <TerminalPanels />}
            </SplitPanels>
          </CommandsWrapper>
        </div>
        <FileModal />
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
        {/* <ThemeSelector isOpened={isThemeSelectorOpened} onClose={closeThemeSelector} /> */}
        <Popup />
      </HotKeysWrapper>
    </HotKeysWrapper>
  );
};

export { Window };
