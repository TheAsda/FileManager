import React from 'react';
import { HotKeys, HotKeysProps } from 'react-hotkeys';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const HotKeysWrapper = (props: HotKeysProps) => <HotKeys {...props} component={Container} />;

export { HotKeysWrapper };
