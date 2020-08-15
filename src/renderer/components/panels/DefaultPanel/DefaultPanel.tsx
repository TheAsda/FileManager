import React, { PropsWithChildren, forwardRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 25px calc(100% - 25px);
`;

interface DefaultPanelProps {
  splitable?: boolean;
  onSplit?: () => void;
  onHide?: () => void;
}

const DefaultPanel = forwardRef<HTMLDivElement, PropsWithChildren<DefaultPanelProps>>(
  (props, ref) => {
    return (
      <Container ref={ref}>
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
