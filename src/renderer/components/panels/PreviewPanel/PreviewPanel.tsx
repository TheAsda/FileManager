import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';

interface PreviewPanelProps {
  onHide?: () => void;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { dispatch: focusAction } = useFocus();

  return (
    <DefaultPanel
      onFocus={() => focusAction({ type: 'focusPanel', item: 'preview' })}
      onHide={props.onHide}
      splitable={false}
    >
      <div></div>
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
