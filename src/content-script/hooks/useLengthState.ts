import { useState } from 'react';

export function useLengthState<T>(initialState: T[]): [T[], (newState: T[]) => void] {
  const [state, setState] = useState(initialState);

  function smartSetState(newState: T[]) {
    if (state.length !== newState.length) {
      setState(newState);
    }
  }

  return [state, smartSetState];
}
