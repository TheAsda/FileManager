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
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      index,
    });
  };

  const splitExplorer = () => {
    dispatch({
      type: 'spawn',
    });
  };

  return (
    <DefaultPanel onSplit={splitExplorer} splitable={data.length < 2}>
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
