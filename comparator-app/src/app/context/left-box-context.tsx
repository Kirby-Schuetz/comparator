"use client"

import * as React from 'react';

type Action = { type: 'increment' } | { type: 'decrement' };
type Dispatch = (action: Action) => void;
type State = { count: number };
type LeftBoxProviderProps = { children: React.ReactNode };

const LeftBoxStateContext = React.createContext<
    { state: State; dispatch: Dispatch } | undefined
>(undefined);

function leftBoxReducer(state: State, action: Action) {
    switch (action.type) {
        case 'increment': {
            return { count: state.count + 1 }
        }
        case 'decrement': {
            return { count: state.count - 1 }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function LeftBoxProvider({ children }: LeftBoxProviderProps) {
    const [ state, dispatch ] = React.useReducer(leftBoxReducer, { count: 0 });

    const value = { state, dispatch };
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