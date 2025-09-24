import { createAction, props } from '@ngrx/store';

export const saveContactInfoFormValues = createAction(
 '[Form] Save Contact Info Form Values',
  props<{ contactFormValues: any }>()
);

export const saveResidenceInfoFormValues = createAction(
    '[Form] Save Residence Info Form Values',
    props<{ residenceFormValues: any }>()
  );

  export const savePrevresidenceInfoFormValues = createAction(
    '[Form] Save Prev Residence Info Form Values',
    props<{ prevResidenceFormValues: any }>()
  );

  export const saveEmpInfoFormValues = createAction(
    '[Form] Save Emp Info Form Values',
    props<{ empFormValues: any }>()
  );

  export const savePrevEmpInfoFormValues = createAction(
    '[Form] Save Prev Emp Info Form Values',
    props<{ prevEmpFormValues: any }>()
  );

  export const saveHowYouPaidFormValues = createAction(
    '[Form] How Are You Paid Form Values',
    props<{ howYouPaidFormValues: any }>()
  );

  export const saveCurrentIncomeFormValues = createAction(
    '[Form] Current Income Form Values',
    props<{ currentIncomeFormValues: any }>()
  );

  export const saveCreditInfoFormValues = createAction(
    '[Form] Credit Info Form Values',
    props<{ creditInfoFormValues: any }>()
  );

export const clearFormValues = createAction('[Form] Clear Values');
