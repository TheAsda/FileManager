import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { Commands, KeyMap } from '@fm/common/interfaces';
import { createEffect, createEvent, createStore } from 'effector';
import {
  find,
  get,
  includes,
  isEmpty,
  isFunction,
  merge,
  pickBy,
  reduce,
  set,
  split,
  toPairs,
} from 'lodash';
import { registerIpc, sendIpc } from './ipc';
import { debug } from 'electron-log';
import { DEFAULT_KEYMAP } from '@fm/common/settings/keyMap';
import { Channels } from '@fm/common/Channels';

interface RecursiveScope {
  [name: string]: RecursiveScope | (() => void);
}

type Scope = RecursiveScope | Commands;

interface KeymapStore {
  keymap: KeyMap;
  handlers: Scope;
  activeScope: string;
}

const initialState: KeymapStore = {
  keymap: DEFAULT_KEYMAP,
  handlers: {},
  activeScope: '',
};

const keymapStore = createStore<KeymapStore>(initialState);

const fetchKeymap = createEffect({
  handler: () => {
    return sendIpc<KeyMap>(Channels.GET_KEYMAP);
  },
});

keymapStore.on(fetchKeymap.doneData, (state, value) => {
  if (isEmpty(value)) {
    return state;
  }

  return {
    ...state,
    keymap: merge(state.keymap, value),
  };
});

fetchKeymap();

const setScope = createEvent<{ scopePath: string; handlers?: Commands }>();
keymapStore.on(setScope, (state, value) => {
  const newHandlers = set({}, value.scopePath, value.handlers);

  debug(newHandlers);

  return {
    ...state,
    activeScope: state.activeScope.length === 0 ? value.scopePath : state.activeScope,
    handlers: merge(state.handlers, newHandlers),
  };
});

const activateScope = createEvent<string>();
keymapStore.on(activateScope, (state, value) => {
  return {
    ...state,
    activeScope: value,
  };
});

const ScopeContext = createContext<string | null>(null);

interface KeymapWrapperProps {
  scope: string;
  handlers?: Commands;
}

const KeymapWrapper = (props: PropsWithChildren<KeymapWrapperProps>) => {
  const scope = useContext(ScopeContext);

  const newScope = scope ? scope + '.' + props.scope : props.scope;

  useEffect(() => {
    setScope({
      scopePath: newScope,
      handlers: props.handlers,
    });
  }, [newScope, props.handlers]);

  return <ScopeContext.Provider value={newScope}>{props.children}</ScopeContext.Provider>;
};

const getHandlersFromScope = (state: Scope, scopePath: string): Commands => {
  let result: Commands = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = reduce(
    split(scopePath, '.'),
    (acc, cur) => {
      acc += cur;
      const scopeHandlers = get(state, acc);
      result = merge(result, pickBy(scopeHandlers, isFunction));
      return acc;
    },
    ''
  );

  return result;
};

registerIpc(Channels.KEYPRESS, (event, shortcut: string) => {
  const state = keymapStore.getState();

  const handlers = getHandlersFromScope(state.handlers, state.activeScope);

  const key = find(toPairs(state.keymap), (item) => includes(item[1], shortcut));

  if (!key) {
    return;
  }

  handlers[key[0]]();
});

export { keymapStore, KeymapWrapper, KeymapWrapperProps, activateScope };
