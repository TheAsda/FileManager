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
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { themesManager } = useManagers();

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
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
    </CSSApplicator>
  );
};

export { App };
