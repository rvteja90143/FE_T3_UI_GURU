import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './prequalify-actions';
import { prequalify_resp } from '../../common/data-models';

export interface PrequalifyState {
    prequalifyResp: prequalify_resp | null;
    status?: string;
}

export const initialState: PrequalifyState = {
    prequalifyResp: null
};

export const prequalifyReducer = createReducer(
    initialState,
    on(AppActions.prequalifyAction, (state) => ({
        ...state,
    })),

    on(AppActions.prequalifyActionSuccess, (state, { prequalifyResp, status }) => ({
        ...state,
        prequalifyResp,
        status,
    })),

    on(AppActions.prequalifyActionFailed, (state, { error }) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetPrequalify, () => initialState)
);

export function prequalifyComponentReducer(
    state: PrequalifyState = initialState,
    action: Action
) {
    return prequalifyReducer(state, action);
}
