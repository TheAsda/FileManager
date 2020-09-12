import React, { useEffect, useState } from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { ErrorBoundary, SplitPanels, GoToPalette, Terminal } from '@fm/components';
import {
  destroyTerminal,
  terminalsEventsStore,
  settingsStore,
  spawnTerminal,
  terminalsStore,
  pathsStore,
  KeymapWrapper,
  useActivateScope,
} from '@fm/store';
import { useStore } from 'effector-react';
import { map } from 'lodash';
import { addElement, registerGroup } from '@fm/store/focusStore';

const TerminalPanels = () => {
  const settings = useStore(settingsStore);
  const terminals = useStore(terminalsStore);
  const events = useStore(terminalsEventsStore);
  const { activate } = useActivateScope();
  const [isGotoPaletteOpen, setGotoPalette] = useState<{
    isShown: boolean;
    panelIndex?: number;
  }>({
    isShown: false,
  });
  const { list: paths } = useStore(pathsStore);

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
    destroyTerminal(index);
  };

  const splitTerminal = () => {
    spawnTerminal({});
  };

  const hotkeys = {
    openGoto: openGotoPalette,
  };

  const onGotoSelect = () => {
    closeGotoPalette();
  };

  const onResize = (value: number[]) => {
    events[0].resizeTerminal(value[0]);

    if (value[1]) {
      events[1].resizeTerminal(value[1]);
    }
  };

  useEffect(() => {
    registerGroup('terminals');
  }, []);

  const onMount = (index: number) => (element: HTMLElement) => {
    addElement({
      element,
      group: 'explorers',
      onFocus: () => activate(`terminalPanels.terminal.${index}`),
    });
  };

  return (
    <DefaultPanel onSplit={splitTerminal} splitable={terminals.length < 2}>
      {
        <KeymapWrapper handlers={hotkeys} scope="terminalPanels">
          <SplitPanels className="terminal-panels" onResize={onResize} splitType="horizontal">
            {map(terminals, (item, i) => {
              const terminal = item.getState();

              return (
                <ErrorBoundary key={item.sid ?? i}>
                  <Terminal
                    closable={terminals.length > 1}
                    index={i}
                    onClose={onClose(1)}
                    onExit={onClose(1)}
                    terminalManager={terminal.manager}
                    theme={settings.theme}
                    onMount={onMount(i)}
                  />
                </ErrorBoundary>
              );
            })}
            {/*  <SelectPanel
                     hotkey={(2).toString()}
                     onSelect={() => props.onSelect(0)}
                     text={2}
                   /> */}
          </SplitPanels>
        </KeymapWrapper>
      }
      <GoToPalette
        isOpened={isGotoPaletteOpen.isShown}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={paths}
      />
    </DefaultPanel>
  );
};

export { TerminalPanels };
