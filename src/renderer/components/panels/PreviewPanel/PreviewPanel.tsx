import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';

interface PreviewPanelProps {
  onHide?: () => void;
  path?: string | null;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { dispatch: focusAction } = useFocus();

  const onFocus = () => {
    focusAction({ type: 'focusPanel', item: 'preview' });
  };

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      <div></div>
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
