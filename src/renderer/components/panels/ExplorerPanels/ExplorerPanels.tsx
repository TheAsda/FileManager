import React, { useEffect, useState } from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map, keys, merge } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager, KeyMap } from '@fm/common';
import { ErrorBoundary, Commands, GoToPalette } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useFocus, useCommands, useHotKeys } from '@fm/hooks';

interface ExplorerPalensProps {
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();
  const { data: focus, dispatch: focusAction } = useFocus();
  const { dispatch: commandsAction } = useCommands();
  const { data: hotkeys, dispatch: keysAction } = useHotKeys();
  const [isGotoPaletteOpen, setGotoPalette] = useState<boolean>(false);

  const openGotoPalette = () => {
    keysAction({
      type: 'activateArea',
      name: 'gotoPalette',
    });
    setGotoPalette(true);
  };

  const closeGotoPalette = () => {
    setGotoPalette(false);
  };

  const handlers = {
    openGoto: openGotoPalette,
  };

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      index,
    });
  };

  const initHotHeys = (keymap: KeyMap, commands: Commands) => {
    keysAction({
      type: 'setKeyMap',
      keymap,
    });

    keysAction({
      type: 'setArea',
      handlers: commands,
      name: 'gotoPalette',
    });
  };

  const splitExplorer = () => {
    dispatch({
      type: 'spawn',
    });
  };

  const focusItem = (index: number, name: string) => (options: Commands) => {
    const indexChanged = focus.index !== index;
    const panelChanged = hotkeys.activeArea && hotkeys.activeArea[0] !== name[0];

    if (indexChanged || panelChanged) {
      focusAction({
        type: 'focusItem',
        index,
      });

      keysAction({
        type: 'activateArea',
        name,
      });

      commandsAction({
        type: 'add',
        items: options,
      });
    }
  };

  const removeCommands = (options: string[]) => {
    commandsAction({
      type: 'remove',
      items: options,
    });
  };

  const setArea = (name: string, activate?: boolean) => (commands: Commands, options: Commands) => {
    keysAction({
      type: 'setArea',
      name,
      handlers: merge(commands, handlers),
      activate,
    });

    if (activate) {
      commandsAction({
        type: 'add',
        items: options,
      });
    }
  };

  useEffect(() => {
    const name = `explorer${focus.index}`;
    if (focus.focusedPanel === 'explorer' && hotkeys.activeArea !== name) {
      keysAction({
        type: 'activateArea',
        name,
      });
    }
  }, [focus]);

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'explorer' })}
      onSplit={splitExplorer}
      splitable={data.length < 2}
    >
      <SplitPanels minSize={200} splitType="horizontal">
        {map(data, (item, i) => {
          const name = `explorer${i}`;
          const focused = focus.focusedPanel === 'explorer' && focus.index === i;

          return (
            <ErrorBoundary key={item.getId()}>
              <Explorer
                closable={data.length > 1}
                directoryManager={props.directoryManager}
                explorerManager={item}
                onBlur={(options) => removeCommands(keys(options))}
                onClose={onClose(i)}
                onFocus={focusItem(i, name)}
                onPreview={props.onPreview}
                registerHotKeys={setArea(name, focused)}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
      <GoToPalette
        initHotKeys={initHotHeys}
        isOpened={isGotoPaletteOpen}
        onClose={closeGotoPalette}
        onSelect={console.log}
        options={['D:\\', 'C:\\']}
      />
      z
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
