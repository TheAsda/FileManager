import React from 'react';
import { includes } from 'lodash';
import { ignoredExtensions, imageExtensions } from './fileExtensions';
import { extname } from 'path';
import { store } from 'renderer/store/application/store';
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
  const {
    preview: { item },
  } = useStore(store);

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
