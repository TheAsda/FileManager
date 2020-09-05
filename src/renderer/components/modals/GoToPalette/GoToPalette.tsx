import React from 'react';
import './style.css';
import { SelectPalette } from '../SelectPalette';
import { useStore } from 'effector-react';
import { settingsStore } from '@fm/store';

interface GoToPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  const { theme } = useStore(settingsStore);

  return (
    <SelectPalette
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={props.options}
      theme={theme}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
