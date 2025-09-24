import { Action, createReducer, on } from '@ngrx/store';
import { dealerInfoDetailsNewResp, photoGalleryResponse, vehicleSpec } from '../common/data-models';
import * as AppActions from './app-component-action';

export interface PhotoGalleryState {
    photoGallery: photoGalleryResponse[];
}

export const initialState: PhotoGalleryState = {
    photoGallery: [],
};

export const appReducer = createReducer(
    initialState,

    on(AppActions.photoGalleryAction, (state) => ({
        ...state,
    })),

    on(AppActions.photoGalleryActionSuccess, (state, galleryItems) => ({
        ...state,
        photoGallery: [galleryItems.photoGallery],
        status: galleryItems.status,
    })),

    on(AppActions.photoGalleryActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),
    on(AppActions.resetPhotoGallery, () => initialState)
);

export function appComponentReducer(
    state: PhotoGalleryState = initialState,
    action: Action
) {
    
    return appReducer(state, action);
}

export interface getDealerInfoState {
    dealerDetails: dealerInfoDetailsNewResp[];
}

export const getDealerInfoInitialState: getDealerInfoState = {
    dealerDetails: [],
};
export const appDealerInfoReducer = createReducer(
    getDealerInfoInitialState,

    on(AppActions.getDealerInfoAction, (state) => ({
        ...state,
    })),

    on(AppActions.getDealerInfoActionSuccess, (state, dealerInfoDetails) => ({
        ...state,
        dealerDetails: [dealerInfoDetails.dealerDetails],
        status: dealerInfoDetails.status,
    })),

    on(AppActions.getDealerInfoActionFailed, (state, error) => ({
        ...state,
        status: error,
    })),
    on(AppActions.resetGetDealerInfo, () => getDealerInfoInitialState)
);

export function appDealerInfoComponentReducer(
    state: getDealerInfoState = getDealerInfoInitialState,
    action: Action
) { 
    return appDealerInfoReducer(state, action);
}


export interface VehicleSpecState {
    vehicle_spec: vehicleSpec | [];
}

export const vehicleInitialState: VehicleSpecState = {
    vehicle_spec: [],
};

export const vehicleDetailsReducer = createReducer(
    vehicleInitialState,

    on(AppActions.vehicleDetailsSpec, (state) => ({
        ...state,
    })),

  on(AppActions.vehicleDetailsSpecSuccess, (state, vehicleItems) => ({
    ...state,
    vehicle_spec: vehicleItems.vehicle_spec,
    status: vehicleItems.status,
  })),

    on(AppActions.vehicleDetailsSpecFailed, (state, error) => ({
        ...state,
        status: error,
    })),

    on(AppActions.resetVehicleDetailsSpec, () => vehicleInitialState)
);

export function vehicleDetailsComponentReducer(
    state: VehicleSpecState = vehicleInitialState,
    action: Action
) {
    return vehicleDetailsReducer(state, action);
}
