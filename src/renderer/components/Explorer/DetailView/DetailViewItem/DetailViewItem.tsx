import React, { useEffect, useRef } from 'react';
import { extname } from 'path';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { FolderIcon } from '@fm/components';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

const Row = styled.div<Theme & { selected?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 50% 20% 30%;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.selected ? props['explorer.selectedColor'] : props['explorer.backgroundColor']};

  &:hover {
    background-color: ${(props) => props['explorer.hoverColor']};
  }
`;

const Item = styled.div<Theme>`
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: grid;
  grid-template-columns: ${(props) =>
    `${props['explorer.fontSize']}px calc(100% - ${props['explorer.fontSize']}px)`};
  grid-template-rows: 100%;
  align-items: center;
  gap: 10px;
  margin: 5px;
`;

const Icon = styled.div<Theme>`
  width: ${(props) => props['explorer.fontSize']};
  height: ${(props) => props['explorer.fontSize']};
`;

interface DetailViewItemProps {
  name: string;
  size?: number;
  created?: Date;
  isFolder?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  editable?: boolean;
  onEditEnd?: (name: string | null) => void;
  showIcon?: boolean;
}

const getIcon = (isFolder: boolean, file: string) => {
  if (isFolder) {
    return <FolderIcon />;
  }

  const ext = extname(file).slice(1);

  return <FileIcon {...defaultStyles[ext as DefaultExtensionType]} extension={ext} />;
};

const DetailViewItem = (props: DetailViewItemProps) => {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!theme) {
    return null;
  }

  const handleKeyboard = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && inputRef.current) {
      props.onEditEnd && props.onEditEnd(inputRef.current.value);
    }

    if (event.key === 'Escape') {
      props.onEditEnd && props.onEditEnd(null);
    }
  };

  useEffect(() => {
    if (props.editable) {
      document.addEventListener('keydown', handleKeyboard);
      return () => {
        document.removeEventListener('keydown', handleKeyboard);
      };
    } else {
      document.removeEventListener('keydown', handleKeyboard);
    }
  }, [props.editable]);

  return (
    <Row
      {...theme}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      ref={(ref) =>
        props.selected &&
        ref?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
      selected={props.selected}
    >
      <Item {...theme}>
        {props.editable ? (
          <input defaultValue={props.name} ref={inputRef} autoFocus />
        ) : (
          <>
            {props.showIcon !== false && (
              <Icon {...theme}>{getIcon(props.isFolder ?? false, props.name)}</Icon>
            )}
            {props.name}
          </>
        )}
      </Item>
      <Item {...theme}>{props.size}</Item>
      <Item {...theme}>{props.created?.toLocaleString()}</Item>
    </Row>
  );
};

export { DetailViewItem, Row, Item };
