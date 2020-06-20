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
   * @param type generated id
   */
  registerNewPanel(type: PanelType): number;

  /**
   * Unregisters panel with specified id and returns boolean operation status
   *
   * @param id the id of panel to remove
   */
  unregisterPanel(id: number): boolean;

  getLayout(): Layout;

  checkPanel(type: PanelType): boolean;
}

export { IPanelsManager };
