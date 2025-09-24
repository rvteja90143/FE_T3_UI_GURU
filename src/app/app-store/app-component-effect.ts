import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RestService } from '../services/rest.service';
import * as AppActions from './app-component-action';
import { of } from 'rxjs';

@Injectable()
export class AppComponentEffects {
    constructor(
        private actions$: Actions<any>,
        private restService: RestService
    ) { 
    }

    fetchPhotoGallery$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.photoGalleryAction),
            switchMap((action) =>
                this.restService.get_vehicle_images(action.payload.vin,action.payload.dealercode).pipe(
                    map((galleryItems: any) =>
                        AppActions.photoGalleryActionSuccess({
                            photoGallery: galleryItems.result,
                            status: galleryItems.status,
                        })
                    ),
                    catchError((error) =>
                        of(AppActions.photoGalleryActionFailed({ error: error }))
                    )
                )
            )
        )
        
    );

    fetchDealerInfo$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.getDealerInfoAction),
            switchMap((action) =>
                this.restService.get_deliver_data(action.vin,action.dealer_code).pipe(
                    map((dealerDetails: any) =>
                        AppActions.getDealerInfoActionSuccess({
                            dealerDetails: dealerDetails.result,
                            status: dealerDetails.status,
                        })
                    ),
                    catchError((error) =>
                        of(AppActions.getDealerInfoActionFailed({ error: error }))
                    )
                )
            )
        )
        
    );

    fetchVehicleDetailsSpec$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.vehicleDetailsSpec),
            mergeMap((action) =>
                this.restService.get_vehicle_specification(action.vin).pipe(
                    map((response: any) =>
                    AppActions.vehicleDetailsSpecSuccess({ vehicle_spec: response.result.vehicle_spec, status: response.status })
                    ),
                    catchError((error) =>
                        of(AppActions.vehicleDetailsSpecFailed({ error: error }))
                    )
                )
            )            
        )
    );
}

