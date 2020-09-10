import React from 'react';
import { SelectPalette } from '../SelectPalette';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { map } from 'lodash';

describe('Select palette', () => {
  window.scroll = jest.fn();

  const props = {
    onClose: jest.fn(),
    onSelect: jest.fn<void, [string]>(),
  };

  const options = ['option1', 'option2', 'option3'];

  it('should be hidden when prop isOpened is false', () => {
    const container = render(<SelectPalette {...props} isOpened={false} options={[]} />);

    expect(container.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should be visible when prop isOpened is true', async () => {
    const container = render(<SelectPalette {...props} isOpened={true} options={[]} />);

    expect(await container.findByRole('dialog')).toBeVisible();
  });

  it('should toggle visibility on isOpened change', async () => {
    const container = render(<SelectPalette {...props} isOpened={false} options={[]} />);
    expect(container.queryByRole('dialog')).not.toBeInTheDocument();

    container.rerender(<SelectPalette {...props} isOpened={true} options={[]} />);
    expect(await container.findByRole('dialog')).toBeVisible();

    container.rerender(<SelectPalette {...props} isOpened={false} options={[]} />);
    fireEvent.animationEnd(await container.findByRole('dialog'));

    expect(container.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render items with options', () => {
    const container = render(<SelectPalette {...props} isOpened={true} options={options} />);

    expect(container.getAllByRole('listitem')).toHaveLength(options.length);

    const renderedOptions = map(container.getAllByRole('listitem'), 'textContent');

    expect(renderedOptions).toEqual(options);
  });

  it('should update rendered options on options change', () => {
    const container = render(<SelectPalette {...props} isOpened={true} options={options} />);

    container.rerender(
      <SelectPalette {...props} isOpened={true} options={[...options, 'another option']} />
    );

    expect(container.getAllByRole('listitem')).toHaveLength(options.length + 1);

    const renderedOptions = map(container.getAllByRole('listitem'), 'textContent');
    expect(renderedOptions).toEqual([...options, 'another option']);
  });

  it('should update options on input', () => {
    const container = render(
      <SelectPalette {...props} isOpened={true} options={[...options, 'different value']} />
    );

    const input = container.getByRole('search');
    userEvent.type(input, 'different value');

    expect(container.getAllByRole('listitem')).toHaveLength(1);
    expect(container.getAllByRole('listitem')[0].textContent).toEqual('different value');
  });

  it('should call onSelect on click with option', () => {
    const container = render(<SelectPalette {...props} isOpened={true} options={options} />);

    const option = container.getByText(/option1/);

    userEvent.click(option);

    expect(props.onSelect).toHaveBeenCalledTimes(1);
    expect(props.onSelect.mock.calls[0][0]).toEqual('option1');
  });
});
