import React, { useState, useMemo } from 'react';
import { map } from 'lodash';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useTerminals, useManagers, useTheme, usePaths } from '@fm/hooks';
import { SelectPanel } from '../SelectPanel';
import {
  HOHandlers,
  ErrorBoundary,
  SplitPanels,
  GoToPalette,
  Terminal,
  HotKeysWrapper,
} from '@fm/components';
import { useStore } from 'effector-react';
import { store, setTerminalSize, closeTerminal, openTerminal } from 'renderer/Store';

interface TerminalPanelsProps extends HOHandlers {
  selectModeActivated?: boolean;
  onSelect: (index: number) => void;
  onSelectClose: () => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  // const { terminals, closeTerminal, openTerminal } = useTerminals();
  const { terminals } = useStore(store);
  const { getIdentityManager } = useManagers();
  const { theme } = useTheme();
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
    });
  };

  const onClose = (index: number) => () => {
    closeTerminal(index);
    // closeTerminal(terminals[index].getId());
  };

  const splitTerminal = () => {
    openTerminal({});
    // openTerminal();
  };

  const hotkeys = {
    openGoto: openGotoPalette,
  };

  const onGotoSelect = () => {
    closeGotoPalette();
  };

  const onResize = (value: number[]) => {
    if (terminals.panel0 && terminals.panel1) {
      setTerminalSize({
        height: value[0],
        index: 0,
      });
      setTerminalSize({
        height: value[1],
        index: 1,
      });
      return;
    }
    if (!terminals.panel0) {
      setTerminalSize({
        height: value[0],
        index: 1,
      });
      return;
    }
    if (!terminals.panel1) {
      setTerminalSize({
        height: value[0],
        index: 0,
      });
      return;
    }

    console.error('WTF Resizing', terminals);
  };

  return (
    <DefaultPanel
      // onFocus={() => focusPanel('terminal')}
      onSplit={splitTerminal}
      splitable={!terminals.panel0 || !terminals.panel1}
    >
      {theme && (
        <HotKeysWrapper handlers={hotkeys}>
          <SplitPanels className="terminal-panels" splitType="horizontal" onResize={onResize}>
            {terminals.panel0 && (
              <ErrorBoundary>
                <Terminal
                  closable={terminals.panel1 !== undefined}
                  onClose={onClose(0)}
                  onExit={onClose(0)}
                  terminalManager={terminals.panel0.manager}
                  theme={theme}
                />
                {props.selectModeActivated && (
                  <SelectPanel
                    hotkey={(1).toString()}
                    onSelect={() => props.onSelect(0)}
                    text={1}
                  />
                )}
              </ErrorBoundary>
            )}
            {terminals.panel1 && (
              <ErrorBoundary>
                <Terminal
                  closable={terminals.panel0 !== undefined}
                  onClose={onClose(1)}
                  onExit={onClose(1)}
                  terminalManager={terminals.panel1.manager}
                  theme={theme}
                />
                {props.selectModeActivated && (
                  <SelectPanel
                    hotkey={(2).toString()}
                    onSelect={() => props.onSelect(0)}
                    text={2}
                  />
                )}
              </ErrorBoundary>
            )}
            {/* {map(terminals, (item, i) => {
              return (
                <ErrorBoundary key={item.getId()}>
                  <Terminal
                    closable={terminals.length > 1}
                    onClose={onClose(i)}
                    onExit={onClose(i)}
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
            })} */}
          </SplitPanels>
        </HotKeysWrapper>
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
