import React from 'react';
import { SplitType } from '../splitType';

interface ResizerProps {
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
  index: number;
  type: SplitType;
}

const Resizer = (props: ResizerProps) => {
  const classes = ['split-panels_resizer'];
  if (props.type === 'horizontal') {
    classes.push('split-panels_resizer--horizontal');
  }

  return (
    <div
      className={classes.join(' ')}
      onMouseDown={(event) => props.onMouseDown && props.onMouseDown(event, props.index)}
    />
  );
};

export { Resizer, ResizerProps };
