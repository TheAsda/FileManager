import React, { useEffect, useState, useMemo } from 'react';
import { map, merge } from 'lodash';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals, useFocus, useCommands, useManagers, useTheme, usePaths } from '@fm/hooks';
import { SelectPanel } from '../SelectPanel';
import { HOHandlers, ErrorBoundary, SplitPanels, GoToPalette, Terminal } from '@fm/components';
import { HotKeys } from 'react-hotkeys';

interface TerminalPanelsProps extends HOHandlers {
  selectModeActivated?: boolean;
  onSelect: (index: number) => void;
  onSelectClose: () => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  const { data, dispatch } = useTerminals();
  const { getIdentityManager } = useManagers();
  const { theme } = useTheme();
  const { focus, focusIndex, focusPanel } = useFocus();
  const { addCommands, emptyCommands } = useCommands();
  const [isGotoPaletteOpen, setGotoPalette] = useState<{
    isShown: boolean;
    panelIndex?: number;
  }>({
    isShown: false,
  });
  const gotoManager = useMemo(() => {
    return getIdentityManager();
  }, []);
  const { paths } = usePaths();

  const closeGotoPalette = () => {
    setGotoPalette({
      isShown: false,
      panelIndex: undefined,
    });
  };

  const openGotoPalette = () => {
    setGotoPalette({
      isShown: true,
      panelIndex: focus.index,
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
    focusIndex(index);

    emptyCommands();

    addCommands(merge(data[index].getCommands(), props.commands));
  };

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
      onFocus={() => focusPanel('terminal')}
      onSplit={splitTerminal}
      splitable={data.length < 2}
    >
      {theme && (
        <HotKeys handlers={hotkeys}>
          <SplitPanels className="terminal-panels" splitType="horizontal">
            {map(data, (item, i) => {
              const focused = focus.panel === 'terminal' && focus.index === i;

              return (
                <ErrorBoundary key={item.getId()}>
                  <Terminal
                    closable={data.length > 1}
                    focused={focused}
                    onClose={onClose(i)}
                    onExit={onClose(i)}
                    onFocus={focusItem(i)}
                    terminalManager={item}
                    theme={theme}
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
        </HotKeys>
      )}
      <GoToPalette
        isOpened={isGotoPaletteOpen.isShown}
        manager={gotoManager}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={paths}
      />
    </DefaultPanel>
  );
};

export { TerminalPanels, TerminalPanelsProps };
