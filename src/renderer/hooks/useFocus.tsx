import React, { createContext, useContext, PropsWithChildren, useEffect, useState } from 'react';
import { PanelType, ISettingsManager } from '@fm/common';
import { noop } from 'lodash';
import { useHotKeys } from './useHotKeys';

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

const FocusProvider = ({
  children,
  settingsManager,
}: PropsWithChildren<{
  settingsManager: ISettingsManager;
}>) => {
  const { setGlobalHotKeys } = useHotKeys();

  const [focusedPanel, setFocusedPanel] = useState<PanelType>('explorer');
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const togglePanel = () => {
    if (focusedPanel === 'explorer') {
      if (!settingsManager.getSettings().layout.preview.hidden) {
        setFocusedPanel('preview');
        return;
      }
      if (!settingsManager.getSettings().layout.terminals.hidden) {
        setFocusedPanel('terminal');
        return;
      }
    }
    if (focusedPanel === 'preview') {
      if (!settingsManager.getSettings().layout.terminals.hidden) {
        setFocusedPanel('terminal');
        return;
      }
      if (!settingsManager.getSettings().layout.explorers.hidden) {
        setFocusedPanel('explorer');
        return;
      }
    }
    if (focusedPanel === 'terminal') {
      if (!settingsManager.getSettings().layout.explorers.hidden) {
        setFocusedPanel('explorer');
        return;
      }
      if (!settingsManager.getSettings().layout.preview.hidden) {
        setFocusedPanel('preview');
        return;
      }
    }
  };

  const toggleIndex = () => {
    setFocusedIndex((state) => state ^ 1);
  };

  const focusPanel = (panel: PanelType) => {
    setFocusedPanel(panel);
  };

  const focusIndex = (index: number) => {
    setFocusedIndex(index);
  };

  useEffect(() => {
    setGlobalHotKeys({
      toggleFocusPanel: togglePanel,
      toggleFocusItem: toggleIndex,
    });
  }, []);

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
      {children}
    </FocusContext.Provider>
  );
};

const useFocus = () => useContext(FocusContext);

export { FocusProvider, useFocus };
