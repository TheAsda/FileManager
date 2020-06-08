import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import { Explorer, Terminal } from '../panels';
import { useCache, useManagers } from '@fm/hooks';
import { Panel, PanelType } from '@fm/common';
import { map, noop, forEach, compact, constant } from 'lodash';
import { ErrorBoundary } from '../ErrorBoundary';
import { HotKeys } from 'react-hotkeys';

interface SplitPanelsProps {
  panels: Panel[];
}

const SplitPanels = (props: SplitPanelsProps) => {
  const { getCached, updateStorage } = useCache();
  const { directoryManager, getTerminalManager, keysManager, panelsManager } = useManagers();
  const [focus, setFocus] = useState<number>(props.panels[0]?.id ?? undefined);
  const layout = panelsManager.getLayout();
  const grid = Array.from(Array(layout.yLength), () =>
    Array.from<undefined, Panel | null>(Array(layout.xLength), constant(null))
  );

  forEach(props.panels, (item) => {
    grid[item.start.y][item.start.x] = item;
  });

  const switchPane = noop;

  const handlers = {
    switchPane,
  };

  return (
    <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers}>
      <table>
        {map(grid, (row) => {
          return (
            <tr>
              {map(compact(row), (item: Panel) => {
                switch (item.type) {
                  case PanelType.explorer:
                    return (
                      <td colSpan={item.span.x} rowSpan={item.span.y}>
                        <ErrorBoundary>
                          <Explorer
                            addToCache={updateStorage}
                            getCachedDirectory={getCached}
                            directoryManager={directoryManager}
                            initialDirectory={item.initialDirectory}
                            key={item.id}
                          />
                        </ErrorBoundary>
                      </td>
                    );
                  case PanelType.terminal:
                    return (
                      <td colSpan={item.span.x} rowSpan={item.span.y}>
                        <ErrorBoundary>
                          <Terminal
                            terminalManager={getTerminalManager()}
                            onExit={() => console.log('Exit terminal')}
                          />
                        </ErrorBoundary>
                      </td>
                    );
                  default:
                    return null;
                }
              })}
            </tr>
          );
        })}
      </table>
    </HotKeys>
  );
};

export { SplitPanels };
