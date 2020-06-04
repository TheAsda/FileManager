import React from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import { Explorer, Terminal } from '../panels';
import { useCache, useManagers } from '@fm/hooks';
import { Panel, PanelType } from '@fm/common';
import { map } from 'lodash';
import { ErrorBoundary } from '../ErrorBoundary';

interface SplitPanelsProps {
  panels: Panel[];
}

const SplitPanels = (props: SplitPanelsProps) => {
  const { getCached, updateStorage } = useCache();
  const { directoryManager, getTerminalManager } = useManagers();

  return (
    <SplitPane {...props.panels}>
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
              return null;
          }
        })
      ) : (
        <div>No panels</div>
      )}
      <Terminal terminalManager={getTerminalManager()} />
    </SplitPane>
  );
};

export { SplitPanels };
