import React, { useEffect } from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager } from '@fm/common';
import { ErrorBoundary, Commands } from 'renderer/components';
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

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      index,
    });
  };

  const splitExplorer = () => {
    dispatch({
      type: 'spawn',
    });
  };

  const focusItem = (index: number, name: string) => (options: Commands) => {
    console.log(index, name);
    console.log(focus.index, hotkeys.activeArea);

    if (focus.index !== index && hotkeys.activeArea !== name) {
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

  const setArea = (name: string, activate?: boolean) => (handlers: Commands) => {
    keysAction({
      type: 'setArea',
      name,
      handlers,
      activate,
    });
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
      <SplitPanels splitType="horizontal">
        {map(data, (item, i) => {
          const name = `explorer${i}`;
          const focused = focus.focusedPanel === 'explorer' && focus.index === i;

          return (
            <ErrorBoundary key={item.getId()}>
              <Explorer
                closable={data.length > 1}
                directoryManager={props.directoryManager}
                explorerManager={item}
                onClose={onClose(i)}
                onFocus={focusItem(i, name)}
                onPreview={props.onPreview}
                registerHotKeys={setArea(name, focused)}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
