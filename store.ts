import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

export interface State {
  image: Object
}

export interface Action {
  type: string;
  payload: {
    [key: string]: string
  }
}

// A very simple reducer
export function reducer(state: State, action: Action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  switch (action.type) {
    case 'INCREMENT':
      return state;
    case 'DECREMENT':
      return state;
    default:
      return state;
  }
}


