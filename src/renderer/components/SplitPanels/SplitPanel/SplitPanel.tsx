import React, { PropsWithChildren } from 'react';
import { SplitType } from '../splitType';

interface SplitPanelProps {
  type: SplitType;
  size: number;
}

const SplitPanel = (props: PropsWithChildren<SplitPanelProps>) => {
  let style;

  if (props.type === 'horizontal') {
    style = { height: `${props.size}px` };
  } else {
    style = { width: `${props.size}px` };
  }

  return (
    <div className="split-panels__panel" style={style}>
      {props.children}
    </div>
  );
};

export { SplitPanel, SplitPanelProps };
