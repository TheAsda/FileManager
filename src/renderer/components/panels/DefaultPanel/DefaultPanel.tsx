import React, { PropsWithChildren, forwardRef } from 'react';
import styled from 'styled-components';
import { Theme } from '@fm/common';
import { useTheme } from '@fm/hooks';

const Container = styled.div<Theme>`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 25px calc(100% - 25px);
  background-color: ${(props) => props['explorer.backgroundColor']};
`;

const Header = styled.div``;

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

const Context = styled.div``;

interface DefaultPanelProps {
  splitable?: boolean;
  onSplit?: () => void;
  onHide?: () => void;
}

const DefaultPanel = forwardRef<HTMLDivElement, PropsWithChildren<DefaultPanelProps>>(
  (props, ref) => {
    const { theme } = useTheme();

    return (
      <Container {...theme} ref={ref}>
        <Header>
          {props.splitable && (
            <Button {...theme} onClick={props.onSplit}>
              Split
            </Button>
          )}
          <Button {...theme} onClick={props.onHide}>
            Hide
          </Button>
        </Header>
        <Context>{props.children}</Context>
      </Container>
    );
  }
);

export { DefaultPanel, DefaultPanelProps };
