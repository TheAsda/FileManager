import { FolderIcon } from '@fm/components/common/FolderIcon';
import { styled } from '@fm/components/common/styled';
import { KeymapWrapper } from '@fm/store/keymapStore';
import { merge } from 'lodash';
import { extname } from 'path';
import React, { useEffect, useRef } from 'react';
import { DefaultExtensionType, defaultStyles, FileIcon } from 'react-file-icon';
import { StyleObject, withStyleDeep } from 'styletron-react';

const Row = styled<'div', { selected?: boolean; noninteractive?: boolean }>(
  'div',
  ({ $theme, noninteractive, selected }) => {
    let interactiveStyles: StyleObject = {};

    if (!noninteractive) {
      interactiveStyles = {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: $theme['explorer.hoverColor'],
        },
      };
    }

    return merge(
      {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: selected
          ? $theme['explorer.selectedColor']
          : $theme['explorer.backgroundColor'],
      },
      interactiveStyles
    );
  }
);

const Item = styled('div', {
  width: '100%',
  height: '100%',
  alignItems: 'center',
  gap: '10px',
  margin: '5px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Name = withStyleDeep(Item, { display: 'flex', flexFlow: 'row nowrap' });

const Text = styled('div', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Icon = styled('div', ({ $theme }) => ({
  width: `${$theme['explorer.fontSize']}px`,
  height: `${$theme['explorer.fontSize']}px`,
}));

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
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (inputRef.current) {
      props.onEditEnd && props.onEditEnd(inputRef.current.value);
    }
  };

  const onEscape = () => {
    props.onEditEnd && props.onEditEnd(null);
  };

  useEffect(() => {
    if (props.selected && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [props.selected]);

  return (
    <Row
      data-testid="row"
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
      $ref={rowRef}
      selected={props.selected}
    >
      <Name>
        {props.editable ? (
          <KeymapWrapper
            handlers={{
              activate: onEnter,
              close: onEscape,
            }}
            scope="input"
          >
            <input data-testid="name-input" defaultValue={props.name} ref={inputRef} autoFocus />
          </KeymapWrapper>
        ) : (
          <>
            {props.showIcon !== false && (
              <Icon alt="icon">{getIcon(props.isFolder ?? false, props.name)}</Icon>
            )}
            <Text>{props.name}</Text>
          </>
        )}
      </Name>
      <Item>{props.size}</Item>
      <Item>{props.created?.toLocaleString()}</Item>
    </Row>
  );
};

export { DetailViewItem, Row, Item };
