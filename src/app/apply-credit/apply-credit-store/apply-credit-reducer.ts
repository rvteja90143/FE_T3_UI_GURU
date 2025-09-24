import { Action, createReducer, on } from '@ngrx/store';
import { applyCreditInfoSpec, applyCreditInfoError } from '../../common/data-models';
import * as ApplyCreditInfoSpecActions from './apply-credit-action';

export interface applyCreditInfoSpecState {
    apply_credit_info_spec: applyCreditInfoSpec | [];
    apply_credit_info_spec_error: applyCreditInfoError | [];
}

export const initialState: applyCreditInfoSpecState = {
    apply_credit_info_spec: [],
    apply_credit_info_spec_error: []
};

export const applyCreditInfoReducer = createReducer(
    initialState,

    on(ApplyCreditInfoSpecActions.applyCreditInfoSpecs, (state) => ({
        ...state,
    })),

    on(ApplyCreditInfoSpecActions.applyCreditInfoSpecSuccess, (state, applyCreditInfoItem) => ({
        ...state,
        apply_credit_info_spec: applyCreditInfoItem.apply_credit_info_spec,
        status: applyCreditInfoItem.status
    })),

    on(ApplyCreditInfoSpecActions.applyCreditInfoSpecFailed, (state, error) => ({
        ...state,
        apply_credit_info_error: error.apply_credit_info_error,
    })),

    on(ApplyCreditInfoSpecActions.resetApplyCreditInfoSpec, () => initialState)
);

export function applyCreditInfoComponentReducer(
    state: applyCreditInfoSpecState = initialState,
    action: Action
) {
    return applyCreditInfoReducer(state, action);
}