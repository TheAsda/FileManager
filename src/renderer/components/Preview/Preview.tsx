import React from 'react';
import { useManagers } from '@fm/hooks';

interface PreviewProps {
  path?: string;
}

const Preview = (props: PreviewProps) => {
  const { directoryManager } = useManagers();
  return (
    <div style={{ width: '300px' }}>{props.path && directoryManager.readFileSync(props.path)}</div>
  );
};

export { Preview };
