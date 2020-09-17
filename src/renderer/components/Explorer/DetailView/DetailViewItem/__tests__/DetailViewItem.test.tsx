/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_THEME } from '@fm/common';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ipcRenderer } from 'electron';
import React, { PropsWithChildren } from 'react';
import { Client } from 'styletron-engine-atomic';
import { Provider } from 'styletron-react';
import { mocked } from 'ts-jest/utils';

import { DetailViewItem } from '../DetailViewItem';

jest.mock('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    sendSync: jest.fn().mockImplementation(() => {
      return {
        close: ['key1'],
        activate: ['key2'],
      };
    }),
  },
}));

describe('Detail view item', () => {
  const wrapper = ({ children }: PropsWithChildren<unknown>) => (
    <Provider value={new Client()}>{children}</Provider>
  );

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

  it('should change color if selected', () => {
    const container = render(<DetailViewItem name="test" selected />, {
      wrapper,
    });

    expect(container.getByTestId('row')).toHaveStyle(
      `background-color: ${DEFAULT_THEME['explorer.selectedColor']}`
    );
  });

  it('should display folder icon if isFolder is true', () => {
    const container = render(<DetailViewItem name="test" isFolder />);

    expect(container.getByTestId('folder-icon')).toBeVisible();
  });

  it('should render input if editable is true', () => {
    const container = render(<DetailViewItem name="test" editable />);

    expect(container.getByTestId('name-input')).toBeVisible();
  });

  it('should call onEditEnd with input value on active key', () => {
    const mockedOnEdit = jest.fn<void, (string | null)[]>();
    const inputText = 'different';
    const container = render(<DetailViewItem name="test" onEditEnd={mockedOnEdit} editable />);

    const input = container.getByTestId('name-input') as HTMLInputElement;
    userEvent.clear(input);
    userEvent.type(input, inputText);

    expect(input.value).toEqual(inputText);

    const mockedOn = mocked(ipcRenderer.on);

    expect(mockedOn).toHaveBeenCalledTimes(1);

    const keypressHandler = mockedOn.mock.calls[0][1];
    const fakeEvent: any = undefined;

    keypressHandler(fakeEvent, 'key2');

    expect(mockedOnEdit).toBeCalledTimes(1);
    expect(mockedOnEdit.mock.calls[0][0]).toEqual(inputText);
  });

  it('should call onEditEnd with null on close key', () => {
    const mockedOnEdit = jest.fn<void, (string | null)[]>();
    const inputText = 'different';
    const container = render(<DetailViewItem name="test" onEditEnd={mockedOnEdit} editable />);

    const input = container.getByTestId('name-input') as HTMLInputElement;
    userEvent.clear(input);
    userEvent.type(input, inputText);

    expect(input.value).toEqual(inputText);

    const mockedOn = mocked(ipcRenderer.on);

    expect(mockedOn).toHaveBeenCalledTimes(1);

    const keypressHandler = mockedOn.mock.calls[0][1];
    const fakeEvent: any = undefined;

    keypressHandler(fakeEvent, 'key1');

    expect(mockedOnEdit).toBeCalledTimes(1);
    expect(mockedOnEdit.mock.calls[0][0]).toEqual(null);
  });
});
