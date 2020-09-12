import React from 'react';
import { render } from '@testing-library/react';
import { createEvent } from 'effector';
import { createElement } from 'react';
import { focusStore, registerGroup, addElement, toggleElement, toggleGroup } from '../focusStore';
import { forEach } from 'lodash';

describe('focusStore', () => {
  const reset = createEvent();
  focusStore.reset(reset);

  beforeEach(() => {
    reset();
  });

  it('should register group', () => {
    registerGroup('test');

    expect(focusStore.getState().activeGroup).toEqual('test');
    expect(focusStore.getState().groups).toEqual({ test: [] });
  });

  it('should add element', () => {
    registerGroup('test');

    const { container } = render(<div />);

    addElement({
      group: 'test',
      element: container,
    });

    expect(focusStore.getState().groups).toEqual({ test: [container] });
  });

  it('should do nothing if group does not exist', () => {
    registerGroup('test');

    const { container } = render(<div />);

    addElement({
      group: 'another',
      element: container,
    });

    expect(focusStore.getState().groups).toEqual({ test: [] });
  });

  it('should not add if group exists', () => {
    registerGroup('test1');
    registerGroup('test2');

    const { container } = render(<div />);

    addElement({
      group: 'test1',
      element: container,
    });

    expect(focusStore.getState().groups).toEqual({ test1: [container], test2: [] });

    registerGroup('test1');

    expect(focusStore.getState().groups).toEqual({ test1: [container], test2: [] });
  });

  it('should toggle groups', () => {
    const groups = ['test1', 'test2', 'test3'];

    forEach(groups, (g) => {
      registerGroup(g);
      const { container } = render(<div />);
      addElement({ group: g, element: container });
    });

    toggleGroup();

    expect(focusStore.getState().activeGroup).toEqual('test2');

    toggleGroup();

    expect(focusStore.getState().activeGroup).toEqual('test3');

    toggleGroup();

    expect(focusStore.getState().activeGroup).toEqual('test1');
  });

  it('should toggle elements', () => {
    registerGroup('test');
    const { getAllByText } = render(
      <ul>
        <li>test</li>
        <li>test</li>
        <li>test</li>
      </ul>
    );

    const elements = getAllByText(/test/);

    forEach(elements, (e) => {
      addElement({
        element: e,
        group: 'test',
      });
    });

    toggleElement();

    expect(focusStore.getState().activeElementIndex).toBe(1);

    toggleElement();

    expect(focusStore.getState().activeElementIndex).toBe(2);

    toggleElement();

    expect(focusStore.getState().activeElementIndex).toBe(0);
  });
});
