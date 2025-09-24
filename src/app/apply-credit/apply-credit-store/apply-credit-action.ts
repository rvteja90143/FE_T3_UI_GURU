import { createAction, props } from '@ngrx/store';
import { applyCreditInfo, applyCreditInfoSpec, applyCreditInfoError } from '../../common/data-models'

export const applyCreditInfoSpecs = createAction(
    '[Apply Credit Spec Action] API called with payload',
    props<{ apply_credit_info: applyCreditInfo }>()
);

export const applyCreditInfoSpecSuccess = createAction(
    '[Apply Credit Spec] API Success',
    props<{ apply_credit_info_spec: applyCreditInfoSpec, status: boolean }>()
);

export const applyCreditInfoSpecFailed = createAction(
    "[Apply Credit Spec] API failed",
    props<{ apply_credit_info_error: applyCreditInfoError }>()
);

export const resetApplyCreditInfoSpec = createAction('[Apply Credit Spec] Reset');