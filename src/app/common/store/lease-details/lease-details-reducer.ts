import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './lease-details-action';
import { leaseDetailsResp } from '../../data-models';

export interface LeaseDetailsState {
    leaseDetails: leaseDetailsResp | null;
}

export const initialState: LeaseDetailsState = {
    leaseDetails: null,
};

export const leaseDetailsReducer = createReducer(
    initialState,

    on(AppActions.leaseDetailAction, (state) => ({
        ...state,
    })),

    on(AppActions.leaseDetailActionSuccess, (state, items) => ({
        ...state,
        leaseDetails: items.leaseDetails,
        status: items.leaseDetails.status,
    })),

    on(AppActions.leaseDetailActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetLeaseDetail, () => initialState)
);

export function leaseDetailsComponentReducer(
    state: LeaseDetailsState = initialState,
    action: Action
) {
    return leaseDetailsReducer(state, action);
}
