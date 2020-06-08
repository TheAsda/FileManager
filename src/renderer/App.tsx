import React, { useState } from 'react';
import { Window, CommandPalette, Option } from './components';
import { CacheProvider, ManagersProvider, useManagers } from '@fm/hooks';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';
import { PanelType } from '@fm/common';

const App = () => {
  const { keysManager, themesManager, panelsManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const openExplorer = () => {
    console.log('Add explorer');
    panelsManager.addNewPanel(PanelType.explorer);
  };

  const openTerminal = () => {
    console.log('Open terminal');
    panelsManager.addNewPanel(PanelType.terminal);
  };

  const commands: Option = {
    'Open new explorer': openExplorer,
    'Open terminal': openTerminal,
  };

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers} className="hot-keys">
        <ManagersProvider>
          <CacheProvider>
            <Window />
          </CacheProvider>
        </ManagersProvider>
      </HotKeys>
      <CommandPalette isOpened={isCommandPaletteOpen} commands={commands} onClose={closeCommandPalette} />
    </CSSApplicator>
  );
};

export { App };
