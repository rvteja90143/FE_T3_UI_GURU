import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './finance-details-state';

export const selectFinanceDetailsState =
    createFeatureSelector<AppState>('financeDetails');

export const getFinanceDetailsState = createSelector(
    selectFinanceDetailsState,
    (state: AppState) => state
);
