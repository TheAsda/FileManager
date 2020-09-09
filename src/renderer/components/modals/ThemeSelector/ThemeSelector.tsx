import React, { useState, useEffect } from 'react';
import { Commands, SelectPalette } from '../SelectPalette';
import { remote, app } from 'electron';
import { useDirectoryManager } from '@fm/hooks';
import { reject, filter, endsWith, map } from 'lodash';
import { useStore } from 'effector-react';
import { CommandsWrapper, settingsStore, settingsApi } from '@fm/store';
import { silly } from 'electron-log';

const themesFolderPath = (app || remote.app).getPath('userData') + '/themes';

const ThemeSelector = () => {
  const [isThemeSelectorOpened, setThemeSelectorState] = useState<boolean>(false);

  const openThemeSelector = () => {
    silly('Open theme selector');
    setThemeSelectorState(true);
  };
  const closeThemeSelector = () => {
    silly('Close theme selector');
    setThemeSelectorState(false);
  };

  const [state, setState] = useState<string[]>([]);
  const { theme } = useStore(settingsStore);
  const { directoryManager } = useDirectoryManager();

  useEffect(() => {
    if (isThemeSelectorOpened) {
      directoryManager.listDirectory(themesFolderPath).then((items) => {
        const options = filter(reject(items, ['name', '..']), (item) =>
          endsWith(item.name, 'json')
        );

        setState(map(options, (item) => item.name.substr(0, item.name.lastIndexOf('.'))));
      });
    }
  }, [isThemeSelectorOpened]);

  const onSelect = (theme: string) => {
    settingsApi.setTheme(theme);
  };

  const commands: Commands = {
    'Open theme selector': openThemeSelector,
  };

  return (
    <CommandsWrapper commands={commands} scope="theme">
      <SelectPalette
        isOpened={isThemeSelectorOpened}
        onClose={closeThemeSelector}
        onSelect={onSelect}
        options={state}
        theme={theme}
      />
    </CommandsWrapper>
  );
};

export { ThemeSelector };
