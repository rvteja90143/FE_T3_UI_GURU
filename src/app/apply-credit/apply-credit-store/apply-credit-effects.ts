import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { RestService } from "./../../services/rest.service";
import * as ApplyCreditInfoActions from './apply-credit-action';
import { of } from "rxjs";

@Injectable()
export class ApplyCreditInfoActionsSpecEffects {
    constructor(private actions$: Actions<any>, private restService: RestService) { }

    fetchApplyCreditInfoSpec$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ApplyCreditInfoActions.applyCreditInfoSpecs),
            switchMap((action) =>
                this.restService.get_applycreditconfig(action.apply_credit_info).pipe(
                    map((response: any) =>
                        ApplyCreditInfoActions.applyCreditInfoSpecSuccess({ apply_credit_info_spec: response.data, status: response.status })
                    ),
                    catchError((error) =>
                        of(ApplyCreditInfoActions.applyCreditInfoSpecFailed({ apply_credit_info_error: error.error.data }))
                    )
                )
            )
        )
    );
}
