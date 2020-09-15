/* eslint-disable @typescript-eslint/no-explicit-any */
import { Theme } from '@fm/common';
import { settingsStore } from '@fm/store/settingsStore';
import { useStore } from 'effector-react';
import React, { FC } from 'react';
import { createStyled, StyleObject, StyletronComponent } from 'styletron-react';
import { driver, getInitialStyle } from 'styletron-standard';

interface IStyledFnWithTheme {
  <
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    P extends Record<string, unknown>
  >(
    component: C,
    style: (props: P & { $theme: Theme }) => StyleObject
  ): StyletronComponent<
    Pick<
      React.ComponentProps<C>,
      Exclude<keyof React.ComponentProps<C>, { className: string; $theme: Theme }>
    > &
      P
  >;
  <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(
    component: C,
    style: StyleObject
  ): StyletronComponent<
    Pick<React.ComponentProps<C>, Exclude<keyof React.ComponentProps<C>, { className: string }>>
  >;
}

const wrapper = (StyledComponent: FC<any>) => {
  const withThemeHOC = <T extends { $theme: Theme }>(props: T) => {
    const { theme } = useStore(settingsStore);

    return <StyledComponent {...props} $theme={theme} />;
  };

  return withThemeHOC;
};

const styled: IStyledFnWithTheme = createStyled({
  wrapper,
  driver,
  getInitialStyle,
});

export { styled };
