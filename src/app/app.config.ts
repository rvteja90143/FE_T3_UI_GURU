import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideState, provideStore } from '@ngrx/store';
import { appComponentReducer, appDealerInfoComponentReducer, appReducer, vehicleDetailsReducer } from './app-store/app-component-reducer';
import { provideEffects } from '@ngrx/effects';
import { AppComponentEffects } from './app-store/app-component-effect';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ServiceProtectionEffects } from './service-protection/service-protection-store/service-protection-effects';
import { serviceContractCashDetailsComponentReducer, serviceContractDetailsComponentReducer, serviceContractDetailsReducer, serviceContractFinanceDetailsComponentReducer, serviceProtectionComponentReducer } from './service-protection/service-protection-store/service-protection-reducer';

import { leaseDetailsComponentReducer } from './common/store/lease-details/lease-details-reducer';
import { LeaseDetailsEffects } from './common/store/lease-details/lease-details-effects';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PrequalifyEffects } from './prequalify/prequalify-store/prequalify-effects';
import { prequalifyReducer } from './prequalify/prequalify-store/prequalify-reducer';

/*export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, './assets/lang/', '.json');
}*/
import { provideNativeDateAdapter } from '@angular/material/core';
import { financeDetailsComponentReducer } from './common/store/finance-details/finance-details-reducer';
import { FinanceDetailsEffects } from './common/store/finance-details/finance-details-effects';
import { cashDetailsComponentReducer } from './common/store/cash-details/cash-details-reducer';
import { CashDetailsEffects } from './common/store/cash-details/cash-details-effects';
import { TestDriveComponent } from './test-drive/test-drive.component';
import { DatePipe } from '@angular/common';
import { ApplyCreditInfoActionsSpecEffects } from './apply-credit/apply-credit-store/apply-credit-effects';
import { applyCreditInfoReducer } from './apply-credit/apply-credit-store/apply-credit-reducer';
import { formReducer } from './apply-credit/form-store/form-reducer';
import { coappFormReducer } from './apply-credit/co-applicant-form-store/co-applicant-form-reducer';
//import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch()), provideAnimations(), provideNativeDateAdapter(),
    provideStore(),
        DatePipe,
    provideState({ name: 'photoGallery', reducer: appComponentReducer }),
    provideState({ name: 'serviceProtection', reducer: serviceProtectionComponentReducer }),
    provideState({ name: 'serviceContractDetails', reducer: serviceContractDetailsComponentReducer }),
    provideState({ name: 'serviceContractFinanceDetails', reducer: serviceContractFinanceDetailsComponentReducer }),
    provideState({ name: 'serviceContractCashDetails', reducer: serviceContractCashDetailsComponentReducer }),
    provideState({ name: 'dealerDetails', reducer: appDealerInfoComponentReducer }),
    provideState({ name: 'vehicle_spec', reducer: vehicleDetailsReducer }),
    provideState({ name: 'leaseDetails', reducer: leaseDetailsComponentReducer }),
    provideState({ name: 'prequalify', reducer: prequalifyReducer }),
    provideState({ name: 'financeDetails', reducer: financeDetailsComponentReducer }),
    provideState({ name: 'cashDetails', reducer: cashDetailsComponentReducer }),
    provideState({ name: 'apply_credit_info_spec', reducer: applyCreditInfoReducer }),
    provideState({ name: 'coappForm', reducer: coappFormReducer }),
    provideState({ name: 'appForm', reducer: formReducer }),
    provideEffects(AppComponentEffects, LeaseDetailsEffects, ServiceProtectionEffects, PrequalifyEffects, FinanceDetailsEffects, CashDetailsEffects, ApplyCreditInfoActionsSpecEffects),
    provideStoreDevtools({
        maxAge: 25, // Retains last 25 states
        logOnly: !isDevMode()
    }),
    importProvidersFrom(
        /*TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        })*/
    ), //provideAnimationsAsync(),
    ]
};
