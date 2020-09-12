import React, { useEffect } from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { Preview } from '@fm/components';
import { registerGroup } from '@fm/store/focusStore';

interface PreviewPanelProps {
  onHide?: () => void;
  width?: number;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  useEffect(() => {
    registerGroup('preview');
  }, []);

  return (
    <DefaultPanel onHide={props.onHide} splitable={false}>
      <Preview />
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
