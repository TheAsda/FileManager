import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const Path = styled.div`
  white-space: nowrap;
  overflow: auto;
  margin: 0 0.5rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Button = styled.button`
  border: none;
  padding: 5px 10px;
  height: 100%;
`;

interface DefaultPanelHeaderProps {
  closable?: boolean;
  path: string;
  onClose?: () => void;
}

const PathWrapperHeader = (props: DefaultPanelHeaderProps) => {
  return (
    <Header>
      <Path>{props.path}</Path>
      {props.closable && <Button onClick={props.onClose}>Close</Button>}
    </Header>
  );
};

export { PathWrapperHeader };
