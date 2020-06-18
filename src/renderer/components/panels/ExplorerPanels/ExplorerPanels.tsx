import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map, times } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager, IExplorerManager } from '@fm/common';
import { ErrorBoundary } from 'renderer/components';
import './style.css';

interface ExplorerPalensProps {
  onSplit?: () => void;
  canSplit?: boolean;
  managers: IExplorerManager[];
  directoryManager: IDirectoryManager;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  return (
    <div className="explorer-panels">
      <button onClick={props.onSplit}>split</button>
      <SplitPanels splitType="horizontal">
        {map(props.managers, (item, i) => (
          <ErrorBoundary key={i}>
            <Explorer directoryManager={props.directoryManager} explorerManager={item} />
          </ErrorBoundary>
        ))}
      </SplitPanels>
    </div>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
