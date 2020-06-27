import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';

interface PreviewPanelProps {
  onHide?: () => void;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  return (
    <DefaultPanel onHide={props.onHide} splitable={false}>
      <div></div>
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
