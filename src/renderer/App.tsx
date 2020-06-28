import React, { useState } from 'react';
import { CommandPalette, Option, Window } from './components';
import {
  CacheProvider,
  ManagersProvider,
  useManagers,
  ExplorersProvider,
  TerminalsProvider,
  PreviewProvider,
} from '@fm/hooks';
import { DEFAULT_LAYOUT } from '@fm/common';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { keysManager, themesManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const commands: Option = {};

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
        <ManagersProvider>
          <ExplorersProvider initialState={DEFAULT_LAYOUT.explorers.panels}>
            <TerminalsProvider initialState={DEFAULT_LAYOUT.terminals.panels}>
              <PreviewProvider initialState={DEFAULT_LAYOUT.preview.panel}>
                <CacheProvider>
                  <Window />
                </CacheProvider>
              </PreviewProvider>
            </TerminalsProvider>
          </ExplorersProvider>
        </ManagersProvider>
      </HotKeys>
      <CommandPalette
        commands={commands}
        isOpened={isCommandPaletteOpen}
        onClose={closeCommandPalette}
      />
    </CSSApplicator>
  );
};

export { App };
