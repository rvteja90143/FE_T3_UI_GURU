import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './cash-details-state';

export const selectCashDetailsState =
    createFeatureSelector<AppState>('cashDetails');

export const getCashDetailsState = createSelector(
    selectCashDetailsState,
    (state: AppState) => state
);
