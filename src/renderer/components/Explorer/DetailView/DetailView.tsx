import { FileInfo } from '@fm/common/interfaces/FileInfo';
import { styled } from '@fm/components/common/styled';
import { map } from 'lodash';
import React, { forwardRef } from 'react';

import { DetailViewItem, Item, Row } from './DetailViewItem';

const Container = styled('div', ({ $theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'left',
  padding: '0 0 0.5rem',
  display: 'flex',
  flexFlow: 'column nowrap',
  backgroundColor: $theme['explorer.backgroundColor'],
}));

// const Container = styled.div<Theme>`
//   width: 100%;
//   height: 100%;
//   text-align: left;
//   padding: 0 0.5rem;
//   display: flex;
//   flex-flow: column nowrap;
//   background-color: ${(props) => props['explorer.backgroundColor']};
// `;

const Header = styled('div', {
  display: 'flex',
  flexFlow: 'column nowrap',
  fontWeight: 'bold',
});

// const Header = styled.div`
//   display: flex;
//   flex-flow: column nowrap;
//   font-weight: bold;
// `;

const Body = styled('div', {
  flex: 1,
  display: 'flex',
  flexFlow: 'column nowrap',
  overflow: 'auto',
});

// const Body = styled.div`
//   flex: 1;
//   display: flex;
//   flex-flow: column nowrap;
//   overflow: auto;
// `;

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

const DetailView = forwardRef<HTMLDivElement, DetailViewProps>((props, ref) => {
  return (
    <Container>
      <Header>
        <Row noninteractive>
          <Item>Name</Item>
          <Item>Size</Item>
          <Item>Creation Date</Item>
        </Row>
      </Header>
      <Body ref={ref}>
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
});

export { DetailView };
