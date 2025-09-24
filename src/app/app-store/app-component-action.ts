import { createAction, props } from '@ngrx/store';
import { dealerInfo, dealerInfoDetailsNewResp, dealerInfoDetailsResp, photoGalleryResponse, vehicleImages, vehicleSpec } from '../common/data-models';

export const photoGalleryAction = createAction(
    '[Photo Gallery Action] API called with payload',
    props<{ payload: vehicleImages }>( )
);

export const photoGalleryActionSuccess = createAction(
    '[Photo Gallery Action] API Success',
    props<{ photoGallery: photoGalleryResponse; status: string }>()
);

export const photoGalleryActionFailed = createAction(
    '[Photo Gallery Action] API failed',
    props<{ error: any }>()
);

export const resetPhotoGallery = createAction('[Photo Gallery] Reset');


export const getDealerInfoAction = createAction(
    '[Get DealerInfo Action] API called with payload',
    props<{ dealer_code: string; vin: string  }>( )
);

export const getDealerInfoActionSuccess = createAction(
    '[Get DealerInfo Action] API Success',
    props<{ dealerDetails: dealerInfoDetailsNewResp; status: string }>()
);

export const getDealerInfoActionFailed = createAction(
    '[Get DealerInfo Action] API failed',
    props<{ error: any }>()
);

export const resetGetDealerInfo = createAction('[Get DealerInfo] Reset');


export const vehicleDetailsSpec = createAction(
    '[Vehicle Detail Spec Action] API called with payload',
    props<{ vin: string }>()
);

export const vehicleDetailsSpecSuccess = createAction(
    '[Vehicle Detail Spec] API Success',
    props<{ vehicle_spec: vehicleSpec, status: string }>()
);

export const vehicleDetailsSpecFailed = createAction(
    "[Vehicle Detail Spec] API failed",
    props<{ error: any }>()
);

export const resetVehicleDetailsSpec = createAction('[Vehicle Detail Spec] Reset');
