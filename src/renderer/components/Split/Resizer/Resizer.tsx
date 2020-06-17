import React from 'react';

interface ResizerProps {
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
  // onMouseUp?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void;
  index: number;
}

const Resizer = (props: ResizerProps) => {
  return (
    <div
      onMouseDown={(event) => props.onMouseDown && props.onMouseDown(event, props.index)}
      // onMouseUp={(event) => props.onMouseUp && props.onMouseUp(event, props.index)}
      className="split-panels_resizer"
    ></div>
  );
};

export { Resizer, ResizerProps };
