import { createAction, props } from '@ngrx/store';
import { financeDetail, financeDetailsResp } from '../../data-models';

export const financeDetailAction = createAction(
    '[Finance Detail Action] API called with payload',
    props<{ payload: financeDetail }>()
);

export const financeDetailActionSuccess = createAction(
    '[Finance Detail Action] API Success',
    props<{ financeDetails: financeDetailsResp; status: string }>()
);

export const financeDetailActionFailed = createAction(
    '[Finance Detail Action] API failed',
    props<{ error: any }>()
);

export const resetFinanceDetail = createAction('[Finance Detail] Reset');
