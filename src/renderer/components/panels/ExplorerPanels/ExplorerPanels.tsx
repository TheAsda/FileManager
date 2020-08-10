import React, { useState, useMemo } from 'react';
import { map, merge, noop } from 'lodash';
import { FileInfo } from '@fm/common';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useFocus, useCommands, useHotKeys, useManagers, useCache } from '@fm/hooks';
import {
  SplitPanels,
  ErrorBoundary,
  GoToPalette,
  HOHandlers,
  Explorer,
  InputModal,
} from '@fm/components';
import { useSettings } from 'renderer/hooks/useSettings';

interface ExplorerPalensProps extends HOHandlers {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();
  const { focus, focusIndex, focusPanel } = useFocus();
  const { addCommands, emptyCommands } = useCommands();
  const { addHotKeys, removeHotKeys } = useHotKeys();
  const { getIdentityManager, directoryManager } = useManagers();
  const { settings } = useSettings();
  const cacheManager = useCache();
  const [isGotoPaletteOpen, setGotoPalette] = useState<{
    isShown: boolean;
    panelIndex?: number;
  }>({
    isShown: false,
  });
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
    setGotoPalette({
      isShown: true,
      panelIndex: focus.index,
    });

    addHotKeys(gotoManager.getHotkeys(), true);
  };

  const closeGotoPalette = () => {
    setGotoPalette({
      isShown: false,
      panelIndex: undefined,
    });

    removeHotKeys();
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
    if (focus.panel === 'explorer' && focus.index !== index) {
      focusIndex(index);
    }

    addHotKeys(merge(data[index].getHotkeys(), props.hotkeys));

    emptyCommands();

    addCommands(merge(data[index].getCommands(), props.commands));
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
        directoryManager.copyItems(filesToCopy, path);
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
        directoryManager.moveItems(filesToCopy, path);
        resetInputModal();
      },
      onDecline: () => {
        resetInputModal();
      },
      inputValue: destinationPath,
      title: filesToCopy.length === 1 ? `Move ${filesToCopy[0].name}` : 'Move items',
    });
  };

  const onGotoSelect = (path: string) => {
    if (focus.index !== undefined) {
      data[focus.index].setPath(path);
    }
    closeGotoPalette();
  };

  return (
    <DefaultPanel
      onFocus={() => focusPanel('explorer')}
      onSplit={splitExplorer}
      splitable={data.length < 2}
    >
      {settings && (
        <SplitPanels minSize={200} splitType="horizontal">
          {map(data, (item, i) => {
            const isFocused = focus.panel === 'explorer' && focus.index === i;

            return (
              <ErrorBoundary key={item.getId()}>
                <Explorer
                  closable={data.length > 1}
                  commands={props.commands}
                  directoryManager={directoryManager}
                  explorerManager={item}
                  focused={isFocused}
                  hotkeys={merge(hotkeys, props.hotkeys)}
                  onClose={onClose(i)}
                  onCopy={onCopy(i)}
                  onDirectoryChange={(path) => cacheManager.addToCache(path)}
                  onFocus={focusItem(i)}
                  onMove={onMove(i)}
                  onPreview={props.onPreview}
                  openInTerminal={props.openInTerminal}
                  settings={settings}
                />
              </ErrorBoundary>
            );
          })}
        </SplitPanels>
      )}
      <InputModal
        initialValue={inputModalState.inputValue}
        isOpened={inputModalState.isShown}
        onAccept={inputModalState.onAccept}
        onClose={inputModalState.onDecline}
        subtitle={inputModalState.subtitle}
        title={inputModalState.title}
      />
      <GoToPalette
        isOpened={isGotoPaletteOpen.isShown}
        manager={gotoManager}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={[...cacheManager.cache]}
      />
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
