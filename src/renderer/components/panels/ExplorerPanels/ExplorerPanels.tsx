import React, { useState, useMemo } from 'react';
import { map, noop } from 'lodash';
import { FileInfo } from '@fm/common';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useManagers, usePaths, useSettings } from '@fm/hooks';
import {
  SplitPanels,
  ErrorBoundary,
  GoToPalette,
  HOHandlers,
  Explorer,
  InputModal,
  HotKeysWrapper,
} from '@fm/components';

interface ExplorerPanelsProps extends HOHandlers {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPanelsProps) => {
  const { data, dispatch } = useExplorers();
  const { getIdentityManager, directoryManager } = useManagers();
  const { settings, setValue } = useSettings();
  const { paths, addPath } = usePaths();
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
      // panelIndex: focus.index,
    });
  };

  const closeGotoPalette = () => {
    setGotoPalette({
      isShown: false,
      panelIndex: undefined,
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

  const onGotoSelect = () => {
    // if (focus.index !== undefined) {
    //   data[focus.index].setPath(path);
    // }
    closeGotoPalette();
  };

  return (
    <DefaultPanel
      // onFocus={() => focusPanel('explorer')}
      onSplit={splitExplorer}
      splitable={data.length < 2}
    >
      {settings && (
        <HotKeysWrapper handlers={hotkeys}>
          <SplitPanels minSize={200} splitType="horizontal">
            {map(data, (item, i) => {
              return (
                <ErrorBoundary key={item.getId()}>
                  <Explorer
                    closable={data.length > 1}
                    directoryManager={directoryManager}
                    explorerManager={item}
                    onClose={onClose(i)}
                    onCopy={onCopy(i)}
                    onDirectoryChange={addPath}
                    onMove={onMove(i)}
                    onPreview={props.onPreview}
                    openInTerminal={props.openInTerminal}
                    setSettings={setValue}
                    settings={settings}
                  />
                </ErrorBoundary>
              );
            })}
          </SplitPanels>
        </HotKeysWrapper>
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
        options={paths}
      />
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPanelsProps };
