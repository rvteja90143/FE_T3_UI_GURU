// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    custom_env: 'dev',
    ADOBE_LAUNCH_SCRIPT_URL: 'https://assets.adobedtm.com/81f4df3a67c9/365a87734159/launch-23b538d93ffe-development.min.js',
    MERKLE_LAUNCH_SCRIPT_URL: 'https://dealeradmindev.v2soft.com/js/merkle_widget.min.js',
    SHIFT_DIGITAL_LAUNCH_SCRIPT_URL: '//sdtagging-staging.azureedge.net/scripts/sd.js?containerId=STELLANTIS',
    //MERKLE_LAUNCH_SCRIPT_URL : 'http://localhost/merkel/merkle_widget.js',
    JQUERY_SCRIPT_URL: 'https://d1jougtdqdwy1v.cloudfront.net/js/vendor/jquery-3.3.1.min.js?cb=c3c2fa629852b7845959622bdcd0127b',
    KBB_APP_KEY: 'a8e677a8-c347-4c07-bd02-bf0b0f97c925',
    GA4: 'https://www.googletagmanager.com/gtag/js',

    BackendApi_Url: 'https://uat.e-shop.jeep.com',
    UsedBackendApi_Url: 'https://qa-jeep.eshopdemo.net',
    BackendApi_Url_Alfa: 'https://uat.drivealfaromeo.com'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
