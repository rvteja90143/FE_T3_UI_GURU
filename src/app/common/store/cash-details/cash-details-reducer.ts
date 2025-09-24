import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './cash-details-action';
import { financeDetailsResp } from '../../data-models';

export interface CashDetailsState {
    cashDetails: financeDetailsResp | null;
}

export const initialState: CashDetailsState = {
    cashDetails: null,
};

export const cashDetailsReducer = createReducer(
    initialState,

    on(AppActions.cashDetailAction, (state) => ({
        ...state,
    })),

    on(AppActions.cashDetailActionSuccess, (state, items) => ({
        ...state,
        cashDetails: items.cashDetails,
        status: items.status,
    })),

    on(AppActions.cashDetailActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetCashDetail, () => initialState)
);

export function cashDetailsComponentReducer(
    state: CashDetailsState = initialState,
    action: Action
) {
    return cashDetailsReducer(state, action);
}
