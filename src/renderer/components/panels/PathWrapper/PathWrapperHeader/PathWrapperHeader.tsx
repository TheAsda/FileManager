import React from 'react';

interface DefaultPanelHeaderProps {
  closable?: boolean;
  path: string;
  onClose?: () => void;
}

const PathWrapperHeader = (props: DefaultPanelHeaderProps) => {
  return (
    <div className="path-wrapper__header">
      <div className="path-wrapper__path">{props.path}</div>
      {props.closable && <div className="path-wrapper__close">Close</div>}
    </div>
  );
};

export { PathWrapperHeader };
