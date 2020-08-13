import React from 'react';
import { HotKeys, HotKeysProps } from 'react-hotkeys';

const HotKeysWrapper = (props: HotKeysProps) => (
  <HotKeys {...props} style={{ width: '100%', height: '100%' }} />
);

export { HotKeysWrapper };
