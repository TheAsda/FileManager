import React, { useState, useEffect } from 'react';
import { usePreview, useCommands, useHotKeys } from '@fm/hooks';
import './style.css';
import { includes, merge } from 'lodash';
import { ignoredExtentions, imageExtentions } from './fileExtentions';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import MonacoEditor from 'react-monaco-editor';
import { extname } from 'path';
import { IDirectoryManager } from '@fm/common';
import { HOHandlers } from '@fm/components';

interface PreviewProps extends HOHandlers {
  width?: number;
  directoryManager: IDirectoryManager;
  focused?: boolean;
}

const Preview = (props: PreviewProps) => {
  const { data } = usePreview();
  const [focused, setFocused] = useState<boolean>(false);
  const { dispatch: commandsAction } = useCommands();
  const { dispatch: keysAction } = useHotKeys();

  useEffect(() => {
    if (!focused && props.focused) {
      onFocus();
      setFocused(true);
    } else if (focused && !props.focused) {
      setFocused(false);
    }
  }, [props.focused]);

  const onFocus = () => {
    keysAction({
      type: 'setHotKeys',
      hotkeys: merge({}, props.hotkeys),
    });

    commandsAction({
      type: 'empty',
    });

    commandsAction({
      type: 'add',
      items: merge({}, props.commands),
    });
  };

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
                  alt={data.item.name}
                  src={data.item.path + data.item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        );
      } else {
        return (
          <MonacoEditor
            height="100%"
            options={{
              readOnly: true,
            }}
            value={props.directoryManager.readFileSync(data.item.path + data.item.name)}
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
