import React, { PropsWithChildren } from 'react';
import './style.css';

interface DefaultPanelProps {
  splitable?: boolean;
  onSplit?: () => void;
  onHide?: () => void;
  onFocus: () => void;
}

const DefaultPanel = (props: PropsWithChildren<DefaultPanelProps>) => {
  return (
    <div className="default-panel" onFocus={props.onFocus}>
      <div className="default-panel__header">
        {props.splitable && <button onClick={props.onSplit}>Split</button>}
        <button onClick={props.onHide}>Hide</button>
      </div>
      <div className="default-panel__content">{props.children}</div>
    </div>
  );
};

export { DefaultPanel, DefaultPanelProps };
