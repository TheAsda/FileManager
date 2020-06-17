import { Layout, Panel, PanelType } from '@fm/common';

interface IPanelsManager {
  /**
   * Returns info about panel with specified id
   *
   * @param id the id of panel
   */
  getPanel(id: number): Panel | null;

  /**
   * Registrates new panel or throws error if there are no empty slots
   *
   * @param type the type of panel to spawn
   */
  registerNewPanel(type: PanelType, initialDirectory?: string): Panel;

  /**
   * Unregisters panel with specified id and returns boolean operation status
   *
   * @param id the id of panel to remove
   */
  unregisterPanel(id: number): boolean;

  /* Layout with registered panels */
  layout: Layout;
}

export { IPanelsManager };
