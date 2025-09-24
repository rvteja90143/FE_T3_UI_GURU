import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState, serviceContractState ,serviceContractFinanceState,serviceContractCashState} from "./service-protection-state";

export const selectServiceProtectionState = createFeatureSelector<AppState>('serviceProtection');

export const getselectServiceProtectionState = createSelector(
    selectServiceProtectionState,
    (state: AppState) => state
);

//ServiceContract API
export const selectserviceContractDetailsState =
    createFeatureSelector<serviceContractState>('serviceContractDetails');

export const getserviceContractDetailsState = createSelector(
    selectserviceContractDetailsState,
    (state: serviceContractState) => state
);

export const selectserviceContractFinanceDetailsState =
    createFeatureSelector<serviceContractFinanceState>('serviceContractFinanceDetails');

export const getserviceContractFinanceDetailsState = createSelector(
    selectserviceContractFinanceDetailsState,
    (state: serviceContractFinanceState) => state
);

export const selectserviceContractCashDetailsState =
    createFeatureSelector<serviceContractCashState>('serviceContractCashDetails');

export const getserviceContractCashDetailsState = createSelector(
    selectserviceContractCashDetailsState,
    (state: serviceContractCashState) => state
);
