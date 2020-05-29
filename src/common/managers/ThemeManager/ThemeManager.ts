import { injectable } from 'inversify';
import { Theme } from '@fm/common';

@injectable()
class ThemeManger {
  private Themes: Theme[];

  constructor() {
    this.Themes = themes;
  }


}
