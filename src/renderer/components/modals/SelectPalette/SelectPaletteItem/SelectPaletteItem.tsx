import React from 'react';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

const Item = styled.div<Theme & { selected?: boolean }>`
  cursor: pointer;
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
  const { theme } = useTheme();

  return (
    <Item {...theme} onClick={props.onSelect} selected={props.selected}>
      {props.command}
    </Item>
  );
};

export { SelectPaletteItem };
