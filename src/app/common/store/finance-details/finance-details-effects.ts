import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
import { RestService } from '../../../services/rest.service';
import * as AppActions from './finance-details-action';
import { of } from 'rxjs';

@Injectable()
export class FinanceDetailsEffects {
    constructor(
        private actions$: Actions<any>,
        private restService: RestService
    ) { }

    fetchFinanceDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.financeDetailAction),
            mergeMap((action) =>
                this.restService.get_finance_details(action.payload).pipe(
                    map((items: any) =>
                        AppActions.financeDetailActionSuccess({
                            financeDetails: this.restService.parseJwt(items),
                            status: items.status,
                        })
                    ),
                    catchError((error) =>
                        of(AppActions.financeDetailActionFailed({ error: error }))
                    )
                )
            )
        )
    );
}
