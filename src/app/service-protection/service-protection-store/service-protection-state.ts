import { serviceContractRes, serviceProtectionResp } from '../../common/data-models';

export interface AppState {
    serviceProtection: serviceProtectionResp | null,
    status: string;
};

export const initialState: AppState = {
    serviceProtection: null,
    status: ''
};

// ServiceContract API
export interface serviceContractState {
    serviceContractDetails: serviceContractRes | null;
    status: string;
}

export const serviceContractDetailsinitialState: serviceContractState = {
    serviceContractDetails: null,
    status: '',
};

export interface serviceContractFinanceState {
    serviceContractFinanceDetails: serviceContractRes | null;
    status: string;
}

export const serviceContractFinanceDetailsinitialState: serviceContractFinanceState = {
    serviceContractFinanceDetails: null,
    status: '',
};

export interface serviceContractCashState {
    serviceContractCashDetails: serviceContractRes | null;
    status: string;
}

export const serviceContractCashDetailsinitialState: serviceContractCashState = {
    serviceContractCashDetails: null,
    status: '',
};