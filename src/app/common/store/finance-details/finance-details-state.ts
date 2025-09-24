import { financeDetailsResp } from '../../data-models';

export interface AppState {
    financeDetails: financeDetailsResp | null;
    status: string;
}

export const initialState: AppState = {
    financeDetails: null,
    status: '',
};
