import React, { useState, KeyboardEvent } from 'react';
import { useView } from '@fm/hooks';
import { Reader } from '@fm/explorer';
import { DetailView } from './DetailView';

const Window = () => {
  const { view, setDetailsView, setFolderView } = useView();

  const reader = new Reader('D:/FileManagerTest/');

  const dirState = reader.getCurrentDir();

  return (
    <div className="window">
      {view === 'detail' ? <DetailView data={dirState} /> : null}
    </div>
  );
};

export { Window };
