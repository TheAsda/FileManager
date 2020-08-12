import React, { useState, useEffect } from 'react';
import { usePreview, useCommands, useManagers } from '@fm/hooks';
import './style.css';
import { includes, merge, clamp } from 'lodash';
import { ignoredExtentions, imageExtentions } from './fileExtentions';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { extname } from 'path';
import { HOHandlers } from '@fm/components';
import { HotKeys } from 'react-hotkeys';

interface PreviewProps extends HOHandlers {
  width?: number;
  focused?: boolean;
}

const Preview = (props: PreviewProps) => {
  const { item } = usePreview();
  const [focused, setFocused] = useState<boolean>(false);
  const { addCommands, emptyCommands } = useCommands();
  const { directoryManager } = useManagers();
  const [fontSize, setFontSize] = useState<number>(15);

  const increaseFontSize = () => {
    setFontSize((state) => clamp(state + 2, 10, 64));
  };

  const decreaseFontSize = () => {
    setFontSize((state) => clamp(state - 2, 10, 64));
  };

  const hotkeys = {
    zoomIn: increaseFontSize,
    zoomOut: decreaseFontSize,
  };

  useEffect(() => {
    if (!focused && props.focused) {
      onFocus();
      setFocused(true);
    } else if (focused && !props.focused) {
      setFocused(false);
    }
  }, [props.focused]);

  const onFocus = () => {
    // addHotKeys(merge(hotkeys, props.hotkeys));

    emptyCommands();

    addCommands(merge({}, props.commands));
  };

  if (item) {
    const extention = extname(item.name);

    if (!includes(ignoredExtentions, extention)) {
      if (includes(imageExtentions, extention)) {
        return (
          <HotKeys handlers={hotkeys}>
            <div className="preview">
              <TransformWrapper
                options={{
                  minScale: 0.5,
                  limitToBounds: false,
                }}
              >
                <TransformComponent>
                  <div style={{ width: props.width, height: '100vh' }}>
                    <img
                      alt={item.name}
                      src={item.path + item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>
          </HotKeys>
        );
      } else {
        const text = directoryManager.readFileSync(item.path + item.name);

        return (
          <HotKeys handlers={hotkeys}>
            <div className="preview" style={{ fontSize }}>
              <pre>{text}</pre>
            </div>
          </HotKeys>
        );
      }
    } else {
      return (
        <HotKeys handlers={hotkeys}>
          <div className="preview">
            <h1>Cannot display</h1>
          </div>
        </HotKeys>
      );
    }
  } else {
    return (
      <HotKeys handlers={hotkeys}>
        <div className="preview">
          <h1>Empty</h1>
        </div>
      </HotKeys>
    );
  }
};

export { Preview };
