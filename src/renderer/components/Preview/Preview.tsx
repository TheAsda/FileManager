import React, { useState } from 'react';
import { useManagers } from '@fm/hooks';
import './style.css';
import { includes, clamp } from 'lodash';
import { ignoredExtensions, imageExtensions } from './fileExtensions';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { extname } from 'path';
import { HOHandlers, HotKeysWrapper } from '@fm/components';
import { useStore } from 'effector-react';
import { useStoreState } from 'renderer/Store';

interface PreviewProps extends HOHandlers {
  width?: number;
  focused?: boolean;
}

const Preview = (props: PreviewProps) => {
  const {
    preview: { item },
  } = useStoreState();
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

  if (item) {
    const extension = extname(item.name);

    if (!includes(ignoredExtensions, extension)) {
      if (includes(imageExtensions, extension)) {
        return (
          <HotKeysWrapper handlers={hotkeys}>
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
          </HotKeysWrapper>
        );
      } else {
        const text = directoryManager.readFileSync(item.path + item.name);

        return (
          <HotKeysWrapper handlers={hotkeys}>
            <div className="preview" style={{ fontSize }}>
              <pre>{text}</pre>
            </div>
          </HotKeysWrapper>
        );
      }
    } else {
      return (
        <HotKeysWrapper handlers={hotkeys}>
          <div className="preview">
            <h1>Cannot display</h1>
          </div>
        </HotKeysWrapper>
      );
    }
  } else {
    return (
      <HotKeysWrapper handlers={hotkeys}>
        <div className="preview">
          <h1>Empty</h1>
        </div>
      </HotKeysWrapper>
    );
  }
};

export { Preview };
