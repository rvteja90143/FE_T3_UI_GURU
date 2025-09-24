import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RestService } from '../../../services/rest.service';
import * as AppActions from './cash-details-action';
import { of } from 'rxjs';

@Injectable()
export class CashDetailsEffects {
    constructor(
        private actions$: Actions<any>,
        private restService: RestService
    ) { }

    fetchCashDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.cashDetailAction),
            mergeMap((action) =>
                this.restService.get_cash_details(action.payload).pipe(
                    map((items: any) =>
                        AppActions.cashDetailActionSuccess({
                            cashDetails: this.restService.parseJwt(items),
                            status: items.status,
                        })
                    ),
                    catchError((error) =>
                        of(AppActions.cashDetailActionFailed({ error: error }))
                    )
                )
            )
        )
    );
}
