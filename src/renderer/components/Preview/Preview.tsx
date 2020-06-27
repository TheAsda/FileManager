import React from 'react';
import { useManagers } from '@fm/hooks';
import './style.css';

interface PreviewProps {
  path?: string;
  toggle?: () => void;
  onClose?: () => void;
}

const Preview = (props: PreviewProps) => {
  const { directoryManager } = useManagers();

  return (
    <div className="preview">
      <div className="preview__header">
        <button className="preview__button">Hide</button>
        <button className="preview__button">Split</button>
      </div>
      <div className="preview__content">
        {props.path && directoryManager.readFileSync(props.path)}
      </div>
    </div>
  );
};

export { Preview };
