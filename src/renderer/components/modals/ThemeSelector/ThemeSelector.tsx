import React, { useState, useEffect } from 'react';
import { SelectPalette } from '../SelectPalette';
import { remote } from 'electron';
import { useManagers } from '@fm/hooks';
import { reject, filter, endsWith, map, noop } from 'lodash';

const themesFolderPath = remote.app.getPath('userData') + '/themes';

interface ThemeSelectorProps {
  isOpened: boolean;
  onClose: () => void;
}

const ThemeSelector = (props: ThemeSelectorProps) => {
  const [state, setState] = useState<string[]>([]);
  const { directoryManager } = useManagers();

  useEffect(() => {
    if (props.isOpened) {
      directoryManager.listDirectory(themesFolderPath).then((items) => {
        const options = filter(reject(items, ['name', '..']), (item) =>
          endsWith(item.name, 'json')
        );

        setState(map(options, (item) => item.name.substr(0, item.name.lastIndexOf('.'))));
      });
    }
  }, [props.isOpened]);

  const onSelect = noop;

  return (
    <SelectPalette
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={onSelect}
      options={state}
    />
  );
};

export { ThemeSelector, ThemeSelectorProps };
