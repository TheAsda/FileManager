import React, { useEffect, useMemo, useState } from 'react';
import { FileInfo } from '@fm/common';
import { DefaultPanel } from '../DefaultPanel';
import { useDirectoryManager } from '@fm/hooks';
import { SplitPanels, ErrorBoundary, Explorer } from '@fm/components';
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
  useActivateScope,
  ExplorerStore,
} from '@fm/store';
import { useStore } from 'effector-react';
import { map } from 'lodash';
import { addElement, registerGroup } from '@fm/store/focusStore';
import { SelectPalette } from '@fm/components/modals';
import { Store } from 'effector';

interface ExplorerPanelsProps {
  onPreview?: (item: FileInfo) => void;
  openInTerminal?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPanelsProps) => {
  const settings = useStore(settingsStore);
  const explorers = useStore(explorersStore);
  const events = useStore(explorersEventsStore);
  const { directoryManager } = useDirectoryManager();
  const { activate } = useActivateScope();
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

  useEffect(() => {
    registerGroup('explorers');
  }, []);

  const onMount = (index: number) => (element: HTMLElement) => {
    addElement({
      element,
      group: 'explorers',
      onFocus: () => (element.focus(), activate(`explorerPanels.explorer.${index}`)),
    });
  };

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
              return (
                <WithExplorer store={item}>
                  {(explorer) => {
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
                          onMount={onMount(i)}
                          onMove={onMove(i)}
                          onPreview={props.onPreview}
                          openInTerminal={props.openInTerminal}
                          showHidden={settings.showHidden}
                          theme={settings.theme}
                        />
                      </ErrorBoundary>
                    );
                  }}
                </WithExplorer>
              );
            })}
          </SplitPanels>
        </KeymapWrapper>
      </CommandsWrapper>
      <SelectPalette
        isOpened={isGotoPaletteOpen.isShown}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={paths}
      />
    </DefaultPanel>
  );
};

const WithExplorer = (props: {
  children: (store: ExplorerStore) => JSX.Element;
  store: Store<ExplorerStore>;
}) => {
  const explorer = useStore(props.store);

  return props.children(explorer);
};

export { ExplorerPanels, ExplorerPanelsProps };
