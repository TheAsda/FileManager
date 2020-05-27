import React, { createContext, useContext, useState, useEffect } from 'react';
import { reset, bind } from 'mousetrap';
import { unionBy } from 'lodash';

interface KeyBinding {
  key: string;
  Action: (e: ExtendedKeyboardEvent, combo: string) => void;
}

const KeymapContext = createContext<{
  keymap: KeyBinding[];
  setKeybindings: (bindings: KeyBinding[]) => void;
  unsetKeybindings: (keys: string[]) => void;
}>({
  keymap: [],
  setKeybindings: () => {},
  unsetKeybindings: () => {},
});

const useKeymap = () => useContext(KeymapContext);

const KeymapProvider = ({ children }: { children: any }) => {
  const [keymap, setKeymap] = useState<KeyBinding[]>([]);
  const setKeybindings = (bindings: KeyBinding[]) => {
    setKeymap(unionBy(bindings, keymap, 'key'));
  };
  const unsetKeybindings = (keys: string[]) => {
    setKeymap(keymap.filter((item) => !keys.includes(item.key)));
  };
  useEffect(() => {
    console.log(
      'Keymap: ',
      keymap.reduce((acc, cur) => acc + cur.key + ', ', '')
    );
    reset();
    keymap.forEach((item) => bind(item.key, item.Action));
  }, [keymap]);

  return (
    <KeymapContext.Provider
      value={{
        keymap,
        setKeybindings,
        unsetKeybindings,
      }}
    >
      {children}
    </KeymapContext.Provider>
  );
};

export { useKeymap, KeymapProvider, KeyBinding };
