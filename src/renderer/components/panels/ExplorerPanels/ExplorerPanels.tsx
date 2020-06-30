import React from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { map } from 'lodash';
import { Explorer } from 'renderer/components/Explorer';
import { IDirectoryManager } from '@fm/common';
import { ErrorBoundary } from 'renderer/components';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useExplorers, useFocus, useCommands } from '@fm/hooks';

interface ExplorerPalensProps {
  directoryManager: IDirectoryManager;
  onPreview?: (path: string) => void;
}

const ExplorerPanels = (props: ExplorerPalensProps) => {
  const { data, dispatch } = useExplorers();
  const { data: focus, dispatch: focusAction } = useFocus();
  const { dispatch: commandsAction } = useCommands();

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

  const focusItem = (index: number) => () => {
    const name = `log ${index}`;

    console.log('focusItem -> name', name);
    focusAction({
      type: 'focusItem',
      index,
    });

    commandsAction({
      type: 'add',
      items: {
        [name]: () => console.log(index),
      },
    });
  };

  const unFocusItem = (index: number) => () => {
    const name = `log ${index}`;

    commandsAction({
      type: 'remove',
      items: {
        [name]: () => console.log(index),
      },
    });
  };

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'explorer' })}
      onSplit={splitExplorer}
      splitable={data.length < 2}
    >
      <SplitPanels splitType="horizontal">
        {map(data, (item, i) => {
          return (
            <ErrorBoundary key={item.getId()}>
              <Explorer
                closable={data.length > 1}
                directoryManager={props.directoryManager}
                explorerManager={item}
                focused={focus.focusedPanel === 'explorer' && focus.index === i}
                onBlur={unFocusItem(i)}
                onClose={onClose(i)}
                onFocus={focusItem(i)}
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
