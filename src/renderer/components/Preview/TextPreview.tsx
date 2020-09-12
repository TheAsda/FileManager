import React, { useEffect, useRef, useState } from 'react';
import { useDirectoryManager } from '@fm/hooks';
import { clamp } from 'lodash';
import { FileInfo, Theme } from '@fm/common';
import styled from 'styled-components';
import { KeymapWrapper, settingsStore } from '@fm/store';
import { useStore } from 'effector-react';
import { addElement } from '@fm/store/focusStore';
import { useActivateScope } from '@fm/store/keymapStore';

const Text = styled.pre<Theme & { fontSize: number }>`
  background-color: ${(props) => props['preview.backgroundColor']};
  color: ${(props) => props['preview.textColor']};
  font-family: ${(props) => props['preview.fontFamily']};
  font-size: ${(props) => props.fontSize}px;
  height: 100%;
  width: 100%;
  overflow: auto;
`;

interface TextPreviewProps {
  item: FileInfo;
}

const TextPreview = (props: TextPreviewProps) => {
  const { directoryManager } = useDirectoryManager();
  const { theme } = useStore(settingsStore);
  const [fontSize, setFontSize] = useState<number>(theme['preview.fontSize']);
  const ref = useRef<HTMLPreElement>(null);
  const { activate } = useActivateScope();

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
    if (ref.current) {
      addElement({
        element: ref.current,
        group: 'preview',
        onFocus: () => activate('textPreview'),
      });
    }
  }, []);

  const text = directoryManager.readFileSync(props.item.path + props.item.name);

  return (
    <KeymapWrapper handlers={hotkeys} scope="textPreview">
      <Text {...theme} fontSize={fontSize} ref={ref}>
        {text}
      </Text>
    </KeymapWrapper>
  );
};

export { TextPreview, TextPreviewProps };
