import React from 'react';
import styled from 'styled-components';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FileInfo } from '@fm/common';
import './transformStyle.css';

const Container = styled.div`
  height: 100vh;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface ImagePreviewProps {
  item: FileInfo;
}

const ImagePreview = (props: ImagePreviewProps) => {
  return (
    <TransformWrapper
      options={{
        minScale: 0.5,
        limitToBounds: false,
      }}
    >
      <TransformComponent>
        <Container>
          <Image alt={props.item.name} src={props.item.path + props.item.name} />
        </Container>
      </TransformComponent>
    </TransformWrapper>
  );
};

export { ImagePreview, ImagePreviewProps };
