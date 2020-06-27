import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager, IExplorerManager } from '@fm/common';
import { ErrorBoundary } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers } from '@fm/hooks';

interface ExplorerPalensProps {
  onSplit?: () => void;
  canSplit?: boolean;
  managers: IExplorerManager[];
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
  onClose?: (index: number | null) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      index,
    });
  };

  return (
    <DefaultPanel onSplit={props.onSplit} splitable={true}>
      <SplitPanels splitType="horizontal">
        {map(data, (item, i) => {
          return (
            <ErrorBoundary key={item.getId()}>
              <Explorer
                closable={data.length > 1}
                directoryManager={props.directoryManager}
                explorerManager={item}
                onClose={onClose(i)}
                onPreview={props.onPreview}
              />
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
