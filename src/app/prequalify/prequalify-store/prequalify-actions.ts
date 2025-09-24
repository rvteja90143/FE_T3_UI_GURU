import { createAction, props } from '@ngrx/store';
import { prequalify_data, prequalify_resp } from '../../common/data-models';

export const prequalifyAction = createAction(
    '[Prequalify Action] API called with payload',
    props<prequalify_data>()
);

export const prequalifyActionSuccess = createAction(
    '[Prequalify Details Action] API Success',
    props<{ prequalifyResp: prequalify_resp; status: string }>()
);

export const prequalifyActionFailed = createAction(
    '[Prequalify Action] API failed',
    props<{ error: any }>()
);

export const resetPrequalify = createAction('[Prequalify] Reset');