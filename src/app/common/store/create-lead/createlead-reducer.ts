import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './createlead-action';
import { createLeadResp } from '../../data-models';

export interface createLeadState {
    createLeadDetails: createLeadResp | null;
}

export const initialState: createLeadState = {
    createLeadDetails: null,
};

export const createLeadReducer = createReducer(
    initialState,

    on(AppActions.createLeadAction, (state) => ({
        ...state,
    })),

    on(AppActions.createLeadActionSuccess, (state, items) => (
        {
            ...state,
            createLeadDetails: items.createLeadDetails
        })),

    on(AppActions.createLeadActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetcreateLead, () => initialState)
);

export function createLeadComponentReducer(
    state: createLeadState = initialState,
    action: Action
) {
    return createLeadReducer(state, action);
}
