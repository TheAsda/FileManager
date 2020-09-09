import React from 'react';
import { SelectPalette } from '../SelectPalette';
import { render } from '@testing-library/react';
import { DEFAULT_THEME } from '@fm/common';

describe('Select palette', () => {
  const props = {
    onClose: jest.fn(),
    onSelect: jest.fn(),
    theme: DEFAULT_THEME,
  };

  it('should be hidden if prop isOpened is false', () => {
    const container = render(<SelectPalette {...props} isOpened={false} options={[]} />);

    expect(container.getByRole('dialog')).not.toBeVisible();
  });
});
