import React, { useState, useEffect } from 'react';
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
import { Settings } from '@fm/common';
import './style.css';
import { CSSApplicator } from './components/CSSApplicator';
import { Titlebar } from './components/Titlebar';
import { ipcRenderer } from 'electron';
import { useSettings } from './hooks/useSettings';

const App = () => {
  const { settingsManager } = useManagers();

  const { settings } = useSettings();
  
  return (
    <>
      <Titlebar />
      <ThemeProvider>
        <HotKeysProvider>
          {settings?.layout && (
            <ExplorersProvider initialState={settings.layout.explorers.panels}>
              <TerminalsProvider initialState={settings.layout.terminals.panels}>
                <PreviewProvider settingsManager={settingsManager}>
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
