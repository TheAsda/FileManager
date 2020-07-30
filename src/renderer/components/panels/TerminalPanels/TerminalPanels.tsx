import React, { useEffect, useState, useMemo } from 'react';
import { map, merge } from 'lodash';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals, useFocus, useHotKeys, useCommands, useManagers, useCache } from '@fm/hooks';
import { SelectPanel } from '../SelectPanel';
import { bind, unbind } from 'mousetrap';
import { HOHandlers, ErrorBoundary, SplitPanels, GoToPalette, Terminal } from '@fm/components';

interface TerminalPanelsProps extends HOHandlers {
  selectModeActivated?: boolean;
  onSelect: (index: number) => void;
  onSelectClose: () => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  const { data, dispatch } = useTerminals();
  const { getIdentityManager } = useManagers();
  const { data: focus, dispatch: focusAction } = useFocus();
  const { dispatch: commandsAction } = useCommands();
  const { dispatch: keysAction } = useHotKeys();
  const [isGotoPaletteOpen, setGotoPalette] = useState<{
    isShown: boolean;
    panelIndex?: number;
  }>({
    isShown: false,
  });
  const gotoManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const cacheManager = useCache();

  const closeGotoPalette = () => {
    setGotoPalette({
      isShown: false,
      panelIndex: undefined,
    });

    keysAction({
      type: 'setHotKeys',
      pop: true,
    });
  };

  const openGotoPalette = () => {
    setGotoPalette({
      isShown: true,
      panelIndex: focus.index,
    });
    keysAction({
      type: 'setHotKeys',
      hotkeys: gotoManager.getHotkeys(),
      push: true,
    });
  };

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

  const hotkeys = {
    openGoto: openGotoPalette,
  };

  const onGotoSelect = (path: string) => {
    if (focus.index !== undefined) {
      data[focus.index].changeDirectory(path);
    }
    closeGotoPalette();
  };

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'terminal' })}
      onSplit={splitTerminal}
      splitable={data.length < 2}
    >
      <SplitPanels className="terminal-panels" splitType="horizontal">
        {map(data, (item, i) => {
          const focused = focus.focusedPanel === 'terminal' && focus.index === i;

          return (
            <ErrorBoundary key={item.getId()}>
              <Terminal
                closable={data.length > 1}
                focused={focused}
                hotkeys={hotkeys}
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
      <GoToPalette
        isOpened={isGotoPaletteOpen.isShown}
        manager={gotoManager}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={[...cacheManager.cache]}
      />
    </DefaultPanel>
  );
};

export { TerminalPanels, TerminalPanelsProps };
