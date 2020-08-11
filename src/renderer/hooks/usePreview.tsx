import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
import { noop } from 'lodash';
import { FileInfo } from '@fm/common';
import { useSettings } from './useSettings';

const PreviewContext = createContext<{
  item: FileInfo | null;
  setItem: (path: FileInfo) => void;
  hidden: boolean;
  toggleHidden: () => void;
}>({
  item: null,
  setItem: noop,
  hidden: true,
  toggleHidden: noop,
});

const PreviewProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [item, setItem] = useState<FileInfo | null>(null);
  const { settings, setValue } = useSettings();
  const [hidden, setHidden] = useState<boolean>(settings?.layout?.preview.hidden ?? true);

  const toggleHidden = () => {
    const currentState = settings?.layout?.preview.hidden;
    console.log('toggleHidden -> currentState', currentState);

    setValue('layout.preview.hidden', !currentState);
    setHidden(!currentState);
  };

  return (
    <PreviewContext.Provider
      value={{
        item,
        setItem,
        hidden: hidden,
        toggleHidden: toggleHidden,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

const usePreview = () => useContext(PreviewContext);

export { PreviewProvider, usePreview };
