import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { noop } from 'lodash';
import { FileInfo, ISettingsManager } from '@fm/common';
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

interface PreviewProviderProps {
  settingsManager: ISettingsManager;
}

const PreviewProvider = ({
  children,
  settingsManager,
}: PropsWithChildren<PreviewProviderProps>) => {
  const [item, setItem] = useState<FileInfo | null>(null);
  const { settings } = useSettings();
  const [hidden, setHidden] = useState<boolean>(settings?.layout?.preview.hidden ?? true);

  const toggleHidden = () => {
    const currentState = settings?.layout?.preview.hidden;
    console.log('toggleHidden -> currentState', currentState);

    settingsManager.setSettings('layout.preview.hidden', !currentState);
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
