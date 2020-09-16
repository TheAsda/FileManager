import React from 'react';
import { HotKeys, HotKeysProps } from 'react-hotkeys';
import { styled } from './styled';

const Container = styled('div', {
  width: '100%',
  height: '100%',
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const HotKeysWrapper = (props: HotKeysProps) => <HotKeys {...props} component={Container} />;

export { HotKeysWrapper };
