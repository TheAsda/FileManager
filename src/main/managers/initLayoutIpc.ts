import { ILayoutStore } from '../interfaces/ILayoutStore';
import { LayoutStore } from '../stores/LayoutStore';
import { Channels } from '../../common/Channels';
import { Layout } from '../../common/interfaces/Layout';
import { registerIpc } from '../ipc';

let layoutStore: ILayoutStore;

const initLayoutIpc = () => {
  layoutStore = new LayoutStore();

  registerIpc(Channels.GET_LAYOUT, (event) => {
    event.returnValue = layoutStore.get();
  });

  registerIpc<Layout>(Channels.SAVE_LAYOUT, (event, layout) => {
    layoutStore.save(layout);
  });
};

export { initLayoutIpc, layoutStore };
