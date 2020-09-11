import React, { useMemo, useState } from 'react';
import { FileInfo } from '@fm/common';
import { DefaultPanel } from '../DefaultPanel';
import { useDirectoryManager } from '@fm/hooks';
import { SplitPanels, ErrorBoundary, GoToPalette, Explorer } from '@fm/components';
import {
  fileActionApi,
  settingsStore,
  explorersStore,
  spawnExplorer,
  explorersEventsStore,
  destroyExplorer,
  settingsApi,
  toggleExplorers,
  CommandsWrapper,
  pathsStore,
  addPath,
  KeymapWrapper,
} from '@fm/store';
import { useStore } from 'effector-react';
import { map } from 'lodash';

interface ExplorerPanelsProps {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPanelsProps) => {
  const settings = useStore(settingsStore);
  const explorers = useStore(explorersStore);
  const events = useStore(explorersEventsStore);
  const { directoryManager } = useDirectoryManager();
  const { list: paths } = useStore(pathsStore);
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
    destroyExplorer(index);
  };

  const splitExplorer = () => {
    spawnExplorer({});
  };

  const onCopy = (panelIndex: number) => (filesToCopy: FileInfo[]) => {
    if (filesToCopy.length === 0) {
      return;
    }

    let destinationPath: string;

    if (explorers.length > 1) {
      destinationPath = explorers[panelIndex ^ 1].getState().path;
    } else {
      destinationPath = explorers[0].getState().path;
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

    if (explorers.length > 1) {
      destinationPath = explorers[panelIndex ^ 1].getState().path;
    } else {
      destinationPath = explorers[0].getState().path;
    }

    fileActionApi.activate({
      destinationPath,
      files: filesToMove,
      type: 'move',
    });
  };

  const onGotoSelect = (path: string) => {
    if (isGotoPaletteOpen.panelIndex) {
      events[isGotoPaletteOpen.panelIndex].changePath(path);
    }
    closeGotoPalette();
  };

  const onResize = (value: number[]) => {
    events[0].resizeExplorer(value[0]);

    if (value[1]) {
      events[1].resizeExplorer(value[1]);
    }
  };

  const onDirectoryChange = (index: number) => (path: string) => {
    addPath(path);
    events[index].changePath(path);
  };

  const commands = useMemo(
    () => ({
      'Toggle auto preview': () => settingsApi.toggleAutoPreview(),
      'Toggle show hidden': () => settingsApi.toggleShowHidden(),
    }),
    []
  );

  return (
    <DefaultPanel
      onHide={() => toggleExplorers()}
      onSplit={splitExplorer}
      splitable={explorers.length < 2}
    >
      <CommandsWrapper commands={commands} scope="explorers">
        <KeymapWrapper handlers={hotkeys} scope="explorerPanels">
          <SplitPanels minSize={200} onResize={onResize} splitType="horizontal">
            {map(explorers, (item, i) => {
              const explorer = item.getState();

              return (
                <ErrorBoundary key={item.sid ?? i}>
                  <Explorer
                    autoPreview={settings.autoPreview}
                    closable={explorers.length > 1}
                    directoryManager={directoryManager}
                    explorerState={explorer}
                    index={i}
                    onClose={onClose(i)}
                    onCopy={onCopy(i)}
                    onDirectoryChange={onDirectoryChange(i)}
                    onMove={onMove(i)}
                    onPreview={props.onPreview}
                    openInTerminal={props.openInTerminal}
                    showHidden={settings.showHidden}
                    theme={settings.theme}
                  />
                </ErrorBoundary>
              );
            })}
          </SplitPanels>
        </KeymapWrapper>
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
