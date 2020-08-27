import React from 'react';
import { includes } from 'lodash';
import { ignoredExtensions, imageExtensions } from './fileExtensions';
import { extname } from 'path';
import { previewStore } from '@fm/store';
import { useStore } from 'effector-react';
import styled from 'styled-components';
import { ImagePreview } from './ImagePreview';
import { TextPreview } from './TextPreview';
import { EmptyPreview } from './EmptyPreview';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
`;

interface PreviewProps {
  width?: number;
}

const Preview = (props: PreviewProps) => {
  const store = useStore(previewStore);

  if (store.file) {
    const extension = extname(store.file.name);

    if (!includes(ignoredExtensions, extension)) {
      if (includes(imageExtensions, extension)) {
        return (
          <Container>
            <ImagePreview item={store.file} />
          </Container>
        );
      } else {
        return (
          <Container>
            <TextPreview item={store.file} />
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
