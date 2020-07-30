import { useReducer } from 'react';

interface SetFolderView {
  type: 'folder';
}

interface SetDetailView {
  type: 'detail';
}

type Action = SetFolderView | SetDetailView;

const viewReducer = (state: string, action: Action) => {
  switch (action.type) {
    case 'detail':
      return 'detail';
    case 'folder':
      return 'folder';
  }
};

const useView = () => {
  const [state, dispatch] = useReducer(viewReducer, 'detail');

  const setDetailsView = () => dispatch({ type: 'detail' });
  const setFolderView = () => dispatch({ type: 'folder' });

  return { setDetailsView, setFolderView, view: state };
};

export { useView };
