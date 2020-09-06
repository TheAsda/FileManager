import React, { useState } from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { ErrorBoundary, SplitPanels, GoToPalette, Terminal, HotKeysWrapper } from '@fm/components';
import {
  destroyTerminal,
  terminalsEventsStore,
  settingsStore,
  spawnTerminal,
  terminalsStore,
  pathsStore,
} from '@fm/store';
import { useStore } from 'effector-react';
import { map } from 'lodash';

const TerminalPanels = () => {
  const settings = useStore(settingsStore);
  const terminals = useStore(terminalsStore);
  const events = useStore(terminalsEventsStore);
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

  return (
    <DefaultPanel onSplit={splitTerminal} splitable={terminals.length < 2}>
      {
        <HotKeysWrapper handlers={hotkeys}>
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
        </HotKeysWrapper>
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
