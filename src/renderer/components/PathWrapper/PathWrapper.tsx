import React, { PropsWithChildren } from 'react';
import { PathWrapperHeader } from './PathWrapperHeader';
import './style.css';

interface PathWrapperProps {
  path: string;
  closable?: boolean;
  onClose?: () => void;
}

const PathWrapper = (props: PropsWithChildren<PathWrapperProps>) => {
  return (
    <div className="path-wrapper">
      <PathWrapperHeader closable={props.closable} onClose={props.onClose} path={props.path} />
      {props.children}
    </div>
  );
};

export { PathWrapper, PathWrapperProps };
