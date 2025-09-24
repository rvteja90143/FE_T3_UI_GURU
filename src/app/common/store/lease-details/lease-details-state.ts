import { leaseDetailsResp } from '../../data-models';

export interface AppState {
    leaseDetails: leaseDetailsResp | null;
    status: string;
}

export const initialState: AppState = {
    leaseDetails: null,
    status: '',
};
