"use client"

import * as React from 'react';

type Action = 
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "setCount"; count: number };
type Dispatch = (action: Action) => void;
type State = { count: number };
type LeftBoxProviderProps = { children: React.ReactNode };

const LeftBoxStateContext = React.createContext<
    { leftState: State; leftDispatch: Dispatch } | undefined
>(undefined);

function leftBoxReducer(state: State, action: Action) {
    switch (action.type) {
        case "increment": {
            return { count: Math.min(state.count + 1, 10) };
        }
        case "decrement": {
            return { count: Math.max(state.count - 1, 0) };
        }
        case "setCount": {
            return { count: action.count };
        }
    }
}

function LeftBoxProvider({ children }: LeftBoxProviderProps) {
    const [ leftState, leftDispatch ] = React.useReducer(leftBoxReducer, { count: 0 });

    const value = { leftState, leftDispatch };
    return (
        <LeftBoxStateContext.Provider value={value}>
            {children}
        </LeftBoxStateContext.Provider>
    )
}

function useLeftBox() {
    const context = React.useContext(LeftBoxStateContext);
    if (context === undefined) {
        throw new Error('useLeftBox must be used within a LeftBoxProvider');
    }

    return context;
}

export { LeftBoxProvider, useLeftBox };