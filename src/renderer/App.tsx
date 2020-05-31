import React, { useState } from 'react';
import { Window, CommandPalette, Option } from './components';
import { CacheProvider, ManagersProvider, useManagers } from '@fm/hooks';
import { HotKeys } from 'react-hotkeys';
import './style.css';

const App = () => {
  const { keysManager } = useManagers();
  const [isCommandPaletteOpen, setCommandPalette] = useState<boolean>(false);
  console.log(isCommandPaletteOpen);
  const openCommandPalette = () => setCommandPalette(true);
  const closeCommandPalette = () => setCommandPalette(false);

  const handlers = {
    openCommandPalette: openCommandPalette,
  };

  const commands: Option = {
    'Console Log': () => console.log('Test1'),
    'Console Log 2': () => console.log('Test2'),
    'Console Log 3': () => console.log('Test3'),
    'Console Log 4': () => console.log('Test4'),
    'Console Log 5': () => console.log('Test5'),
    'Console Log 6': () => console.log('Test6'),
  };

  return (
    <>
      <HotKeys
        keyMap={keysManager.getKeyMap()}
        handlers={handlers}
        className="hot-keys"
      >
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
    </>
  );
};

export { App };
