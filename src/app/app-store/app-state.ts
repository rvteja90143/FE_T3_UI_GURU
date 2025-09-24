import { dealerInfoDetailsNewResp, photoGalleryResponse, vehicleSpec } from "../common/data-models";

export interface AppState {
    photoGallery: Array<photoGalleryResponse>
    status: string;
};

export const initialState: AppState = {
    photoGallery: [],
    status: ''
};


export interface DealerInfoState {
    dealerDetails: Array<dealerInfoDetailsNewResp>
    status: string;
};

export const dealerInfoInitialState: DealerInfoState = {
    dealerDetails: [],
    status: ''
};

export interface VehicleSpecAppState {
    vehicle_spec: Array<vehicleSpec>
    status: string;
};

export const vehicleInitialState: VehicleSpecAppState = {
    vehicle_spec: [],
    status: ''
};