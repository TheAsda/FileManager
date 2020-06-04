import React, { useState } from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import { Explorer, Terminal } from '../panels';
import { useCache, useManagers } from '@fm/hooks';
import { Panel, PanelType } from '@fm/common';
import { map } from 'lodash';
import { ErrorBoundary } from '../ErrorBoundary';
import { HotKeys } from 'react-hotkeys';

interface SplitPanelsProps {
  panels: Panel[];
}

const SplitPanels = (props: SplitPanelsProps) => {
  const { getCached, updateStorage } = useCache();
  const { directoryManager, getTerminalManager, keysManager } = useManagers();
  const [focus, setFocus] = useState<number>(props.panels[0]?.id ?? undefined);
  console.log(props.panels);

  const switchPane = () => {};

  const handlers = {
    switchPane,
  };

  return (
    <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers}>
      <SplitPane minSize={`${100 / props.panels.length}%`}>
        {props.panels ? (
          map(props.panels, (item) => {
            switch (item.type) {
              case PanelType.explorer:
                return (
                  <ErrorBoundary>
                    <Explorer
                      addToCache={updateStorage}
                      getCachedDirectory={getCached}
                      directoryManager={directoryManager}
                      initialDirectory={item.initialDirectory}
                      key={item.id}
                      focus={item.id === focus}
                    />
                  </ErrorBoundary>
                );
              case PanelType.terminal:
                return (
                  <ErrorBoundary>
                    <Terminal
                      terminalManager={getTerminalManager()}
                      onExit={() => console.log('Exit terminal')}
                    />
                  </ErrorBoundary>
                );
              default:
                return <div>Unknown type</div>;
            }
          })
        ) : (
          <div>No panels</div>
        )}
      </SplitPane>
    </HotKeys>
  );
};

export { SplitPanels };
