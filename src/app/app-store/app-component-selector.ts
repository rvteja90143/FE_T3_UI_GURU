import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, DealerInfoState, VehicleSpecAppState } from './app-state';

export const selectAppState = createFeatureSelector<AppState>('photoGallery');

export const getPhotoGalleryAPIResp = createSelector(
    selectAppState,
    (state: AppState) => state
);

export const selectDelerInfoAppState = createFeatureSelector<DealerInfoState>('dealerDetails');

export const dealerInfoDetailsNewResp = createSelector(
    selectDelerInfoAppState,
    (state: DealerInfoState) => state
);

export const selectVehicleSpecState = createFeatureSelector<VehicleSpecAppState>('vehicle_spec');

export const getVehicleDetailsSpec = createSelector(
    selectVehicleSpecState,
    (state: VehicleSpecAppState) => state
);
