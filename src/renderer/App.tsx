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
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { keysManager, themesManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  console.log(keysManager);
  console.log(themesManager);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const commands: Option = {};

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
        <ManagersProvider>
          <ExplorersProvider>
            <TerminalsProvider>
              <PreviewProvider>
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
