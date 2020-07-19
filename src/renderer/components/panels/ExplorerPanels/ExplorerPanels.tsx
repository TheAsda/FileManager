import React, { useState, useMemo } from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map, merge } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager } from '@fm/common';
import { ErrorBoundary, GoToPalette } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useFocus, useCommands, useHotKeys, useManagers } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';

interface ExplorerPalensProps extends HOHandlers {
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();
  const { dispatch: focusAction } = useFocus();
  const { dispatch: commandsAction } = useCommands();
  const { getIdentityManager } = useManagers();
  const { dispatch: keysAction } = useHotKeys();
  const [isGotoPaletteOpen, setGotoPalette] = useState<boolean>(false);
  const gotoManager = useMemo(() => {
    return getIdentityManager();
  }, undefined);

  const openGotoPalette = () => {
    setGotoPalette(true);
    keysAction({
      type: 'setHotKeys',
      hotkeys: gotoManager.getHotkeys(),
    });
  };

  const closeGotoPalette = () => {
    setGotoPalette(false);
  };

  const hotkeys = {
    openGoto: openGotoPalette,
  };

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

  const focusItem = (index: number) => () => {
    focusAction({
      type: 'focusItem',
      index,
    });

    keysAction({
      type: 'setHotKeys',
      hotkeys: merge(data[index].getHotkeys(), props.hotkeys),
    });

    commandsAction({
      type: 'empty',
    });

    commandsAction({
      type: 'add',
      items: merge(data[index].getCommands(), props.commands),
    });
  };

  // const removeCommands = (options: string[]) => {
  //   commandsAction({
  //     type: 'remove',
  //     items: options,
  //   });
  // };

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'explorer' })}
      onSplit={splitExplorer}
      splitable={data.length < 2}
    >
      <SplitPanels minSize={200} splitType="horizontal">
        {map(data, (item, i) => {
          return (
            <ErrorBoundary key={item.getId()}>
              <Explorer
                closable={data.length > 1}
                commands={props.commands}
                directoryManager={props.directoryManager}
                explorerManager={item}
                hotkeys={merge(hotkeys, props.hotkeys)}
                // onBlur={(options) => removeCommands(keys(options))}
                onClose={onClose(i)}
                onFocus={focusItem(i)}
                onPreview={props.onPreview}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
      <GoToPalette
        isOpened={isGotoPaletteOpen}
        manager={gotoManager}
        onClose={closeGotoPalette}
        onSelect={console.log}
        options={['D:\\', 'C:\\']}
      />
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
