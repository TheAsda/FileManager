import React, { PropsWithChildren } from 'react';
import { PathWrapperHeader } from './PathWrapperHeader';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 25px calc(100% - 25px);
  grid-template-columns: 100%;
`;

interface PathWrapperProps {
  path: string;
  closable?: boolean;
  onClose?: () => void;
}

const PathWrapper = (props: PropsWithChildren<PathWrapperProps>) => {
  return (
    <Container>
      <PathWrapperHeader closable={props.closable} onClose={props.onClose} path={props.path} />
      {props.children}
    </Container>
  );
};

export { PathWrapper, PathWrapperProps };
