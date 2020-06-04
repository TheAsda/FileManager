import React, { useState } from 'react';
import { Window, CommandPalette, Option } from './components';
import {
  CacheProvider,
  ManagersProvider,
  useManagers,
  usePanels,
} from '@fm/hooks';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';
import { PanelType } from '@fm/common';

const App = () => {
  const { keysManager, themesManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  const { addNewPanel } = usePanels();
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const openExplorer = () => {
    addNewPanel(PanelType.explorer);
  };

  const commands: Option = {
    'Open new explorer': openExplorer,
  };

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys keyMap={keysManager.getKeyMap()} handlers={handlers}>
        <ManagersProvider>
          <CacheProvider>
            <Window />
          </CacheProvider>
        </ManagersProvider>
      </HotKeys>
      <CommandPalette
        isOpened={isCommandPaletteOpen}
        commands={commands}
        onClose={closeCommandPalette}
      />
    </CSSApplicator>
  );
};

export { App };
