import { Injectable } from "@angular/core";
import { Actions, act, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, mergeMap } from "rxjs/operators";
import { RestService } from "../../services/rest.service";
import * as AppActions from './prequalify-actions';
import { of } from "rxjs";

@Injectable()
export class PrequalifyEffects {
    constructor(private actions$: Actions<any>, private restService: RestService) { }

    fetchPrequalifyDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.prequalifyAction),
            mergeMap((action) => {
                // Destructure action and exclude the 'type' property
                const { type, ...payloadWithoutType } = action;
          
                // Pass the payload without 'type' to the API service
                return this.restService.prequal_estimation(payloadWithoutType).pipe(
                  map((items: any) =>
                    AppActions.prequalifyActionSuccess({ prequalifyResp: items, status: items.status })
                  ),
                  catchError((error) =>
                    of(AppActions.prequalifyActionFailed({ error: error }))
                  )
                );
              })
        )
    );
}