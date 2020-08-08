import React from 'react';
import { Window } from './components';
import {
  useManagers,
  ExplorersProvider,
  TerminalsProvider,
  PreviewProvider,
  CommandsProvider,
  HotKeysProvider,
  useTheme,
  ThemeProvider,
} from '@fm/hooks';
import { DEFAULT_LAYOUT } from '@fm/common';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';
import { Titlebar } from './components/Titlebar';

const App = () => {
  const { settingsManager } = useManagers();

  return (
    <>
      <Titlebar />
      <ThemeProvider>
        <HotKeysProvider>
          <ExplorersProvider initialState={DEFAULT_LAYOUT.explorers.panels}>
            <TerminalsProvider initialState={DEFAULT_LAYOUT.terminals.panels}>
              <PreviewProvider settingsManager={settingsManager}>
                <CommandsProvider>
                  <Window />
                </CommandsProvider>
              </PreviewProvider>
            </TerminalsProvider>
          </ExplorersProvider>
        </HotKeysProvider>
      </ThemeProvider>
    </>
  );
};

export { App };
