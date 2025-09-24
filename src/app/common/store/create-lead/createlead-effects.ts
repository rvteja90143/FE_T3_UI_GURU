import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError } from "rxjs/operators";
import { RestService } from "../../../services/rest.service";
import * as AppActions from './createlead-action';
import { Observable, of } from "rxjs";
import { data } from "jquery";
import { Action } from "@ngrx/store";

@Injectable()
export class CreateLeadEffects {
    constructor(private actions$: Actions<any>, private restService: RestService) { }
    fetchcreateLeadDetails$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppActions.createLeadAction),
            switchMap(() =>
                this.restService.submit_lead_details().pipe(
                    map((items: any) =>
                        AppActions.createLeadActionSuccess({ createLeadDetails: items, status: items.status })
                    ),
                    catchError((error) =>
                        of(AppActions.createLeadActionFailed({ error: error }))
                    )
                )
            )
        )
    );
}


