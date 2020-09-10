import React from 'react';
import styled from 'styled-components';
import { Theme } from '@fm/common/interfaces/Theme';
import { ThemeProp, withTheme } from '@fm/components/common/withTheme';

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

interface SelectPaletteItemProps extends ThemeProp {
  selected?: boolean;
  command: string;
  onSelect: () => void;
}

const SelectPaletteItem = (props: SelectPaletteItemProps) => {
  return (
    <Item {...props.theme} onClick={props.onSelect} role="listitem" selected={props.selected}>
      {props.command}
    </Item>
  );
};

const ThemedSelectPaletteItem = withTheme(SelectPaletteItem);

export { ThemedSelectPaletteItem as SelectPaletteItem, SelectPaletteItemProps };
