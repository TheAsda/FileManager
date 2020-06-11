import React, { useState } from 'react';
import { Explorer, Terminal } from '../panels';
import { useCache, useManagers } from '@fm/hooks';
import { Panel, PanelType } from '@fm/common';
import { map, noop, forEach, compact, constant, times } from 'lodash';
import { ErrorBoundary } from '../ErrorBoundary';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { time } from 'console';

interface SplitPanelsProps {
  panels: Panel[];
}

const SplitPanels = (props: SplitPanelsProps) => {
  const { getCached, updateStorage } = useCache();
  const { directoryManager, getTerminalManager, keysManager, settingsManager } = useManagers();
  const [focus, setFocus] = useState<number>(props.panels[0]?.id ?? undefined);
  const { panelsGridSize } = settingsManager.getSettings();
  const grid = Array.from(Array(panelsGridSize.yLength), () =>
    Array.from<undefined, Panel | null | undefined>(Array(panelsGridSize.xLength), constant(undefined))
  );

  forEach(props.panels, (item) => {
    for (let i = item.start.y; i < item.start.y + item.span.y; i++) {
      for (let j = item.start.x; j < item.start.x + item.span.x; j++) {
        grid[i][j] = null;
      }
    }

    grid[item.start.y][item.start.x] = item;
  });

  const switchPane = noop;

  const handlers = {
    switchPane,
  };

  console.table(grid);

  return (
    <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers} className="hot-keys">
      <table className="split-panels">
        <colgroup>
          {times(panelsGridSize.xLength, () => (
            <col width={`${100 / panelsGridSize.xLength}%`} />
          ))}
        </colgroup>
        <tbody>
          {map(grid, (row) => {
            return (
              <tr className="split-panels__row">
                {map(row, (item: Panel | null | undefined) => {
                  if (item === null) {
                    return <td className="split-panels__cell"></td>;
                  }

                  if (item === undefined) {
                    return null;
                  }

                  switch (item.type) {
                    case PanelType.explorer:
                      return (
                        <td colSpan={item.span.x} rowSpan={item.span.y} className="split-panels__cell">
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
                        <td className="split-panels__cell" colSpan={item.span.x} rowSpan={item.span.y}>
                          <ErrorBoundary>
                            <Terminal
                              terminalManager={getTerminalManager()}
                              onExit={() => console.log('Exit terminal')}
                            />
                          </ErrorBoundary>
                        </td>
                      );
                    default:
                      return <td className="split-panels__cell" />;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </HotKeys>
  );
};

export { SplitPanels };
