import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./apply-credit-state";

export const selectApplyCreditInfoSpecState = createFeatureSelector<AppState>('apply_credit_info_spec');

export const getApplyCreditInfoSpec = createSelector(
    selectApplyCreditInfoSpecState,
    (state: AppState) => state
);
