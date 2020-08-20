import React from 'react';
import './style.css';
import { SelectPalette } from '../SelectPalette';
import { useTheme } from '@fm/hooks';

interface GoToPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  const { theme } = useTheme();

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
