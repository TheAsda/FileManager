import React, { useState } from 'react';
import { useDirectoryManager } from '@fm/hooks';
import { clamp } from 'lodash';
import { HotKeys } from 'react-hotkeys';
import { FileInfo } from '@fm/common';

interface TextPreviewProps {
  item: FileInfo;
}

const TextPreview = (props: TextPreviewProps) => {
  const { directoryManager } = useDirectoryManager();
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

  const text = directoryManager.readFileSync(props.item.path + props.item.name);

  return (
    <HotKeys handlers={hotkeys}>
      <pre style={{ fontSize: fontSize }}>{text}</pre>
    </HotKeys>
  );
};

export { TextPreview, TextPreviewProps };
