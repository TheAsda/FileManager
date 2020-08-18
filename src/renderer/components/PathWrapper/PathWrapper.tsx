import React, { PropsWithChildren } from 'react';
import { PathWrapperHeader } from './PathWrapperHeader';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

const Container = styled.div<Theme>`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 25px calc(100% - 25px);
  grid-template-columns: 100%;
  background-color: ${(props) => props['explorer.backgroundColor']};
  color: ${(props) => props['explorer.textColor']};
`;

interface PathWrapperProps {
  path: string;
  closable?: boolean;
  onClose?: () => void;
}

const PathWrapper = (props: PropsWithChildren<PathWrapperProps>) => {
  const { theme } = useTheme();

  return (
    <Container {...theme}>
      <PathWrapperHeader closable={props.closable} onClose={props.onClose} path={props.path} />
      {props.children}
    </Container>
  );
};

export { PathWrapper, PathWrapperProps };
