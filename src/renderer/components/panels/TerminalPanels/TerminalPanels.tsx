import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { Terminal } from 'renderer/components/Terminal';
import { map } from 'lodash';
import { ErrorBoundary } from 'renderer/components/ErrorBoundary';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals } from '@fm/hooks';

const TerminalPanels = () => {
  const { data, dispatch } = useTerminals();

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      index,
    });
  };

  const onExit = (index: number) => () => {
    dispatch({
      type: 'exit',
      index,
    });
  };

  const splitTerminal = () => {
    dispatch({
      type: 'spawn',
    });
  };

  return (
    <DefaultPanel onSplit={splitTerminal} splitable={data.length < 2}>
      <SplitPanels className="terminal-panels" splitType="horizontal">
        {map(data, (item, i) => (
          <ErrorBoundary key={item.getId()}>
            <Terminal
              closable={data.length > 1}
              onClose={onClose(i)}
              onExit={onExit(i)}
              terminalManager={item}
            />
          </ErrorBoundary>
        ))}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { TerminalPanels };
