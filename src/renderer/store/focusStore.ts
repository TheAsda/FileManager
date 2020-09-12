import { createEvent, createStore } from 'effector';
import { warn } from 'electron-log';
import { findIndex, keys } from 'lodash';

interface GroupElement {
  element: HTMLElement;
  onFocus?: () => void;
}

interface FocusGroups {
  [name: string]: GroupElement[];
}

interface FocusStore {
  activeGroup: string;
  activeElementIndex: number;
  groups: FocusGroups;
}

const focusStore = createStore<FocusStore>({ groups: {}, activeElementIndex: 0, activeGroup: '' });

const registerGroup = createEvent<string>();
focusStore.on(registerGroup, (state, value) => {
  if (state.groups[value] !== undefined) {
    warn(`${value} group already exists`);
    return state;
  }

  return {
    ...state,
    groups: {
      ...state.groups,
      [value]: [],
    },
    activeGroup: state.activeGroup.length === 0 ? value : state.activeGroup,
  };
});

const addElement = createEvent<{
  group: string;
  element: HTMLElement;
  onFocus?: () => void;
}>();
focusStore.on(addElement, (state, value) => {
  if (!state.groups[value.group]) {
    warn(`${value.group} group does not exists`);
    return state;
  }

  return {
    ...state,
    groups: {
      ...state.groups,
      [value.group]: [
        ...state.groups[value.group],
        { element: value.element, onFocus: value.onFocus },
      ],
    },
  };
});

const toggleElement = createEvent();
focusStore.on(toggleElement, (state) => {
  const newIndex = (state.activeElementIndex + 1) % state.groups[state.activeGroup].length;

  const newElement = state.groups[state.activeGroup][newIndex];

  if (newElement) {
    newElement.element.focus();

    if (newElement.onFocus) {
      newElement.onFocus();
    }
  }

  return {
    ...state,
    activeElementIndex: newIndex,
  };
});

const toggleGroup = createEvent();
focusStore.on(toggleGroup, (state) => {
  const groupNames = keys(state.groups);

  const activeGroupIndex = findIndex(groupNames, (item) => item === state.activeGroup);
  const newGroupIndex = (activeGroupIndex + 1) % groupNames.length;

  const newGroupName = groupNames[newGroupIndex];

  const newGroupElement = state.groups[newGroupName][0];

  if (newGroupElement) {
    newGroupElement.element.focus();
    
    if (newGroupElement.onFocus) {
      newGroupElement.onFocus();
    }
  }

  return {
    ...state,
    activeElementIndex: 0,
    activeGroup: newGroupName,
  };
});

export { focusStore, toggleElement, toggleGroup, addElement, registerGroup };
