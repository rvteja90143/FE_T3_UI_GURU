import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './lease-details-state';

export const selectLeaseDetailsState =
    createFeatureSelector<AppState>('leaseDetails');

export const getLeaseDetailsState = createSelector(
    selectLeaseDetailsState,
    (state: AppState) => state
);
