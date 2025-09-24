import { applyCreditInfoSpec } from '../../common/data-models';

export interface AppState {
    apply_credit_info_spec: Array<applyCreditInfoSpec>
    status: string;
    message: string;
};

export const initialState: AppState = {
    apply_credit_info_spec: [],
    status: '',
    message: ''
};