import { financeDetailsResp } from '../../data-models';

export interface AppState {
    cashDetails: financeDetailsResp | null;
    status: string;
}

export const initialState: AppState = {
    cashDetails: null,
    status: '',
};
