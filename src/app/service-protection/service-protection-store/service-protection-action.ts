import { createAction, props } from '@ngrx/store';
import { serviceContract, serviceContractRes, serviceProtectionResp } from '../../common/data-models';

export const serviceProtectionAction = createAction(
    '[ServiceProtection Action] API called with payload',
    props<{ vin: string }>()
);

export const serviceProtectionActionSuccess = createAction(
    '[ServiceProtection Details Action] API Success',
    props<{ serviceProtection: serviceProtectionResp; status: string }>()
);

export const serviceProtectionActionFailed = createAction(
    '[ServiceProtection Action] API failed',
    props<{ error: any }>()
);

export const resetServiceProtection = createAction('[ServiceProtection] Reset');

//service-contract API
export const serviceContractAction = createAction(
    '[ServiceContract Action] API called with payload',
    props<{ payload: serviceContract }>()
);

export const serviceContractActionSuccess = createAction(
    '[ServiceContract Details Action] API Success',
    props<{ serviceContractDetails: serviceContractRes; status: string }>()
);

export const serviceContractActionFailed = createAction(
    '[ServiceContract Action] API failed',
    props<{ error: any }>()
);
export const resetserviceContract = createAction('[ServiceContract] Reset');

export const serviceContractFinanceAction = createAction(
    '[ServiceContractFinance Action] API called with payload',
    props<{ payload: serviceContract }>()
);

export const serviceContractFinanceActionSuccess = createAction(
    '[ServiceContractFinance Details Action] API Success',
    props<{ serviceContractFinanceDetails: serviceContractRes; status: string }>()
);

export const serviceContractFinanceActionFailed = createAction(
    '[ServiceContractFinance Action] API failed',
    props<{ error: any }>()
);
export const resetserviceContractFinance = createAction('[ServiceContractFinance] Reset');

export const serviceContractCashAction = createAction(
    '[ServiceContractCash Action] API called with payload',
    props<{ payload: serviceContract }>()
);

export const serviceContractCashActionSuccess = createAction(
    '[ServiceContractCash Details Action] API Success',
    props<{ serviceContractCashDetails: serviceContractRes; status: string }>()
);

export const serviceContractCashActionFailed = createAction(
    '[ServiceContractCash Action] API failed',
    props<{ error: any }>()
);
export const resetserviceContractCash = createAction('[ServiceContractCash] Reset');
