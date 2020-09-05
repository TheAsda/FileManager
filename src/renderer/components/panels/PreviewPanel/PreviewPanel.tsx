import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { Preview } from '@fm/components';

interface PreviewPanelProps {
  onHide?: () => void;
  width?: number;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  return (
    <DefaultPanel onHide={props.onHide} splitable={false}>
      <Preview />
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
