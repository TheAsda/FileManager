import { styled } from '@fm/components/common/styled';
import React from 'react';

const Item = styled<'ul', { selected?: boolean }>('ul', ({ selected, $theme }) => ({
  cursor: 'pointer',
  margin: 0,
  padding: 0,
  backgroundColor: selected ? $theme['palette.selectedColor'] : $theme['palette.backgroundColor'],
  ':hover': {
    backgroundColor: $theme['primary.hoverColor'],
  },
}));

interface SelectPaletteItemProps {
  selected?: boolean;
  command: string;
  onSelect: () => void;
}

const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  return (
    <Item onClick={props.onSelect} role="listitem" selected={props.selected}>
      {props.command}
    </Item>
  );
};

export { SelectPaletteItem, SelectPaletteItemProps };
