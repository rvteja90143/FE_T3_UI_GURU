import { createLeadResp } from '../../data-models';

export interface AppState {
    createLeadDetails: createLeadResp | null,
    status: string;
};

export const initialState: AppState = {
    createLeadDetails: null,
    status: ''
};