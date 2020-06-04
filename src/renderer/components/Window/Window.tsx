import React from 'react';
import { SplitPanels } from '../SplitPanels';
import './style.css';
import { useManagers } from '@fm/hooks';

const Window = () => {
  const { panelsManager } = useManagers();

  const panels = panelsManager.getPanelsList();

  return (
    <div className="window">
      <SplitPanels panels={panels} />
    </div>
  );
};

export { Window };
