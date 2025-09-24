import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./prequalify-state";

export const selectPrequalifyState = createFeatureSelector<AppState>('prequalify');

export const getselectPrequalifyState = createSelector(
    selectPrequalifyState,
    (state: AppState) => state
);