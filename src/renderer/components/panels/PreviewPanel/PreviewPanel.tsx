import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';
import { HOHandlers, Preview } from '@fm/components';

interface PreviewPanelProps extends HOHandlers {
  onHide?: () => void;
  width?: number;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { focus, focusPanel } = useFocus();

  const onFocus = () => {
    focusPanel('preview');
  };

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      <Preview focused={focus.panel === 'preview'} width={props.width} />
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
