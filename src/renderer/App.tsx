import React from 'react';
import { Window } from './components';
import {
  ManagersProvider,
  useManagers,
  ExplorersProvider,
  TerminalsProvider,
  PreviewProvider,
  CommandsProvider,
  HotKeysProvider,
} from '@fm/hooks';
import { DEFAULT_LAYOUT } from '@fm/common';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';

const App = () => {
  const { themesManager, settingsManager } = useManagers();

  return (
    <CSSApplicator theme={themesManager.getTheme()}>
      <HotKeysProvider>
        <ManagersProvider>
          <ExplorersProvider initialState={DEFAULT_LAYOUT.explorers.panels}>
            <TerminalsProvider initialState={DEFAULT_LAYOUT.terminals.panels}>
              <PreviewProvider settingsManager={settingsManager}>
                <CommandsProvider>
                  <Window />
                </CommandsProvider>
              </PreviewProvider>
            </TerminalsProvider>
          </ExplorersProvider>
        </ManagersProvider>
      </HotKeysProvider>
    </CSSApplicator>
  );
};

export { App };
