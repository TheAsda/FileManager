import React from 'react';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useStore } from 'effector-react';
import { settingsStore } from '@fm/store';

const Item = styled.ul<Theme & { selected?: boolean }>`
  cursor: pointer;
  margin: 0;
  padding: 0;

  &:hover {
    background-color: ${(props) => props['palette.hoverColor']};
  }

  background-color: ${(props) =>
    props.selected ? props['palette.selectedColor'] : props['palette.backgroundColor']};
`;

interface SelectPaletteItemProps {
  selected?: boolean;
  command: string;
  onSelect: () => void;
}

const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  const { theme } = useStore(settingsStore);

  return (
    <Item {...theme} onClick={props.onSelect} role="listitem" selected={props.selected}>
      {props.command}
    </Item>
  );
};

export { SelectPaletteItem };
