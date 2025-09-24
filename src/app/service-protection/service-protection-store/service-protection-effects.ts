import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { RestService } from "../../services/rest.service";
import * as AppActions from './service-protection-action';
import { of } from "rxjs";

@Injectable()
export class ServiceProtectionEffects {
    constructor(private actions$: Actions<any>, private restService: RestService) { }

    fetchServiceProtectionDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.serviceProtectionAction),
            mergeMap((action) =>
                this.restService.get_service_protection(action.vin).pipe(
                    map((items: any) =>
                        AppActions.serviceProtectionActionSuccess({ serviceProtection: items.result, status: items.status })
                    ),
                    catchError((error) =>
                        of(AppActions.serviceProtectionActionFailed({ error: error }))
                    )
                )
            )
        )
    );

    //ServiceContract API
    fetchServiceContractDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.serviceContractAction),
            mergeMap((action) =>
                this.restService.service_contract_lease(action.payload).pipe(
                    map((items: any) =>
                        AppActions.serviceContractActionSuccess({ serviceContractDetails: items, status: items.status })
                    ),
                    catchError((error) =>
                        of(AppActions.serviceContractActionFailed({ error: error }))
                    )
                )
            )
        )
    );

    fetchServiceContractDetailsFinance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.serviceContractFinanceAction),
            mergeMap((action) =>
                this.restService.service_contract_finance(action.payload).pipe(
                    map((items: any) =>
                        AppActions.serviceContractFinanceActionSuccess({ serviceContractFinanceDetails: items, status: items.status })
                    ),
                    catchError((error) =>
                        of(AppActions.serviceContractFinanceActionFailed({ error: error }))
                    )
                )
            )
        )
    );

    fetchServiceContractDetailsCash$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.serviceContractCashAction),
            mergeMap((action) =>
                this.restService.service_contract_cash(action.payload).pipe(
                    map((items: any) =>
                        AppActions.serviceContractCashActionSuccess({ serviceContractCashDetails: items, status: items.status })
                    ),
                    catchError((error) =>
                        of(AppActions.serviceContractCashActionFailed({ error: error }))
                    )
                )
            )
        )
    );
}


