import { ILayoutStore } from '../interfaces/ILayoutStore';
import { LayoutStore } from '../stores/LayoutStore';
import { ipcMain } from 'electron';
import { Channels } from '../../common/Channels';
import { Layout } from '../../common/interfaces/Layout';

class LayoutManager {
  layoutStore: ILayoutStore;

  constructor() {
    this.layoutStore = new LayoutStore();

    ipcMain.on(Channels.GET_LAYOUT, (event) => {
      // event.reply(Channels.LAYOUT, this.layoutStore.get());
      event.returnValue = this.layoutStore.get();
    });

    ipcMain.on(Channels.SAVE_LAYOUT, (event, args: Layout) => {
      console.log('LayoutManager -> constructor -> args', args);
      this.layoutStore.save(args);

      event.reply(Channels.LAYOUT, this.layoutStore.get());
    });
  }
}

export { LayoutManager };
