import React, { PropsWithChildren, useEffect } from 'react';
import { Channels, Commands, DEFAULT_KEYMAP, KeyMap } from '@fm/common';
import { createEffect, createEvent, createStore } from 'effector';
import {
  find,
  get,
  includes,
  isEmpty,
  isFunction,
  merge,
  omitBy,
  reduce,
  set,
  split,
  toPairs,
} from 'lodash';
import { registerIpc, sendIpc } from './ipc';
import { debug } from 'electron-log';

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
  if (!isEmpty(value)) {
    return state;
  }

  return {
    ...state,
    keymap: merge(state.keymap, value),
  };
});

fetchKeymap();

const setScope = createEvent<{ scopePath: string; handlers: Commands }>();
keymapStore.on(setScope, (state, value) => {
  const newHandlers = set({}, value.scopePath, value.handlers);

  debug(newHandlers);

  return {
    ...state,
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

interface KeymapWrapperProps {
  scopePath: string;
  handlers: Commands;
}

const KeymapWrapper = (props: PropsWithChildren<KeymapWrapperProps>) => {
  useEffect(() => {
    setScope({
      scopePath: props.scopePath,
      handlers: props.handlers,
    });
  }, [props.scopePath, props.handlers]);

  return <>{props.children}</>;
};

const getHandlersFromScope = (state: Scope, scopePath: string): Commands => {
  let result: Commands = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = reduce(split(scopePath, '.'), (acc, cur) => {
    acc += cur;
    result = merge(
      result,
      omitBy(get(state.handlers, acc), (item) => !isFunction(item))
    );
    return acc;
  });

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
