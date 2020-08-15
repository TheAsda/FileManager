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

interface TerminalPanelsProps extends HOHandlers {
  selectModeActivated?: boolean;
  onSelect: (index: number) => void;
  onSelectClose: () => void;
}

const TerminalPanels = (props: TerminalPanelsProps) => {
  const { terminals, closeTerminal, openTerminal } = useTerminals();
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
    closeTerminal(terminals[index].getId());
  };

  const splitTerminal = () => {
    openTerminal();
  };

  const hotkeys = {
    openGoto: openGotoPalette,
  };

  const onGotoSelect = () => {
    closeGotoPalette();
  };

  return (
    <DefaultPanel
      // onFocus={() => focusPanel('terminal')}
      onSplit={splitTerminal}
      splitable={terminals.length < 2}
    >
      {theme && (
        <HotKeysWrapper handlers={hotkeys}>
          <SplitPanels className="terminal-panels" splitType="horizontal">
            {map(terminals, (item, i) => {
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
            })}
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
