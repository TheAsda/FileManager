import React, { useState, useEffect } from 'react';
import './style.css';
import { IDirectoryManager } from '@fm/common';
import { SelectPalette } from '../SelectPalette';
import { filter, map, noop } from 'lodash';

interface GoToPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  directoryManager: IDirectoryManager;
  path?: string;
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  const [state, setState] = useState<{
    loading: boolean;
    items: string[];
  }>({
    loading: true,
    items: [],
  });

  const updateItems = async () => {
    if (props.path) {
      const directoryContent = await props.directoryManager.listDirectory(props.path);
      const directories = filter(directoryContent, 'attributes.directory');
      const items = map(directories, 'name');

      setState({
        loading: false,
        items,
      });
    }
  };

  useEffect(() => {
    if (props.isOpened === true) {
      updateItems();
    } else {
      setState({
        loading: true,
        items: [],
      });
    }
  }, [props.isOpened, props.path]);

  return (
    <SelectPalette
      initHotKeys={noop}
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={state.items}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
