import React from 'react';
import './style.css';

interface SelectPaletteItemProps {
  selected?: boolean;
  command: string;
  onSelect: () => void;
}

const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  return (
    <div
      className={`select-palette__item ${props.selected ? 'select-palette__item--selected' : ''}`}
      onClick={props.onSelect}
    >
      {props.command}
    </div>
  );
};

export { SelectPaletteItem };
