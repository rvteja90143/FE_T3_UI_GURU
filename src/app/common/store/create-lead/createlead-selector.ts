import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./createlead-state";

export const selectCreateLeadState = createFeatureSelector<AppState>('createLeadDetails');

export const getCreateLeadState = createSelector(
    selectCreateLeadState,
    (state: AppState) => state
);
