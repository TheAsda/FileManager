import React, { forwardRef } from 'react';
import { includes } from 'lodash';
import { ignoredExtensions, imageExtensions } from './fileExtensions';
import { extname } from 'path';
import { previewStore } from '@fm/store';
import { useStore } from 'effector-react';
import styled from 'styled-components';
import { ImagePreview } from './ImagePreview';
import { TextPreview } from './TextPreview';
import { EmptyPreview } from './EmptyPreview';
import { PathWrapper } from '../PathWrapper';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
`;

const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const store = useStore(previewStore);

  if (store.file) {
    const extension = extname(store.file.name);

    if (!includes(ignoredExtensions, extension)) {
      if (includes(imageExtensions, extension)) {
        return (
          <Container ref={ref}>
            <PathWrapper path={store.file.path + store.file.name}>
              <ImagePreview item={store.file} />
            </PathWrapper>
          </Container>
        );
      } else {
        return (
          <Container ref={ref}>
            <PathWrapper path={store.file.path + store.file.name}>
              <TextPreview item={store.file} />
            </PathWrapper>
          </Container>
        );
      }
    } else {
      return (
        <Container ref={ref}>
          <EmptyPreview text="Cannot display" />
        </Container>
      );
    }
  } else {
    return (
      <Container ref={ref}>
        <EmptyPreview text="Empty" />
      </Container>
    );
  }
});

export { Preview };
