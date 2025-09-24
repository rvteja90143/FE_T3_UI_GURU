import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './finance-details-action';
import { financeDetailsResp } from '../../data-models';

export interface FinanceDetailsState {
    financeDetails: financeDetailsResp | null;
}

export const initialState: FinanceDetailsState = {
    financeDetails: null,
};

export const financeDetailsReducer = createReducer(
    initialState,

    on(AppActions.financeDetailAction, (state) => ({
        ...state,
    })),

    on(AppActions.financeDetailActionSuccess, (state, items) => ({
        ...state,
        financeDetails: items.financeDetails,
        status: items.status,
    })),

    on(AppActions.financeDetailActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetFinanceDetail, () => initialState)
);

export function financeDetailsComponentReducer(
    state: FinanceDetailsState = initialState,
    action: Action
) {
    return financeDetailsReducer(state, action);
}
