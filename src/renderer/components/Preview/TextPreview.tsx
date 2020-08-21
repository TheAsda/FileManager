import React, { useState } from 'react';
import { useDirectoryManager, useTheme } from '@fm/hooks';
import { clamp } from 'lodash';
import { FileInfo, Theme } from '@fm/common';
import styled from 'styled-components';
import { HotKeysWrapper } from '../common';

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
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState<number>(theme['preview.fontSize']);

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

  const text = directoryManager.readFileSync(props.item.path + props.item.name);

  return (
    <HotKeysWrapper handlers={hotkeys}>
      <Text {...theme} fontSize={fontSize}>
        {text}
      </Text>
    </HotKeysWrapper>
  );
};

export { TextPreview, TextPreviewProps };
