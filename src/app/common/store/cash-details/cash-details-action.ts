import { createAction, props } from '@ngrx/store';
import { cashDetails, financeDetailsResp } from '../../data-models';

export const cashDetailAction = createAction(
    '[Cash Detail Action] API called with payload',
    props<{ payload: cashDetails }>()
);

export const cashDetailActionSuccess = createAction(
    '[Cash Detail Action] API Success',
    props<{ cashDetails: financeDetailsResp; status: string }>()
);

export const cashDetailActionFailed = createAction(
    '[Cash Detail Action] API failed',
    props<{ error: any }>()
);

export const resetCashDetail = createAction('[Cash Detail] Reset');
