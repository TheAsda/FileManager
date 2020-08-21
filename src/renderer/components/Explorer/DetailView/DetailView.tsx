import React from 'react';
import { FileInfo, Theme } from '@fm/common';
import { DetailViewItem, Row, Item } from './DetailViewItem';
import { map } from 'lodash';
import styled from 'styled-components';
import { useTheme } from '@fm/hooks';

const Container = styled.div<Theme>`
  width: 100%;
  height: 100%;
  text-align: left;
  padding: 0 0.5rem;
  display: flex;
  flex-flow: column nowrap;
  background-color: ${(props) => props['explorer.backgroundColor']};
`;

const Header = styled.div`
  display: flex;
  flex-flow: column nowrap;
  font-weight: bold;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  overflow: auto;
`;

interface DetailViewProps {
  data: FileInfo[];
  selectedIndex?: number;
  onItemClick?: (index: number) => void;
  onItemDoubleClick?: (index: number) => void;
  onExit?: () => void;
  canExit?: boolean;
  editableIndex?: number;
  onEditEnd?: (name: string | null) => void;
}

const DetailView = (props: DetailViewProps) => {
  const { theme } = useTheme();

  return (
    <Container {...theme}>
      <Header>
        <Row {...theme} noninteractive>
          <Item {...theme}>Name</Item>
          <Item {...theme}>Size</Item>
          <Item {...theme}>Creation Date</Item>
        </Row>
      </Header>
      <Body>
        {map(props.data, (item, i) => {
          return (
            <DetailViewItem
              created={item.created}
              editable={i === props.editableIndex}
              isFolder={item.attributes.directory}
              key={item.name}
              name={item.name}
              onClick={() => props.onItemClick && props.onItemClick(i)}
              onDoubleClick={() => props.onItemDoubleClick && props.onItemDoubleClick(i)}
              onEditEnd={props.onEditEnd}
              selected={i === props.selectedIndex}
              size={item.size}
            />
          );
        })}
      </Body>
    </Container>
  );
};

export { DetailView };
