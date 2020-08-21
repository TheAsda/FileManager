import React from 'react';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

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

const Button = styled.button<Theme>`
  border: none;
  padding: 5px 10px;
  height: 100%;
  background-color: ${(props) => props['primary.backgroundColor']};
  color: ${(props) => props['primary.textColor']};

  &:hover {
    background-color: ${(props) => props['primary.hoverColor']};
  }
`;

interface DefaultPanelHeaderProps {
  closable?: boolean;
  refreshable?: boolean;
  path: string;
  onClose?: () => void;
  onRefresh?: () => void;
}

const PathWrapperHeader = (props: DefaultPanelHeaderProps) => {
  const { theme } = useTheme();
  return (
    <Header>
      <Path>{props.path}</Path>
      {props.closable && (
        <Button {...theme} onClick={props.onClose}>
          Close
        </Button>
      )}
      {props.refreshable && (
        <Button {...theme} onClick={props.onRefresh}>
          Refresh
        </Button>
      )}
    </Header>
  );
};

export { PathWrapperHeader };
