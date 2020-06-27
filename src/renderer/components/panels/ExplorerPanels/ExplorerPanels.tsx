import React, { useState } from 'react';
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
  const [path, setPath] = useState<string[]>([]);

  return (
    <DefaultPanel onSplit={props.onSplit} splitable={true}>
      <SplitPanels splitType="horizontal">
        {map(props.managers, (item, i) => {
          item.on('pathChange', (path) =>
            setPath((state) => {
              const copy = [...state];
              copy[i] = path;
              return copy;
            })
          );

          return (
            <PathWrapper
              closable={props.managers.length !== 1}
              onClose={() => props.onClose && props.onClose(i)}
              path={path[i]}
            >
              <ErrorBoundary key={i}>
                <Explorer
                  directoryManager={props.directoryManager}
                  explorerManager={item}
                  onPreview={props.onPreview}
                />
              </ErrorBoundary>
            </PathWrapper>
          );
        })}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { ExplorerPanels, ExplorerPalensProps };
