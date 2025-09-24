import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RestService } from '../../../services/rest.service';
import * as AppActions from './lease-details-action';
import { of } from 'rxjs';

@Injectable()
export class LeaseDetailsEffects {
    constructor(
        private actions$: Actions<any>,
        private restService: RestService
    ) { }

    fetchLeaseDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.leaseDetailAction),
            mergeMap((action) =>
                this.restService.get_lease_details(action.payload).pipe(
                    map((items: any) =>
                        AppActions.leaseDetailActionSuccess({
                            leaseDetails: this.restService.parseJwt(items),
                            status: items.status,
                        })
                    ),
                    catchError((error) =>
                        of(AppActions.leaseDetailActionFailed({ error: error }))
                    )
                )
            )
        )
    );
}
