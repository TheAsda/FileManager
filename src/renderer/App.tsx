import React from 'react';
import { Window } from './components';
import {
  CacheProvider,
  ManagersProvider,
  useManagers,
  ExplorersProvider,
  TerminalsProvider,
  PreviewProvider,
  CommandsProvider,
} from '@fm/hooks';
import { DEFAULT_LAYOUT } from '@fm/common';
import { HotKeys } from 'react-hotkeys';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { keysManager, themesManager } = useManagers();

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeys className="hot-keys" keyMap={keysManager.getKeyMap()}>
        <ManagersProvider>
          <ExplorersProvider initialState={DEFAULT_LAYOUT.explorers.panels}>
            <TerminalsProvider initialState={DEFAULT_LAYOUT.terminals.panels}>
              <PreviewProvider initialState={DEFAULT_LAYOUT.preview.panel}>
                <CommandsProvider>
                  <CacheProvider>
                    <Window />
                  </CacheProvider>
                </CommandsProvider>
              </PreviewProvider>
            </TerminalsProvider>
          </ExplorersProvider>
        </ManagersProvider>
      </HotKeys>
    </CSSApplicator>
  );
};

export { App };
