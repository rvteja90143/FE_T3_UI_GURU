import { createReducer, on } from '@ngrx/store';
import * as FormActions from '../co-applicant-form-store/co-applicant-form-action';

export interface CoappFormState {
  coappContactFormValues: any; // Again, use a specific type if possible
  coappResidenceFormValues: any;
  coappPrevResidenceFormValues: any;
  coappEmpFormValues: any;
  coappPrevEmpFormValues: any;
  coappHowYouPaidFormValues: any;
  coappCreditInfoFormValues: any;
  coappRelationshipFormValues: any;
}

export const initialState: CoappFormState = {
    coappContactFormValues: null,
    coappResidenceFormValues: null,
    coappPrevResidenceFormValues: null,
    coappEmpFormValues: null,
    coappPrevEmpFormValues: null,
    coappHowYouPaidFormValues: null,
    coappCreditInfoFormValues: null,
    coappRelationshipFormValues: null
};

export const coappFormReducer = createReducer(
  initialState,
  on(FormActions.saveCoappContactInfoFormValues, (state, { coappContactFormValues }) => ({ ...state, coappContactFormValues })),
  on(FormActions.saveCoappRelationshipInfoFormValues, (state, { coappRelationshipFormValues }) => ({ ...state, coappRelationshipFormValues })),
  on(FormActions.saveCoappResidenceInfoFormValues, (state, { coappResidenceFormValues }) => ({
    ...state,
    coappResidenceFormValues: { ...coappResidenceFormValues }
  })),
  on(FormActions.saveCoappPrevresidenceInfoFormValues, (state, { coappPrevResidenceFormValues }) => ({
    ...state,
    coappPrevResidenceFormValues: { ...coappPrevResidenceFormValues }
  })),
  on(FormActions.saveCoappEmpInfoFormValues, (state, { coappEmpFormValues }) => ({
    ...state,
    coappEmpFormValues: { ...coappEmpFormValues }
  })),
  on(FormActions.saveCoappPrevEmpInfoFormValues, (state, { coappPrevEmpFormValues }) => ({
    ...state,
    coappPrevEmpFormValues: { ...coappPrevEmpFormValues }
  })),
  on(FormActions.saveCoappHowYouPaidFormValues, (state, { coappHowYouPaidFormValues }) => ({
    ...state,
    coappHowYouPaidFormValues: { ...coappHowYouPaidFormValues }
  })),
  on(FormActions.saveCoappCurrentIncomeFormValues, (state, { coappcurrentIncomeFormValues }) => ({
    ...state,
    coappcurrentIncomeFormValues: coappcurrentIncomeFormValues
  })),
  on(FormActions.saveCoappCreditInfoFormValues, (state, { coappCreditInfoFormValues }) => ({
    ...state,
  coappCreditInfoFormValues: coappCreditInfoFormValues
  })),
  on(FormActions.clearCoappFormValues, state => ({ ...state, coappFormValues: {} }))
);
