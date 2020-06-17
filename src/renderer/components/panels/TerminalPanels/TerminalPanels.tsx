import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { Terminal } from 'renderer/components/Terminal';
import { ITerminalManager } from '@fm/common';
import { map } from 'lodash';
import { ErrorBoundary } from 'renderer/components/ErrorBoundary';
import './style.css';

interface TerminalPanelsProps {
  onSplit?: () => void;
  canSplit?: boolean;
  managers: ITerminalManager[];
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  return (
    <div className="terminal-panels">
      <button className="terminal-panels__button" onClick={props.onSplit}>
        split
      </button>
      <SplitPanels splitType="horizontal">
        {map(props.managers, (item, i) => (
          <ErrorBoundary key={i}>
            <Terminal terminalManager={item} />
          </ErrorBoundary>
        ))}
      </SplitPanels>
    </div>
  );
};

export { TerminalPanels, TerminalPanelsProps };