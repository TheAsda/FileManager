import React from 'react';
import { useManagers, usePreview } from '@fm/hooks';
import './style.css';
import { includes } from 'lodash';
import { ignoredExtentions, imageExtentions } from './fileExtentions';
import { container } from 'common/ioc';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import MonacoEditor from 'react-monaco-editor';
import { extname } from 'path';
import { IDirectoryManager } from '@fm/common';

interface PreviewProps {
  width?: number;
  directoryManager: IDirectoryManager;
}

const Preview = (props: PreviewProps) => {
  const { data } = usePreview();

  if (data.item) {
    const extention = extname(data.item.name);

    if (!includes(ignoredExtentions, extention)) {
      if (includes(imageExtentions, extention)) {
        return (
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
                  alt={data.item.name}
                  src={data.item.path + data.item.name}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        );
      } else {
        return (
          <MonacoEditor
            value={props.directoryManager.readFileSync(data.item.path + data.item.name)}
            options={{
              readOnly: true,
            }}
            height="100%"
            width="100%"
          ></MonacoEditor>
        );
      }
    } else {
      return (
        <div>
          <h1>Cannot display</h1>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h1>Empty</h1>
      </div>
    );
  }
};

export { Preview };
