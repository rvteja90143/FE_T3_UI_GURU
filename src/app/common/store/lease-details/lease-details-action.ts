import { createAction, props } from '@ngrx/store';
import { leaseDatails, leaseDetailsResp } from '../../data-models';

export const leaseDetailAction = createAction(
    '[Lease Detail Action] API called with payload',
    props<{ payload: leaseDatails }>()
);

export const leaseDetailActionSuccess = createAction(
    '[Lease Detail Action] API Success',
    props<{ leaseDetails: leaseDetailsResp; status: string }>()
);

export const leaseDetailActionFailed = createAction(
    '[Lease Detail Action] API failed',
    props<{ error: any }>()
);

export const resetLeaseDetail = createAction('[Lease Detail] Reset');
