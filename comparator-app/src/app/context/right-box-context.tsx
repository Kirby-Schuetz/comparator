"use client"

import * as React from 'react';

type Action = { type: 'increment' } | { type: 'decrement' };
type Dispatch = (action: Action) => void;
type State = { count: number };
type RightBoxProviderProps = { children: React.ReactNode };

const RightBoxStateContext = React.createContext<
    { rightState: State; rightDispatch: Dispatch } | undefined
>(undefined);

function rightBoxReducer(rightState: State, action: Action) {
    switch (action.type) {
        case 'increment': {
            return { count: rightState.count + 1 }
        }
        case 'decrement': {
            return { count: rightState.count - 1 }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function RightBoxProvider({ children }: RightBoxProviderProps) {
    const [ rightState, rightDispatch ] = React.useReducer(rightBoxReducer, { count: 0 });

    const value = { rightState, rightDispatch };
    return (
        <RightBoxStateContext.Provider value={value}>
            {children}
        </RightBoxStateContext.Provider>
    )
}

function useRightBox() {
    const context = React.useContext(RightBoxStateContext);
    if (context === undefined) {
        throw new Error('useRightBox must be used within a RightBoxProvider');
    }

    return context;
}

export { RightBoxProvider, useRightBox };