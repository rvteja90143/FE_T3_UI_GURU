import { createAction, props } from '@ngrx/store';
import { createLeadResp } from '../../data-models';

export const createLeadAction = createAction(
    '[CreateLead Action] API called with payload'
);

export const createLeadActionSuccess = createAction(
    '[CreateLead Details Action] API Success',
    props<{ createLeadDetails: createLeadResp, status: string }>()
);

export const createLeadActionFailed = createAction(
    '[CreateLead Action] API failed',
    props<{ error: any }>()
);

export const resetcreateLead = createAction('[CreateLead] Reset');
