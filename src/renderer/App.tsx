import React from 'react';
import { Window } from './components';
import {
  ExplorersProvider,
  TerminalsProvider,
  PreviewProvider,
  CommandsProvider,
  HotKeysProvider,
  ThemeProvider,
  useSettings,
} from '@fm/hooks';
import './style.css';
import { Titlebar } from './components/Titlebar';

const App = () => {
  const { settings } = useSettings();

  return (
    <>
      <Titlebar />
      <ThemeProvider>
        <HotKeysProvider>
          {settings?.layout && (
            <ExplorersProvider initialState={settings.layout.explorers.panels}>
              <TerminalsProvider initialState={settings.layout.terminals.panels}>
                <PreviewProvider>
                  <CommandsProvider>
                    <Window />
                  </CommandsProvider>
                </PreviewProvider>
              </TerminalsProvider>
            </ExplorersProvider>
          )}
        </HotKeysProvider>
      </ThemeProvider>
    </>
  );
};

export { App };
