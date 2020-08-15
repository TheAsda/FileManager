import React from 'react';
import styled from 'styled-components';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { FileInfo } from '@fm/common';

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
        <div
          style={{
            // width: props.width,
            height: '100vh',
          }}
        >
          <img
            alt={props.item.name}
            src={props.item.path + props.item.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};

export { ImagePreview, ImagePreviewProps };
