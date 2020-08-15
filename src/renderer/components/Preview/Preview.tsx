import React, { useState } from 'react';
import { useDirectoryManager } from '@fm/hooks';
import { includes, clamp } from 'lodash';
import { ignoredExtensions, imageExtensions } from './fileExtensions';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { extname } from 'path';
import { HotKeysWrapper } from '@fm/components';
import { useStore } from 'effector-react';
import { useStoreState } from 'renderer/store/store';
import styled from 'styled-components';
import { ImagePreview } from './ImagePreview';
import { TextPreview } from './TextPreview';
import { EmptyPreview } from './EmptyPreview';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: auto;
`;

interface PreviewProps {
  width?: number;
}

const Preview = (props: PreviewProps) => {
  const {
    preview: { item },
  } = useStoreState();

  if (item) {
    const extension = extname(item.name);

    if (!includes(ignoredExtensions, extension)) {
      if (includes(imageExtensions, extension)) {
        return (
          <Container>
            <ImagePreview item={item} />
          </Container>
        );
      } else {
        return (
          <Container>
            <TextPreview item={item} />
          </Container>
        );
      }
    } else {
      return (
        <Container>
          <EmptyPreview text="Cannot display" />
        </Container>
      );
    }
  } else {
    return (
      <Container>
        <EmptyPreview text="Empty" />
      </Container>
    );
  }
};

export { Preview };
