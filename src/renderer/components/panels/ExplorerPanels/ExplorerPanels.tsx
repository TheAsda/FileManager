import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map, times } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager } from '@fm/common';
import { ErrorBoundary } from 'renderer/components';

interface ExplorerPalensProps {
  onSplit?: () => void;
  canSplit?: boolean;
  manager: IDirectoryManager;
  panelCount: number;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  return (
    <div>
      <button onClick={props.onSplit}>split</button>
      <SplitPanels splitType="horizontal">
        {times(props.panelCount, (i) => (
          <ErrorBoundary key={i}>
            <Explorer directoryManager={props.manager} />
          </ErrorBoundary>
        ))}
      </SplitPanels>
    </div>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
