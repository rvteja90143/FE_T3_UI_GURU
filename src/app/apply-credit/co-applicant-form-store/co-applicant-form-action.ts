import { createAction, props } from '@ngrx/store';

export const saveCoappContactInfoFormValues = createAction(
 '[Form] Save Coapp Contact Info Form Values',
  props<{ coappContactFormValues: any }>()
);

export const saveCoappRelationshipInfoFormValues = createAction(
    '[Form] Save Coapp Relationship Info Form Values',
     props<{ coappRelationshipFormValues: any }>()
   );

export const saveCoappResidenceInfoFormValues = createAction(
    '[Form] Save Coapp Residence Info Form Values',
    props<{ coappResidenceFormValues: any }>()
  );

  export const saveCoappPrevresidenceInfoFormValues = createAction(
    '[Form] Save Coapp Prev Residence Info Form Values',
    props<{ coappPrevResidenceFormValues: any }>()
  );

  export const saveCoappEmpInfoFormValues = createAction(
    '[Form] Save Coapp Emp Info Form Values',
    props<{ coappEmpFormValues: any }>()
  );

  export const saveCoappPrevEmpInfoFormValues = createAction(
    '[Form] Save Coapp Prev Emp Info Form Values',
    props<{ coappPrevEmpFormValues: any }>()
  );

  export const saveCoappHowYouPaidFormValues = createAction(
    '[Form] How Are You Paid Coapp Form Values',
    props<{ coappHowYouPaidFormValues: any }>()
  );

  export const saveCoappCurrentIncomeFormValues = createAction(
    '[Form] Coapp Current Income Form Values',
    props<{ coappcurrentIncomeFormValues: any }>()
  );

  export const saveCoappCreditInfoFormValues = createAction(
    '[Form] Credit Info Coapp Form Values',
    props<{ coappCreditInfoFormValues: any }>()
  );

export const clearCoappFormValues = createAction('[Form] Clear Values');
