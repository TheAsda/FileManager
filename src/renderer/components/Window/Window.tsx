import React from 'react';
import { SplitPanels } from '../SplitPanels';
import './style.css';

const Window = () => {
  return (
    <div className="window">
      <SplitPanels
        panels={{ split: 'vertical', allowResize: true, minSize: '50%' }}
      />
    </div>
  );
};

export { Window };
