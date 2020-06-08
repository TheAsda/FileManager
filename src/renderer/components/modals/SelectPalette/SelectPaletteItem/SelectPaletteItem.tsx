import React from 'react';
import './style.css';

interface SelectPaletteItemProps {
  selected?: boolean;
  command: string;
}

const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  return (
    <div className={`select-palette__item ${props.selected ? 'select-palette__item--selected' : ''}`}>
      {props.command}
    </div>
  );
};

export { SelectPaletteItem };
