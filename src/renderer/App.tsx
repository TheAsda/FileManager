import React, { useState } from 'react';
import { CommandPalette, Option, Window } from './components';
import { CacheProvider, ManagersProvider, useManagers } from '@fm/hooks';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { keysManager, themesManager, panelsManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const commands: Option = {
  };

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys className="hot-keys" handlers={handlers} keyMap={keysManager.getKeyMap()}>
        <ManagersProvider>
          <CacheProvider>
            <Window />
          </CacheProvider>
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
