import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import { FileInfo, IDirectoryManager } from '@fm/common';
import { Preview } from 'renderer/components/Preview';

interface PreviewPanelProps extends HOHandlers {
  onHide?: () => void;
  item?: FileInfo | null;
  direcoryManager: IDirectoryManager;
  width?: number;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { dispatch: focusAction } = useFocus();

  const onFocus = () => {
    focusAction({ type: 'focusPanel', item: 'preview' });
  };

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      <Preview directoryManager={props.direcoryManager} width={props.width} />
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
