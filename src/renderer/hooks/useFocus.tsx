import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
import { PanelType } from '@fm/common';
import { noop } from 'lodash';
import { useSettings } from './useSettings';
import { HotKeysWrapper } from '@fm/components';

const FocusContext = createContext<{
  togglePanel: () => void;
  toggleIndex: () => void;
  focusIndex: (index: number) => void;
  focusPanel: (panel: PanelType) => void;
  focus: {
    panel: PanelType;
    index: number;
  };
}>({
  focus: {
    index: 0,
    panel: 'explorer',
  },
  toggleIndex: noop,
  togglePanel: noop,
  focusIndex: noop,
  focusPanel: noop,
});

const FocusProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { settings } = useSettings();

  const [focusedPanel, setFocusedPanel] = useState<PanelType>('explorer');
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const togglePanel = () => {
    console.log('togglePanel');
    if (focusedPanel === 'explorer') {
      if (!settings?.layout?.preview.hidden) {
        setFocusedPanel('preview');
        return;
      }
      if (!settings?.layout?.terminals.hidden) {
        setFocusedPanel('terminal');
        return;
      }
    }
    if (focusedPanel === 'preview') {
      if (!settings?.layout?.terminals.hidden) {
        setFocusedPanel('terminal');
        return;
      }
      if (!settings?.layout?.explorers.hidden) {
        setFocusedPanel('explorer');
        return;
      }
    }
    if (focusedPanel === 'terminal') {
      if (!settings?.layout?.explorers.hidden) {
        setFocusedPanel('explorer');
        return;
      }
      if (!settings?.layout?.preview.hidden) {
        setFocusedPanel('preview');
        return;
      }
    }
  };

  const toggleIndex = () => {
    console.log('toggleIndex');
    setFocusedIndex((state) => state ^ 1);
  };

  const focusPanel = (panel: PanelType) => {
    setFocusedPanel(panel);
  };

  const focusIndex = (index: number) => {
    setFocusedIndex(index);
  };

  return (
    <FocusContext.Provider
      value={{
        focus: {
          index: focusedIndex,
          panel: focusedPanel,
        },
        toggleIndex,
        togglePanel,
        focusIndex,
        focusPanel,
      }}
    >
      <HotKeysWrapper
        handlers={{
          toggleFocusPanel: togglePanel,
          toggleFocusIndex: toggleIndex,
        }}
      >
        {children}
      </HotKeysWrapper>
    </FocusContext.Provider>
  );
};

const useFocus = () => useContext(FocusContext);

export { FocusProvider, useFocus };
