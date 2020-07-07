import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';

interface PreviewPanelProps {
  onHide?: () => void;
  path?: string | null;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { data: focus, dispatch: focusAction } = useFocus();

  const onFocus = () => {
    console.log('Focus Preview');

    if (focus.focusedPanel !== 'preview') {
      focusAction({ type: 'focusPanel', item: 'preview' });
    }
  };

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      <div></div>
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
