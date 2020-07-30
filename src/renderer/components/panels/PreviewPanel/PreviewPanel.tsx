import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';
import { FileInfo } from '@fm/common';
import { HOHandlers, Preview } from '@fm/components';

interface PreviewPanelProps extends HOHandlers {
  onHide?: () => void;
  item?: FileInfo | null;
  width?: number;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { dispatch: focusAction, data: focus } = useFocus();

  const onFocus = () => {
    focusAction({ type: 'focusPanel', item: 'preview' });
  };

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      <Preview focused={focus.focusedPanel === 'preview'} width={props.width} />
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
