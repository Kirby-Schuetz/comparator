"use client"

import * as React from 'react';
import { ColumnId } from '../types/shared';

type Action = 
  | { type: 'increment'; columnId: ColumnId }
  | { type: 'decrement'; columnId: ColumnId }
  | { type: 'setCount'; columnId: ColumnId; count: number };

interface State {
  left: { count: number };
  right: { count: number };
}

type Dispatch = (action: Action) => void;
type ColumnsProviderProps = { children: React.ReactNode };

const ColumnsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function columnsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': {
      return {
        ...state,
        [action.columnId]: { count: state[action.columnId].count + 1 }
      };
    }
    case 'decrement': {
      return {
        ...state,
        [action.columnId]: { count: state[action.columnId].count - 1 }
      };
    }
    case 'setCount': {
      return {
        ...state,
        [action.columnId]: { count: action.count }
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export function ColumnsProvider({ children }: ColumnsProviderProps) {
  const [state, dispatch] = React.useReducer(columnsReducer, {
    left: { count: 0 },
    right: { count: 0 }
  });

  return (
    <ColumnsContext.Provider value={{ state, dispatch }}>
      {children}
    </ColumnsContext.Provider>
  );
}

export function useColumns(columnId: ColumnId) {
  const context = React.useContext(ColumnsContext);
  if (!context) {
    throw new Error('useColumns must be used within a ColumnsProvider');
  }

  return {
    count: context.state[columnId].count,
    increment: () => context.dispatch({ type: 'increment', columnId }),
    decrement: () => context.dispatch({ type: 'decrement', columnId }),
    setCount: (count: number) => context.dispatch({ type: 'setCount', columnId, count })
  };
} 