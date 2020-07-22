import React, { PropsWithChildren, forwardRef } from 'react';
import './style.css';

interface DefaultPanelProps {
  splitable?: boolean;
  onSplit?: () => void;
  onHide?: () => void;
  onFocus?: () => void;
}

const DefaultPanel = forwardRef<HTMLDivElement, PropsWithChildren<DefaultPanelProps>>(
  (props, ref) => {
    return (
      <div className="default-panel" onClick={props.onFocus} ref={ref}>
        <div className="default-panel__header">
          {props.splitable && <button onClick={props.onSplit}>Split</button>}
          <button onClick={props.onHide}>Hide</button>
        </div>
        <div className="default-panel__content">{props.children}</div>
      </div>
    );
  }
);

export { DefaultPanel, DefaultPanelProps };
