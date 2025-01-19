"use client"

import * as React from 'react';

type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'setCount', count: number };
type Dispatch = (action: Action) => void;
type State = { count: number };
type LeftBoxProviderProps = { children: React.ReactNode };

const LeftBoxStateContext = React.createContext<
    { leftState: State; leftDispatch: Dispatch } | undefined
>(undefined);

function leftBoxReducer(leftState: State, action: Action) {
    switch (action.type) {
        case 'increment': {
            return { count: leftState.count + 1 }
        }
        case 'decrement': {
            return { count: leftState.count - 1 }
        }
        case 'setCount': {
            return { count: action.count }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
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