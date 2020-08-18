import React, { useEffect, useState, useCallback } from 'react';
import { InputModal } from '../InputModal';
import { fileActionStore, FileActionStore, fileActionApi } from 'renderer/store';
import { useDirectoryManager } from '@fm/hooks';

const FileModal = () => {
  const { directoryManager } = useDirectoryManager();
  const [state, setState] = useState<FileActionStore>({
    display: false,
  });
  const [title, setTitle] = useState<string>();

  const close = () => {
    fileActionApi.deactivate();
  };

  const onAccept = useCallback(
    (destinationPath: string) => {
      if (state.info) {
        if (state.info.type === 'copy') {
          directoryManager.copyItems(state.info.files, destinationPath);
        } else {
          directoryManager.moveItems(state.info.files, destinationPath);
        }
      }
      close();
    },
    [state.display]
  );

  useEffect(
    () =>
      fileActionStore.watch((state) => {
        if (state.info) {
          if (state.info.type == 'copy') {
            setTitle('Copy file');
          } else {
            setTitle('Move file');
          }
        }
        setState(state);
      }),
    []
  );

  return (
    <InputModal
      initialValue={state.info?.destinationPath}
      isOpened={state.display}
      onAccept={onAccept}
      onClose={close}
      title={title}
    />
  );
};

export { FileModal };
