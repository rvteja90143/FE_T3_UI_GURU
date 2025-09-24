import { Action, createReducer, on } from '@ngrx/store';
import * as AppActions from './service-protection-action';
import { serviceContractRes, serviceProtectionResp } from '../../common/data-models';

export interface ServiceProtectionState {
    serviceProtection: serviceProtectionResp | null;
}

export const initialState: ServiceProtectionState = {
    serviceProtection: null
};

export const serviceProtectionReducer = createReducer(
    initialState,

    on(AppActions.serviceProtectionAction, (state) => ({
        ...state,
    })),

    on(AppActions.serviceProtectionActionSuccess, (state, items) => ({
        ...state,
        serviceProtection: items.serviceProtection,
        status: items.status,
    })),

    on(AppActions.serviceProtectionActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetServiceProtection, () => initialState)
);

export function serviceProtectionComponentReducer(
    state: ServiceProtectionState = initialState,
    action: Action
) {
    return serviceProtectionReducer(state, action);
}

// ServiceContract API
export interface serviceContractDetailsState {
    serviceContractDetails: serviceContractRes | null;
}

export const initialServiceContract: serviceContractDetailsState = {
    serviceContractDetails: null,
};

export const serviceContractDetailsReducer = createReducer(
    initialServiceContract,

    on(AppActions.serviceContractAction, (state) => ({
        ...state,
    })),

    on(AppActions.serviceContractActionSuccess, (state, items) => ({
        ...state,
        serviceContractDetails: items.serviceContractDetails,
        status: items.status,
    })),

    on(AppActions.serviceContractActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetserviceContract, () => initialServiceContract)
);

export function serviceContractDetailsComponentReducer(
    state: serviceContractDetailsState = initialServiceContract,
    action: Action
) {
    return serviceContractDetailsReducer(state, action);
}



export interface serviceContractFinanceDetailsState {
    serviceContractFinanceDetails: serviceContractRes | null;
}

export const initialServiceContractFinance: serviceContractFinanceDetailsState = {
    serviceContractFinanceDetails: null,
};

export const serviceContractFinanceDetailsReducer = createReducer(
    initialServiceContractFinance,

    on(AppActions.serviceContractFinanceAction, (state) => ({
        ...state,
    })),

    on(AppActions.serviceContractFinanceActionSuccess, (state, items) => ({
        ...state,
        serviceContractFinanceDetails: items.serviceContractFinanceDetails,
        status: items.status,
    })),

    on(AppActions.serviceContractFinanceActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetserviceContractFinance, () => initialServiceContractFinance)
);

export function serviceContractFinanceDetailsComponentReducer(
    state: serviceContractFinanceDetailsState = initialServiceContractFinance,
    action: Action
) {
    return serviceContractFinanceDetailsReducer(state, action);
}

//cash

export interface serviceContractCashDetailsState {
    serviceContractCashDetails: serviceContractRes | null;
}

export const initialServiceContractCash: serviceContractCashDetailsState = {
    serviceContractCashDetails: null,
};

export const serviceContractCashDetailsReducer = createReducer(
    initialServiceContractCash,

    on(AppActions.serviceContractCashAction, (state) => ({
        ...state,
    })),

    on(AppActions.serviceContractCashActionSuccess, (state, items) => ({
        ...state,
        serviceContractCashDetails: items.serviceContractCashDetails,
        status: items.status,
    })),

    on(AppActions.serviceContractCashActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetserviceContractCash, () => initialServiceContractCash)
);

export function serviceContractCashDetailsComponentReducer(
    state: serviceContractCashDetailsState = initialServiceContractCash,
    action: Action
) {
    return serviceContractCashDetailsReducer(state, action);
}