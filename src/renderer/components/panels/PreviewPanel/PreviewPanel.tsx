import React, { useRef, useState, useEffect } from 'react';
import './style.css';
import { DefaultPanel } from '../DefaultPanel';
import { useFocus } from '@fm/hooks';
import { HOHandlers } from 'renderer/components/common/HOHandlers';
import { FileInfo, IDirectoryManager } from '@fm/common';
import { extname } from 'path';
import { ignoredExtentions, imageExtentions } from './fileExtentions';
import { includes } from 'lodash';
import MonacoEditor from 'react-monaco-editor';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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

  let container = null;

  if (props.item) {
    const extention = extname(props.item.name);

    if (!includes(ignoredExtentions, extention)) {
      if (includes(imageExtentions, extention)) {
        container = (
          <TransformWrapper
            options={{
              minScale: 0.5,
              limitToBounds: false,
            }}
          >
            <TransformComponent>
              <div style={{ width: props.width, height: '100vh' }}>
                <img
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  alt={props.item.name}
                  src={props.item.path + props.item.name}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        );
      } else {
        container = (
          <MonacoEditor
            value={props.direcoryManager.readFileSync(props.item.path + props.item.name)}
            options={{
              readOnly: true,
            }}
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
