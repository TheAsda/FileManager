import React from 'react';
import { Explorer, Terminal } from '../panels';
import './style.css';

const Window = () => {
  return (
    <div className="window">
      <Explorer />
    </div>
  );
};

export { Window };
