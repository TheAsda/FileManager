import { render } from '@testing-library/react';
import React from 'react';

import { DetailViewItem } from '../DetailViewItem';

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    sendSync: jest.fn().mockImplementation(() => {
      return {
        close: ['key1'],
        moveDown: ['key2'],
        moveUp: ['key3'],
        activate: ['key4'],
        complete: ['key5'],
      };
    }),
  },
}));

describe('Detail view item', () => {
  it('should always display name', () => {
    const container = render(<DetailViewItem name="test" />);

    expect(container.getByText(/test/)).toBeVisible();
  });

  it('should display given date', () => {
    const date = new Date();
    const container = render(<DetailViewItem created={date} name="test" />);

    expect(container.getByText(new RegExp(date.getFullYear().toString()))).toBeVisible();
  });

  it('should display given size', () => {
    const container = render(<DetailViewItem name="test" size={155} />);

    expect(container.getByText(/15/)).toBeVisible();
  });

  it('should not display icon if showIcon is false', () => {
    const container = render(<DetailViewItem name="test" showIcon={false} />);

    expect(container.queryAllByAltText(/icon/)).toHaveLength(0);
  });
});
