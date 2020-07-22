import React from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import { FileInfo, IDirectoryManager } from '@fm/common';
import { extname } from 'path';
import { ignoredExtentions, imageExtentions } from './fileExtentions';
import { includes } from 'lodash';
import MonacoEditor from 'react-monaco-editor';

interface PreviewPanelProps extends HOHandlers {
  onHide?: () => void;
  item?: FileInfo | null;
  direcoryManager: IDirectoryManager;
}

const PreviewPanel = (props: PreviewPanelProps) => {
  const { dispatch: focusAction } = useFocus();

  const onFocus = () => {
    focusAction({ type: 'focusPanel', item: 'preview' });
  };

  let container = null;

  if (props.item) {
    const extention = extname(props.item.name);
    console.log(extention);

    if (!includes(ignoredExtentions, extention)) {
      if (includes(imageExtentions, extention)) {
        container = (
          <div>
            <img alt={props.item.name} src={props.item.path + props.item.name} />
          </div>
        );
      } else {
        container = (
          <MonacoEditor
            value={props.direcoryManager.readFileSync(props.item.path + props.item.name)}
            height="100%"
            width="100%"
          ></MonacoEditor>
        );
      }
    }
  }

  return (
    <DefaultPanel onFocus={onFocus} onHide={props.onHide} splitable={false}>
      {container}
    </DefaultPanel>
  );
};

export { PreviewPanel, PreviewPanelProps };
