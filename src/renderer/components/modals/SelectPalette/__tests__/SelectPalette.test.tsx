/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_THEME } from '@fm/common';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ipcRenderer } from 'electron';
import { map, times } from 'lodash';
import React from 'react';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { mocked } from 'ts-jest/utils';

import { SelectPalette } from '../SelectPalette';

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

describe('Select palette', () => {
  window.scroll = jest.fn();

  const props = {
    onClose: jest.fn(),
    onSelect: jest.fn<void, [string]>(),
  };

  const options = ['option1', 'option2', 'option3'];

  beforeEach(() => {
    props.onClose.mockClear();
    props.onSelect.mockClear();
  });

  describe('rendering', () => {
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
  });

  describe('options', () => {
    it('should render items with options and first item selected', () => {
      const container = render(<SelectPalette {...props} isOpened={true} options={options} />, {
        wrapper: ({ children }) => <Provider value={new Client()}>{children}</Provider>,
      });

      expect(container.getAllByRole('listitem')).toHaveLength(options.length);
      const renderedOptions = container.getAllByRole('listitem');
      const renderedOptionsContext = map(renderedOptions, 'textContent');
      expect(renderedOptionsContext).toEqual(options);
      expect(renderedOptions[0]).toHaveStyle(
        `background-color: ${DEFAULT_THEME['palette.selectedColor']}`
      );
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

    it('should show all options if none of them matches input', () => {
      const container = render(<SelectPalette {...props} isOpened={true} options={options} />);

      const input = container.getByRole('search');
      userEvent.type(input, 'absolutely random input');

      expect(container.getAllByRole('listitem')).toHaveLength(options.length);
    });

    it('should call onSelect on click with option', () => {
      const container = render(<SelectPalette {...props} isOpened={true} options={options} />);

      const option = container.getByText(/option1/);

      userEvent.click(option);

      expect(props.onSelect).toHaveBeenCalledTimes(1);
      expect(props.onSelect.mock.calls[0][0]).toEqual('option1');
    });
  });

  describe('keys', () => {
    it('should select next option on moveDown', () => {
      const container = render(
        <Provider value={new Client()}>
          <SelectPalette {...props} isOpened={true} options={options} />
        </Provider>
      );

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      const renderedOptions = container.getAllByRole('listitem');
      times(options.length, (i) => {
        expect(renderedOptions[i]).toHaveStyle(
          `background-color: ${DEFAULT_THEME['palette.selectedColor']}`
        );
        keypressHandler(fakeEvent, 'key2');
      });

      expect(renderedOptions[options.length - 1]).toHaveStyle(
        `background-color: ${DEFAULT_THEME['palette.selectedColor']}`
      );
    });

    it('should select previous option on moveUp', () => {
      const container = render(
        <Provider value={new Client()}>
          <SelectPalette {...props} isOpened={true} options={options} />
        </Provider>
      );

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      times(options.length, () => {
        keypressHandler(fakeEvent, 'key2');
      });

      const renderedOptions = container.getAllByRole('listitem');
      times(options.length, (i) => {
        expect(renderedOptions[options.length - i - 1]).toHaveStyle(
          `background-color: ${DEFAULT_THEME['palette.selectedColor']}`
        );
        keypressHandler(fakeEvent, 'key3');
      });

      expect(renderedOptions[0]).toHaveStyle(
        `background-color: ${DEFAULT_THEME['palette.selectedColor']}`
      );
    });

    it('should close on close key', () => {
      render(
        <Provider value={new Client()}>
          <SelectPalette {...props} isOpened={true} options={options} />
        </Provider>
      );

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      keypressHandler(fakeEvent, 'key1');

      expect(props.onClose).toBeCalledTimes(1);
    });

    it('should call onSelect item on activate key', () => {
      render(<SelectPalette {...props} isOpened={true} options={options} />);

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      keypressHandler(fakeEvent, 'key4');

      expect(props.onSelect).toHaveBeenCalledTimes(1);
      expect(props.onSelect.mock.calls[0][0]).toEqual(options[0]);
    });

    it('should call onSelect item on activate key after moveDown', () => {
      render(<SelectPalette {...props} isOpened={true} options={options} />);

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      keypressHandler(fakeEvent, 'key2');
      keypressHandler(fakeEvent, 'key4');

      expect(props.onSelect).toHaveBeenCalledTimes(1);
      expect(props.onSelect.mock.calls[0][0]).toEqual(options[1]);
    });

    it('should update options on input', () => {
      const container = render(
        <SelectPalette {...props} isOpened={true} options={[...options, 'different value']} />
      );

      const input = container.getByRole('search') as HTMLInputElement;
      userEvent.type(input, 'different');

      const mockedOn = mocked(ipcRenderer.on);

      expect(mockedOn).toHaveBeenCalledTimes(1);

      const keypressHandler = mockedOn.mock.calls[0][1];
      const fakeEvent: any = undefined;

      keypressHandler(fakeEvent, 'key5');

      expect(input.value).toEqual('different value');
    });
  });
});
