import React, { useState } from 'react';
import { FileInfo } from '@fm/common';
import { DefaultPanel } from '../DefaultPanel';
import { useDirectoryManager, usePaths, CommandsWrapper, useTheme } from '@fm/hooks';
import { SplitPanels, ErrorBoundary, GoToPalette, Explorer, HotKeysWrapper } from '@fm/components';
import { store, storeApi, fileActionApi } from '@fm/store';
import { useStore } from 'effector-react';

interface ExplorerPanelsProps {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPanelsProps) => {
  const { explorers, settings } = useStore(store);
  const { directoryManager } = useDirectoryManager();
  const { paths, addPath } = usePaths();
  const { theme } = useTheme();
  const [isGotoPaletteOpen, setGotoPalette] = useState<{
    isShown: boolean;
    panelIndex?: number;
  }>({
    isShown: false,
  });

  const openGotoPalette = () => {
    setGotoPalette({
      isShown: true,
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
  };

  const splitExplorer = () => {
    storeApi.openExplorer({});
  };

  const onCopy = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    if (filesToCopy.length === 0) {
      return;
    }
    let destinationPath: string;
    if (panelIndex === 0 && explorers.panel0) {
      if (explorers.panel1) {
        destinationPath = explorers.panel1.state.path;
      } else {
        destinationPath = explorers.panel0.state.path;
      }
    } else {
      if (explorers.panel0) {
        destinationPath = explorers.panel0.state.path;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        destinationPath = explorers.panel1!.state.path;
      }
    }

    fileActionApi.activate({
      destinationPath,
      files: filesToCopy,
      type: 'copy',
    });
  };

  const onMove = (panelIndex: number) => (filesToMove: FileInfo[]) => {
    if (filesToMove.length === 0) {
      return;
    }
    let destinationPath: string;
    if (panelIndex === 0 && explorers.panel0) {
      if (explorers.panel1) {
        destinationPath = explorers.panel1.state.path;
      } else {
        destinationPath = explorers.panel0.state.path;
      }
    } else {
      if (explorers.panel0) {
        destinationPath = explorers.panel0.state.path;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        destinationPath = explorers.panel1!.state.path;
      }
    }

    fileActionApi.activate({
      destinationPath,
      files: filesToMove,
      type: 'move',
    });
  };

  const onGotoSelect = (path: string) => {
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

  const onDirectoryChange = (index: 0 | 1) => (path: string) => {
    addPath(path);
    storeApi.changeExplorerDirectory({
      path,
      index,
    });
  };

  const commands = {
    'Toggle auto preview': () => storeApi.toggleAutoPreview(),
    'Toggle show hidden': () => storeApi.toggleShowHidden(),
  };

  return (
    <DefaultPanel
      onHide={() => storeApi.toggleExplorers()}
      onSplit={splitExplorer}
      splitable={!explorers.panel0 || !explorers.panel1}
    >
      <CommandsWrapper commands={commands} scope="explorers">
        <HotKeysWrapper handlers={hotkeys}>
          <SplitPanels minSize={200} onResize={onResize} splitType="horizontal">
            {explorers.panel0 && (
              <ErrorBoundary>
                <Explorer
                  autoPreview={settings.autoPreview}
                  closable={explorers.panel1 !== undefined}
                  directoryManager={directoryManager}
                  explorerState={explorers.panel0.state}
                  index={1}
                  onClose={onClose(0)}
                  onCopy={onCopy(0)}
                  onDirectoryChange={onDirectoryChange(0)}
                  onMove={onMove(0)}
                  onPreview={props.onPreview}
                  openInTerminal={props.openInTerminal}
                  showHidden={settings.showHidden}
                  theme={theme}
                />
              </ErrorBoundary>
            )}
            {explorers.panel1 && (
              <ErrorBoundary>
                <Explorer
                  autoPreview={settings.autoPreview}
                  closable={explorers.panel0 !== undefined}
                  directoryManager={directoryManager}
                  explorerState={explorers.panel1.state}
                  index={2}
                  onClose={onClose(1)}
                  onCopy={onCopy(1)}
                  onDirectoryChange={onDirectoryChange(1)}
                  onMove={onMove(1)}
                  onPreview={props.onPreview}
                  openInTerminal={props.openInTerminal}
                  showHidden={settings.showHidden}
                  theme={theme}
                />
              </ErrorBoundary>
            )}
          </SplitPanels>
        </HotKeysWrapper>
      </CommandsWrapper>
      <GoToPalette
        isOpened={isGotoPaletteOpen.isShown}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={paths}
      />
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPanelsProps };
