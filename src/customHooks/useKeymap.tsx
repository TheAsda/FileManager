import React, { createContext, useContext, useState, useEffect } from 'react';
import { reset, bind } from 'mousetrap';

interface KeyBinding {
  key: string;
  Action: () => void;
}

const KeymapContext = createContext<{
  keymap: KeyBinding[];
  setKeybinding: (binding: KeyBinding) => void;
  unsetKeybinding: (key: string) => void;
}>({
  keymap: [],
  setKeybinding: () => {},
  unsetKeybinding: () => {},
});

const useKeymap = () => useContext(KeymapContext);

const KeymapProvider = ({ children }: { children: any }) => {
  const [keymap, setKeymap] = useState<KeyBinding[]>([]);
  const setKeybinding = (binding: KeyBinding) => {
    setKeymap([...keymap, binding]);
  };
  const unsetKeybinding = (key: string) => {
    setKeymap(keymap.filter((item) => item.key !== key));
  };
  useEffect(() => {
    reset();
    keymap.forEach((item) => bind(item.key, item.Action));
  }, [keymap]);

  return (
    <KeymapContext.Provider
      value={{
        keymap,
        setKeybinding,
        unsetKeybinding,
      }}
    >
      {children}
    </KeymapContext.Provider>
  );
};

export { useKeymap, KeymapProvider, KeyBinding };
