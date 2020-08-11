import { ipcMain } from 'electron';
import { Channels } from '../common/Channels';
import { forEach } from 'lodash';
import { IPathStore } from './interfaces/IPathStore';
import { PathStore } from './PathStore';

class ThemesManager {
  pathStore: IPathStore;

  constructor() {
    this.pathStore = new PathStore();

    ipcMain.on(Channels.GET_PATH, (event) => {
      event.reply(Channels.PATH, this.pathStore.getPaths());
    });

    ipcMain.on(Channels.ADD_PATH, (event, args: string[]) => {
      forEach(args, (item) => {
        this.pathStore.addToPath(item);
      });

      event.reply(Channels.PATH, this.pathStore.getPaths());
    });
  }
}

export { ThemesManager };
