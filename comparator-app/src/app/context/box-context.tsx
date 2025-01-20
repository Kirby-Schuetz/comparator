"use client";

import * as React from 'react';
import { BoxAction, BoxState, BoxDispatch } from '../types/shared';

function boxReducer(state: BoxState, action: BoxAction): BoxState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: Math.max(0, state.count - 1) };
    case 'setCount':
      return { count: Math.max(0, Math.min(action.count, 10)) };
    default:
      throw new Error(`Unhandled action type`);
  }
}

// Create a factory function for box contexts
export function createBoxContext(name: string) {
  const BoxStateContext = React.createContext<
    { state: BoxState; dispatch: BoxDispatch } | undefined
  >(undefined);

  function BoxProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(boxReducer, { count: 0 });
    const value = { state, dispatch };
    
    return (
      <BoxStateContext.Provider value={value}>
        {children}
      </BoxStateContext.Provider>
    );
  }

  function useBox() {
    const context = React.useContext(BoxStateContext);
    if (context === undefined) {
      throw new Error(`use${name}Box must be used within a ${name}BoxProvider`);
    }
    return context;
  }

  return { BoxProvider, useBox };
} 