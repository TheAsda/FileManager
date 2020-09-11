import React from 'react';
import './style.css';
import { SelectPalette } from '../SelectPalette';

interface GoToPaletteProps {
  isOpened: boolean;
  onClose: () => void;
  options: string[];
  onSelect: (path: string) => void;
}

const GoToPalette = (props: GoToPaletteProps) => {
  return (
    <SelectPalette
      isOpened={props.isOpened}
      onClose={props.onClose}
      onSelect={props.onSelect}
      options={props.options}
    />
  );
};

export { GoToPalette, GoToPaletteProps };
