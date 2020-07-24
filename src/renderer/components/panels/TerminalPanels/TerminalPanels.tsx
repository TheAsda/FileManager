import React, { useEffect } from 'react';
import { SplitPanels } from 'renderer/components/SplitPanels';
import { Terminal } from 'renderer/components/Terminal';
import { map, merge, noop } from 'lodash';
import { ErrorBoundary } from 'renderer/components/ErrorBoundary';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals, useFocus, useHotKeys, useCommands } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import { SelectPalette, Commands } from 'renderer/components/modals';
import { SelectPanel } from '../SelectPanel';
import { bind, unbind } from 'mousetrap';

interface TerminalPanelsProps extends HOHandlers {
  selectModeActivated?: boolean;
  onSelect: (index: number) => void;
  onSelectClose: () => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  const { data, dispatch } = useTerminals();
  const { data: focus, dispatch: focusAction } = useFocus();
  const { dispatch: commandsAction } = useCommands();
  const { dispatch: keysAction } = useHotKeys();

  const onClose = (index: number) => () => {
    dispatch({
      type: 'destroy',
      id: data[index].getId(),
    });
  };

  const splitTerminal = () => {
    dispatch({
      type: 'spawn',
    });
  };

  const focusItem = (index: number) => () => {
    console.log('focusItem -> index', index);
    focusAction({
      type: 'focusItem',
      index,
    });

    keysAction({
      type: 'setHotKeys',
      hotkeys: merge(data[index].getHotkeys(), props.hotkeys),
    });

    commandsAction({
      type: 'empty',
    });

    commandsAction({
      type: 'add',
      items: merge(data[index].getCommands(), props.commands),
    });
  };

  useEffect(() => {
    if (props.selectModeActivated === true) {
      bind('esc', () => {
        props.onSelectClose();
      });

      return () => {
        unbind('esc');
      };
    }
  }, [props.selectModeActivated]);

  // useEffect(() => {
  //   if (focus.focusedPanel === 'terminal' && focus.index !== undefined) {
  //     console.log('TerminalPanels -> focus.focusedPanel', focus.focusedPanel);
  //     focusItem(focus.index)();
  //   }
  // }, [focus]);

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'terminal' })}
      onSplit={splitTerminal}
      splitable={data.length < 2}
    >
      <SplitPanels className="terminal-panels" splitType="horizontal">
        {map(data, (item, i) => {
          return (
            <ErrorBoundary key={item.getId()}>
              <Terminal
                closable={data.length > 1}
                onClose={onClose(i)}
                onExit={onClose(i)}
                onFocus={focusItem(i)}
                terminalManager={item}
              />
              {props.selectModeActivated && (
                <SelectPanel
                  hotkey={(i + 1).toString()}
                  onSelect={() => props.onSelect(i)}
                  text={i + 1}
                />
              )}
            </ErrorBoundary>
          );
        })}
      </SplitPanels>
    </DefaultPanel>
  );
};

export { TerminalPanels, TerminalPanelsProps };
