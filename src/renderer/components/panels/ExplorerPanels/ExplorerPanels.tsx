import React, { useState, useMemo } from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map, merge, noop } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager, FileInfo } from '@fm/common';
import { ErrorBoundary, GoToPalette } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useFocus, useCommands, useHotKeys, useManagers } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import { InputModal } from 'renderer/components/modals/InputModal';

interface ExplorerPalensProps extends HOHandlers {
  directoryManager: IDirectoryManager;
  onPreview?: (item: FileInfo) => void;
  onTerminalOpen?: (path: string) => void;
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
  }, []);

  const [inputModalState, setInputModalState] = useState<{
    isShown: boolean;
    title?: string;
    subtitle?: string;
    inputValue?: string;
    onAccept: (value: string) => void;
    onDecline: () => void;
  }>({
    isShown: false,
    onAccept: noop,
    onDecline: noop,
  });

  const resetInputModal = () => {
    setInputModalState({
      isShown: false,
      onAccept: noop,
      onDecline: noop,
    });
  };

  const openGotoPalette = () => {
    setGotoPalette(true);
    keysAction({
      type: 'setHotKeys',
      hotkeys: gotoManager.getHotkeys(),
      push: true,
    });
  };

  const closeGotoPalette = () => {
    setGotoPalette(false);

    keysAction({
      type: 'setHotKeys',
      pop: true,
    });
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

  const onCopy = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    if (filesToCopy.length === 0) {
      return;
    }
    let destinationPath: string;
    if (data.length > 1) {
      const otherPanelIndex = panelIndex ^ 1;
      destinationPath = data[otherPanelIndex].getPath();
    } else {
      destinationPath = data[panelIndex].getPath();
    }

    setInputModalState({
      isShown: true,
      onAccept: (path: string) => {
        props.directoryManager.copyItems(filesToCopy, path);
        resetInputModal();
      },
      onDecline: () => {
        resetInputModal();
      },
      inputValue: destinationPath,
      title: filesToCopy.length === 1 ? `Copy ${filesToCopy[0].name}` : 'Copy items',
    });
  };

  const onMove = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    let destinationPath: string;
    if (data.length > 1) {
      const otherPanelIndex = panelIndex ^ 1;
      destinationPath = data[otherPanelIndex].getPath();
    } else {
      destinationPath = data[panelIndex].getPath();
    }

    setInputModalState({
      isShown: true,
      onAccept: (path: string) => {
        props.directoryManager.moveItems(filesToCopy, path);
        resetInputModal();
      },
      onDecline: () => {
        resetInputModal();
      },
      inputValue: destinationPath,
      title: filesToCopy.length === 1 ? `Move ${filesToCopy[0].name}` : 'Move items',
    });
  };

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
                onClose={onClose(i)}
                onCopy={onCopy(i)}
                onFocus={focusItem(i)}
                onMove={onMove(i)}
                onPreview={props.onPreview}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
      <InputModal
        initialValue={inputModalState.inputValue}
        isOpened={inputModalState.isShown}
        onAccept={inputModalState.onAccept}
        onClose={inputModalState.onDecline}
        subtitle={inputModalState.subtitle}
        title={inputModalState.title}
      />
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
