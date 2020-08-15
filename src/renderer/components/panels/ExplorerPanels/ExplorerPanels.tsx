import React, { useState, useMemo } from 'react';
import { noop } from 'lodash';
import { FileInfo } from '@fm/common';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useManagers, usePaths } from '@fm/hooks';
import {
  SplitPanels,
  ErrorBoundary,
  GoToPalette,
  HOHandlers,
  Explorer,
  InputModal,
  HotKeysWrapper,
} from '@fm/components';
import { useStoreState, storeApi } from 'renderer/store';

interface ExplorerPanelsProps extends HOHandlers {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPanelsProps) => {
  // const { data, dispatch } = useExplorers();
  const { explorers } = useStoreState();
  console.log('ExplorerPanels -> explorers', explorers);
  const { getIdentityManager, directoryManager } = useManagers();
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
    storeApi.closeExplorer(index);
    // dispatch({
    //   type: 'destroy',
    //   index,
    // });
  };

  const splitExplorer = () => {
    storeApi.openExplorer({});
    // dispatch({
    //   type: 'spawn',
    // });
  };

  const onCopy = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    if (filesToCopy.length === 0) {
      return;
    }
    let destinationPath: string;
    // if (data.length > 1) {
    //   const otherPanelIndex = panelIndex ^ 1;
    //   destinationPath = data[otherPanelIndex].getPath();
    // } else {
    //   destinationPath = data[panelIndex].getPath();
    // }

    // setInputModalState({
    //   isShown: true,
    //   onAccept: (path: string) => {
    //     directoryManager.copyItems(filesToCopy, path);
    //     resetInputModal();
    //   },
    //   onDecline: () => {
    //     resetInputModal();
    //   },
    //   inputValue: destinationPath,
    //   title: filesToCopy.length === 1 ? `Copy ${filesToCopy[0].name}` : 'Copy items',
    // });
  };

  const onMove = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    let destinationPath: string;
    // if (data.length > 1) {
    //   const otherPanelIndex = panelIndex ^ 1;
    //   destinationPath = data[otherPanelIndex].getPath();
    // } else {
    //   destinationPath = data[panelIndex].getPath();
    // }

    // setInputModalState({
    //   isShown: true,
    //   onAccept: (path: string) => {
    //     directoryManager.moveItems(filesToCopy, path);
    //     resetInputModal();
    //   },
    //   onDecline: () => {
    //     resetInputModal();
    //   },
    //   inputValue: destinationPath,
    //   title: filesToCopy.length === 1 ? `Move ${filesToCopy[0].name}` : 'Move items',
    // });
  };

  const onGotoSelect = (path: string) => {
    // if (focus.index !== undefined) {
    //   data[focus.index].setPath(path);
    // }
    if (isGotoPaletteOpen.panelIndex) {
      storeApi.changeExplorerDirectory({
        index: isGotoPaletteOpen.panelIndex,
        path,
      });
    }
    closeGotoPalette();
  };

  const onResize = (value: number[]) => {
    if (explorers.panel0 && explorers.panel1) {
      storeApi.setExplorerSize({
        height: value[0],
        index: 0,
      });
      storeApi.setExplorerSize({
        height: value[1],
        index: 1,
      });
      return;
    }
    if (!explorers.panel0) {
      storeApi.setExplorerSize({
        height: value[0],
        index: 1,
      });
      return;
    }
    if (!explorers.panel1) {
      storeApi.setExplorerSize({
        height: value[0],
        index: 0,
      });
      return;
    }

    console.error('WTF Resizing');
  };

  return (
    <DefaultPanel
      // onFocus={() => focusPanel('explorer')}
      onSplit={splitExplorer}
      splitable={!explorers.panel0 || !explorers.panel1}
    >
      <HotKeysWrapper handlers={hotkeys}>
        <SplitPanels minSize={200} onResize={onResize} splitType="horizontal">
          {explorers.panel0 && (
            <ErrorBoundary>
              <Explorer
                closable={explorers.panel1 !== undefined}
                directoryManager={directoryManager}
                explorerManager={explorers.panel0.manager}
                onClose={onClose(0)}
                onCopy={onCopy(0)}
                onDirectoryChange={addPath}
                onMove={onMove(0)}
                onPreview={props.onPreview}
                openInTerminal={props.openInTerminal}
              />
            </ErrorBoundary>
          )}
          {explorers.panel1 && (
            <ErrorBoundary>
              <Explorer
                closable={explorers.panel0 !== undefined}
                directoryManager={directoryManager}
                explorerManager={explorers.panel1.manager}
                onClose={onClose(1)}
                onCopy={onCopy(1)}
                onDirectoryChange={addPath}
                onMove={onMove(1)}
                onPreview={props.onPreview}
                openInTerminal={props.openInTerminal}
              />
            </ErrorBoundary>
          )}
        </SplitPanels>
      </HotKeysWrapper>

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
