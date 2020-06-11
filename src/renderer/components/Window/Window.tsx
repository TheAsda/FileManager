import React, { useState } from 'react';
import { SplitPanels } from '../SplitPanels';
import './style.css';
import { useManagers } from '@fm/hooks';
import { PanelsEditor } from '../PanelsEditor';

const Window = () => {
  const { panelsManager } = useManagers();
  const [showEditor, setShowEditor] = useState<boolean>(true);

  const panels = panelsManager.getPanelsList();

  return (
    <div className="window">
      {showEditor ? <PanelsEditor onClose={() => setShowEditor(false)} /> : <SplitPanels panels={panels} />}
    </div>
  );
};

export { Window };
