import { bootstrapApplication, createApplication } from '@angular/platform-browser';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { appConfig } from './app/app.config';
import { AppComponent, EshopInventoryComponent } from './app/app.component';
import { ApplicationRef, enableProdMode } from '@angular/core';
import {createCustomElement} from '@angular/elements';
import { AppCertifiedComponent } from './app/app.component';
import 'zone.js/dist/zone';
import { environment } from './environments/environment';

if(environment.production){
  enableProdMode()
}
(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  // Define Web Components
  const appComponent = createCustomElement(AppComponent, {injector: app.injector});
  customElements.define('app-root', appComponent);

  const certifiedComponent = createCustomElement(AppCertifiedComponent, { injector: app.injector });
  customElements.define('app-certified', certifiedComponent);

  const eshopInventoryComponent = createCustomElement(EshopInventoryComponent, { injector: app.injector });
  customElements.define('eshop-inventory', eshopInventoryComponent);
})();
// const bootstrap = () => bootstrapApplication(AppComponent, appConfig);

// export default bootstrap;