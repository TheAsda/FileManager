import { registerIpc } from '../ipc';
import { IThemesStore } from '../interfaces/IThemesStore';
import { ThemesStore } from '../stores/ThemesStore';
import { Channels } from '../../common/Channels';
import { info } from 'electron-log';

let themesStore: IThemesStore;

const initThemesIpc = () => {
  info('Initialize themes ipc');
  themesStore = new ThemesStore();

  registerIpc(Channels.GET_THEME, (event, arg: string) => {
    themesStore.setThemeName(arg);

    event.returnValue = themesStore.getTheme();
  });

  registerIpc(Channels.RESET_THEME, (event) => {
    themesStore.resetTheme();

    event.returnValue = themesStore.getTheme();
  });

  registerIpc(Channels.OPEN_THEME, () => {
    themesStore.openInEditor();
  });
};

export { initThemesIpc };
