import React from 'react';
import SplitPane, { SplitPaneProps } from 'react-split-pane';
import { Explorer } from '../panels';

interface SplitPanelsProps {
  panels: SplitPaneProps;
}

const SplitPanels = (props: SplitPanelsProps) => {
  return (
    <SplitPane {...props.panels}>
      <Explorer />
      <Explorer />
    </SplitPane>
  );
};

export { SplitPanels };
