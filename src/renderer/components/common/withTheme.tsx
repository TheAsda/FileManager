import React, { ComponentType } from 'react';
import { Theme } from '@fm/common/interfaces/Theme';
import { settingsStore } from '@fm/store/settingsStore';
import { useStore } from 'effector-react';

interface ThemeProp {
  theme: Theme;
}

function withTheme<T extends ThemeProp>(
  Component: ComponentType<T>
): ComponentType<Omit<T, keyof ThemeProp>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { theme } = useStore(settingsStore);
    return <Component {...props} theme={theme} />;
  };
}

export { withTheme, ThemeProp };
