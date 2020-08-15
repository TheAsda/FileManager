import React from 'react';

interface EmptyPreviewProps {
  text: string;
}

const EmptyPreview = (props: EmptyPreviewProps) => {
  return <h1>{props.text}</h1>;
};

export { EmptyPreview, EmptyPreviewProps };
