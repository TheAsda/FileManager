import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager, IExplorerManager } from '@fm/common';
import { ErrorBoundary } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { PathWrapper } from '../PathWrapper';

interface ExplorerPalensProps {
  onSplit?: () => void;
  canSplit?: boolean;
  managers: IExplorerManager[];
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
  onClose?: (id: number) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  // eslint-disable-next-line lodash/prefer-invoke-map
  console.log(map(props.managers, (item) => item.getPathArray()));

  return (
    <DefaultPanel onSplit={props.onSplit} splitable={true}>
      <SplitPanels splitType="horizontal">
        {map(props.managers, (item, i) => (
          <PathWrapper path={item.getPathString()}>
            <ErrorBoundary key={i}>
              <Explorer
                directoryManager={props.directoryManager}
                explorerManager={item}
                onPreview={props.onPreview}
              />
            </ErrorBoundary>
          </PathWrapper>
        ))}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
