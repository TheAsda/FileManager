import { Commands } from '@fm/common/interfaces/Commands';
import { useDirectoryManager } from '@fm/hooks';
import { CommandsWrapper, settingsApi } from '@fm/store';
import { silly } from 'electron-log';
import React, { useEffect, useMemo, useState } from 'react';

import { SelectPalette } from '../SelectPalette';

// const themesFolderPath = (app || remote.app).getPath('userData') + '/themes';

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
  const { directoryManager } = useDirectoryManager();

  useEffect(() => {
    if (isThemeSelectorOpened) {
      // directoryManager.listDirectory(themesFolderPath).then((items) => {
      //   const options = filter(reject(items, ['name', '..']), (item) =>
      //     endsWith(item.name, 'json')
      //   );
      //   setState(map(options, (item) => item.name.substr(0, item.name.lastIndexOf('.'))));
      // });
    }
  }, [isThemeSelectorOpened]);

  const onSelect = (theme: string) => {
    settingsApi.setTheme(theme);
  };

  const commands: Commands = useMemo(
    () => ({
      'Open theme selector': openThemeSelector,
    }),
    []
  );

  return (
    <CommandsWrapper commands={commands} scope="window">
      <SelectPalette
        isOpened={isThemeSelectorOpened}
        onClose={closeThemeSelector}
        onSelect={onSelect}
        options={state}
      />
    </CommandsWrapper>
  );
};

export { ThemeSelector };
