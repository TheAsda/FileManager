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
        <div className="default-panel__header">
          {props.splitable && <button onClick={props.onSplit}>Split</button>}
          <button onClick={props.onHide}>Hide</button>
        </div>
        <div className="default-panel__content">{props.children}</div>
      </Container>
    );
  }
);

export { DefaultPanel, DefaultPanelProps };
