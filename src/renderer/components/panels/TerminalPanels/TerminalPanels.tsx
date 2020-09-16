import { ErrorBoundary, SplitPanels, Terminal } from '@fm/components';
import { SelectPalette } from '@fm/components/modals';
import {
  destroyTerminal,
  KeymapWrapper,
  pathsStore,
  settingsStore,
  spawnTerminal,
  terminalsEventsStore,
  terminalsStore,
  useActivateScope,
} from '@fm/store';
import { addElement, registerGroup } from '@fm/store/focusStore';
import { useStore } from 'effector-react';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';

import { DefaultPanel } from '../DefaultPanel';

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
      group: 'terminals',
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
                    onMount={onMount(i)}
                    terminalManager={terminal.manager}
                    theme={settings.theme}
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
      <SelectPalette
        isOpened={isGotoPaletteOpen.isShown}
        onClose={closeGotoPalette}
        onSelect={onGotoSelect}
        options={paths}
      />
    </DefaultPanel>
  );
};

export { TerminalPanels };
