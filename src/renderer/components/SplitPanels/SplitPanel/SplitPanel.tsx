import React, { PropsWithChildren } from 'react';
import { SplitType } from '../splitType';
import styled from 'styled-components';

const Panel = styled.div<{ size: number; type: SplitType }>`
  position: relative;
  height: ${(props) => (props.type === 'horizontal' ? `${props.size}px` : '100%')};
  width: ${(props) => (props.type === 'horizontal' ? '100%' : `${props.size}px`)};
`;

interface SplitPanelProps {
  type: SplitType;
  size: number;
}

const SplitPanel = (props: PropsWithChildren<SplitPanelProps>) => {
  return (
    <Panel size={props.size} type={props.type}>
      {props.children}
    </Panel>
  );
};

export { SplitPanel, SplitPanelProps };
