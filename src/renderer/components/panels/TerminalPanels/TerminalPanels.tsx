import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { Terminal } from 'renderer/components/Terminal';
import { ITerminalManager } from '@fm/common';
import { map } from 'lodash';
import { ErrorBoundary } from 'renderer/components/ErrorBoundary';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';

interface TerminalPanelsProps {
  onSplit?: () => void;
  canSplit?: boolean;
  managers: ITerminalManager[];
  onClose?: (id: number) => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  return (
    <DefaultPanel onSplit={props.onSplit} splitable={true}>
      <SplitPanels className="terminal-panels" splitType="horizontal">
        {map(props.managers, (item, i) => (
          <ErrorBoundary key={i}>
            <Terminal
              onExit={() => props.onClose && props.onClose(item.getId() as number)}
              terminalManager={item}
            />
          </ErrorBoundary>
        ))}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { TerminalPanels, TerminalPanelsProps };
