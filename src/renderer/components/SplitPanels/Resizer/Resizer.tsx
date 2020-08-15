import React from 'react';
import { SplitType } from '../splitType';
import styled from 'styled-components';

const ResizerStyled = styled.div<{ type: SplitType }>`
  --size: 4px;
  width: ${(props) => (props.type === 'horizontal' ? '100%' : 'var(--size)')};
  height: ${(props) => (props.type === 'horizontal' ? 'var(--size)' : '100%')};
  cursor: ${(props) => (props.type === 'horizontal' ? 'row-resize' : 'col-resize')};
  background-color: black;
`;

interface ResizerProps {
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
  index: number;
  type: SplitType;
}

const Resizer = (props: ResizerProps) => {
  return (
    <ResizerStyled
      onMouseDown={(event) => props.onMouseDown && props.onMouseDown(event, props.index)}
      type={props.type}
    />
  );
};

export { Resizer, ResizerProps };
