import { createReducer, on } from '@ngrx/store';
import * as FormActions from '../form-store/form-action';

export interface FormState {
  contactFormValues: any;
  residenceFormValues: any;
  prevResidenceFormValues: any;
  empFormValues: any;
  prevEmpFormValues: any;
  howYouPaidFormValues: any;
  creditInfoFormValues: any;
  currentIncomeFormValues: any;
}

export const initialState: FormState = {
    contactFormValues: null,
    residenceFormValues: null,
    prevResidenceFormValues: null,
    empFormValues: null,
    prevEmpFormValues: null,
    howYouPaidFormValues: null,
    creditInfoFormValues: null,
    currentIncomeFormValues: null
};

export const formReducer = createReducer(
  initialState,
  on(FormActions.saveContactInfoFormValues, (state, { contactFormValues }) => ({ ...state, contactFormValues })),
  on(FormActions.saveResidenceInfoFormValues, (state, { residenceFormValues }) => ({
    ...state,
    residenceFormValues: { ...residenceFormValues }
  })),
  on(FormActions.savePrevresidenceInfoFormValues, (state, { prevResidenceFormValues }) => ({
    ...state,
    prevResidenceFormValues: { ...prevResidenceFormValues }
  })),
  on(FormActions.saveEmpInfoFormValues, (state, { empFormValues }) => ({
    ...state,
    empFormValues: { ...empFormValues }
  })),
  on(FormActions.savePrevEmpInfoFormValues, (state, { prevEmpFormValues }) => ({
    ...state,
    prevEmpFormValues: { ...prevEmpFormValues }
  })),
  on(FormActions.saveHowYouPaidFormValues, (state, { howYouPaidFormValues }) => ({
    ...state,
    howYouPaidFormValues: { ...howYouPaidFormValues }
  })),
  on(FormActions.saveCurrentIncomeFormValues, (state, { currentIncomeFormValues }) => ({
    ...state,
    currentIncomeFormValues: currentIncomeFormValues
  })),
  on(FormActions.saveCreditInfoFormValues, (state, { creditInfoFormValues }) => ({
    ...state,
    creditInfoFormValues: creditInfoFormValues 
  })),
  on(FormActions.clearFormValues, state => ({ ...state, formValues: {} }))
);
