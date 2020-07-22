import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { Terminal } from 'renderer/components/Terminal';
import { map } from 'lodash';
import { ErrorBoundary } from 'renderer/components/ErrorBoundary';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals, useFocus } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';

interface TerminalPanelsProps extends HOHandlers {}

const TerminalPanels = (props: TerminalPanelsProps) => {
  const { data, dispatch } = useTerminals();
  const { data: focus, dispatch: focusAction } = useFocus();

  const onClose = (index: number) => () => {
    console.log('onClose -> index', index);
    dispatch({
      type: 'destroy',
      id: data[index].getId(),
    });
  };

  const splitTerminal = () => {
    dispatch({
      type: 'spawn',
    });
  };

  const focusItem = (index: number) => () => {
    focusAction({
      type: 'focusItem',
      index,
    });
  };

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'terminal' })}
      onSplit={splitTerminal}
      splitable={data.length < 2}
    >
      <SplitPanels className="terminal-panels" splitType="horizontal">
        {map(data, (item, i) => {
          return (
            <ErrorBoundary key={item.getId()}>
              <Terminal
                closable={data.length > 1}
                focused={focus.focusedPanel === 'terminal' && focus.index === i}
                onClose={onClose(i)}
                onExit={onClose(i)}
                onFocus={focusItem(i)}
                terminalManager={item}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { TerminalPanels, TerminalPanelsProps };
