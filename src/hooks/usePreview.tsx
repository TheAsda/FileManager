import React, {
  Dispatch,
  createContext,
  useReducer,
  useContext,
  PropsWithChildren,
  useEffect,
} from 'react';
import { noop } from 'lodash';
import { PreviewPanelInfo, FileInfo } from '@fm/common';

type Action = { type: 'setPath'; item: FileInfo } | { type: 'toggle' };

interface ReducerState {
  item: FileInfo | null;
  display: boolean;
}

const previewReducer = (state: ReducerState, action: Action): ReducerState => {
  switch (action.type) {
    case 'toggle': {
      return {
        ...state,
        display: !state.display,
      };
    }
    case 'setPath': {
      return {
        display: true,
        item: action.item,
      };
    }
  }
};

const PreviewContext = createContext<{ data: ReducerState; dispatch: Dispatch<Action> }>({
  data: {
    display: false,
    item: null,
  },
  dispatch: noop,
});

interface PreviewProviderProps {
  initialState?: PreviewPanelInfo;
}

const PreviewProvider = ({ children, initialState }: PropsWithChildren<PreviewProviderProps>) => {
  const [data, dispatch] = useReducer(
    previewReducer,
    {
      item: null,
      display: false,
    },
    (): ReducerState => {
      return {
        display: initialState !== undefined,
        item: null,
      };
    }
  );

  return <PreviewContext.Provider value={{ data, dispatch }}>{children}</PreviewContext.Provider>;
};

const usePreview = () => useContext(PreviewContext);

export { PreviewProvider, usePreview };
