import { AfterViewChecked, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Injectable, Input, NgZone, OnDestroy, OnInit, Output, PLATFORM_ID, QueryList, RendererFactory2, ViewChild, ViewChildren, ViewEncapsulation, Renderer2, HostListener, ApplicationRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataHandler } from './common/data-handler';
import { AppService } from './services/app.service';
import { RestService } from './services/rest.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { inherits } from 'util';
import { CommonModule, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { IdleService } from './ideal.service';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { AccessoriesComponent } from './accessories/accessories.component';
import { ServiceProtectionComponent } from './service-protection/service-protection.component';
import { SubmitToDealerComponent } from './submit-to-dealer/submit-to-dealer.component';
import { TradeInComponent } from './trade-in/trade-in.component';
import { leaseDatails, vehicleImages } from './common/data-models';
import { getDealerInfoAction, getDealerInfoActionSuccess, photoGalleryAction, resetGetDealerInfo, resetPhotoGallery, resetVehicleDetailsSpec, vehicleDetailsSpec } from './app-store/app-component-action';
import { Store, select } from '@ngrx/store';
import { dealerInfoDetailsNewResp, getPhotoGalleryAPIResp, getVehicleDetailsSpec } from './app-store/app-component-selector';
import { concat, Observable, Subject, fromEvent, Subscription } from 'rxjs';
//import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { take, takeUntil, timeInterval } from 'rxjs/operators';
import { error } from 'console';
import { MerkleHandler } from './common/merkle-handler';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MaterialModule } from './material/material.module';
import { PaymentOptionsComponent, PaymentSectionComponent } from "./payment-options/payment-options.component";
import { leaseDetailAction, resetLeaseDetail } from './common/store/lease-details/lease-details-action';
import { getLeaseDetailsState } from './common/store/lease-details/lease-details-selector';
import { ObservableLiveData } from './common/observable-live-data';
//import { PrequalifyComponent } from './prequalify/prequalify.component';
import { GAAnalyticsService } from './services/gaanalytics.service';
import { GADealerAnalyticsService } from './services/gadealeranalytics.service';
import { ShiftDigitalHandler } from './common/shift-digital';
import { EventEmitterService } from './event-emitter.service';
import { ReserveNowComponent } from './reserve-now/reserve-now.component';
import { PrivateOfferMessageDialog, TestDriveComponent } from './test-drive/test-drive.component';
import { ApplyCreditComponent } from './apply-credit/apply-credit.component';
import { DomSanitizer } from '@angular/platform-browser';
import { SubmitToDealerDialogComponent } from './submit-to-dealer-dialog/submit-to-dealer-dialog.component';
import { GA4Service } from './services/ga4.service';
import { GA4DealerService } from './services/ga4dealer.service';
//import { AscHandler } from './common/asc-handler';
import { GoogleAnalyticsHandler } from './common/googleanalytics-handler';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { ApplyCreditDialog } from './apply-credit/apply-credit-dialog';
import { AdobeSDGHandler } from './services/adobesdg.handler';
import { AdobeSDGService } from './services/adobesdg.service';
import { SharedService } from './shared.service';
import { resetCashDetail } from './common/store/cash-details/cash-details-action';
import { resetcreateLead } from './common/store/create-lead/createlead-action';
import { resetFinanceDetail } from './common/store/finance-details/finance-details-action';
import { resetServiceProtection, resetserviceContract, resetserviceContractCash, resetserviceContractFinance } from './service-protection/service-protection-store/service-protection-action';
import { NgbScrollSpy, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeResourceUrl } from '@angular/platform-browser';
declare const window: any;
import { Overlay } from '@angular/cdk/overlay';
import { GA4Handler } from './common/ga4-handler';
import { AscHandler } from './common/asc-handler';
import { PhoneFormatterDirective } from './common/directives/phone-formatter.directive';
interface DialogData {
    title: string;
    vin: string;
    dealercode: string;
    zipcode: string;
    vehicle_type: string;
}

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet,  CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})


export class AppComponent implements OnInit, AfterViewInit {
    @Input() dealercode!: string;
    @Input() vin!: string;
    @Input() zipcode!: string;
    @Input() vehicle_type!: string;
    
    @Input() defbutton! : string;

    private dialogRef: MatDialogRef<MainPageComponent> | null = null;
    title = 'EshopUs';
    ctaData: any;
    cta_Data: any;
    vehicle_data: any;
    page:any;
    private renderer: Renderer2;
    private isBrowser: boolean = false;
    env: any;
    displayCta :boolean = true;
    @ViewChild('elementBth', { static: false }) elementBth?: ElementRef;
    secondaryCTAList: { key: string; value: string }[] = [];
    secondaryCTAListSorted:  any;
    ip:any

 


ctaClicked:boolean = false; 
clickedButtonId: string | null = null;

onCTA(buttonId: string, page: string) {
  if (!this.ctaClicked) {
    this.ctaClicked = true;            
    this.clickedButtonId = buttonId; 
    console.log('page ' + page)  ;
    this.openDialog(page);             
  }
  
}

  openDialog1(type: string) {
    console.log('Opening dialog for:', type);
  }





    constructor(public dialog: MatDialog, private ga4dealerService: GA4DealerService, private elRef: ElementRef, private restService: RestService, private appService: AppService, private observableservice: ObservableLiveData,
        @Inject(PLATFORM_ID) private platformId: Object,  private eventEmitterService: EventEmitterService, public gaAnalyticsService: GAAnalyticsService, public adobeSDGService: AdobeSDGService,
        private store: Store<any>, private ngZone: NgZone, rendererFactory: RendererFactory2, public overlay: Overlay, private idealService: IdleService, private restservice: RestService) {
        this.env = environment.production;
        this.renderer = rendererFactory.createRenderer(null, null);
        this.isBrowser = isPlatformBrowser(platformId);
        this.loadBootstrapScripts();
        this.ctaClicked = false;
        if (this.vehicle_type !== undefined) {
            this.restService.set_vehicle_type(this.vehicle_type);

        }
        this.vehicle_type = this.vehicle_type?.toLowerCase()
       /* translate.setDefaultLang('en');
        translate.use('en');*/
        if (DataHandler.AdobeSDGScriptLoader == 0) {
            this.adobeSDGService.initAdobeSDGLaunchScript();
        }
        this.gaAnalyticsService.initGALaunchScript();
        //   DataHandler.reset();
        // this.eventEmitterService.reset();

    }

    getIp(){
        this.restService.getIpAddress().subscribe((res: any) => {
        this.ip = res.ip;
        DataHandler.ip_address = this.ip
        //console.log("IP:",this.ip)
        });
    }

    //Following is the Working Code for Tab/Browser Close
    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event: Event) {
        this.AbandonedLead();
    }


    AbandonedLead() {
        if (DataHandler.form_submitted == 0) {
            if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '') {
                DataHandler.form_submitted = 1;
                if (this.vehicle_type == 'new') {
                    DataHandler.currentSubmitType = 'auto';
                }
                else if (this.vehicle_type == 'used') {
                    DataHandler.currentSubmitType = 'auto';
                }
                DataHandler.hint_comments = 'App-Abendoned-Method-142'
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                });

            }
        }
    }

    loadScript(src: string, integrity?: string, crossorigin?: string): void {
        if (!this.isBrowser) return; // Prevent script loading on server
        const script = this.renderer.createElement('script');
        script.src = src;
        script.async = true;
        script.defer = true;
        if (integrity) script.setAttribute('integrity', integrity);
        if (crossorigin) script.setAttribute('crossorigin', crossorigin);
        this.renderer.appendChild(document.body, script);
    }

    loadBootstrapScripts(): void {
        // Load Google Fonts as stylesheets, not scripts (avoids MIME type errors)
        this.loadMaterialCSS('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
        this.loadMaterialCSS('https://fonts.googleapis.com/icon?family=Material+Icons');
        // this.loadScript(
        //     'https://code.jquery.com/jquery-3.2.1.slim.min.js',
        //     'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
        //     'anonymous'
        // );
        // this.loadScript(
        //     'https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js',
        //     'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q',
        //     'anonymous'
        // );
        // https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js
        // 'sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl',
        // this.loadScript(
        //     'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
        //     'sha384-Ho+pP8zL8R1fK3Fe2A8OPrwECzbmOpv0EVbXt0JLWuqCqfn8pWjUkn1XkAvL5dU5',
        //     'anonymous'
        // );
    }

    submitAbandonedLead() {
        if (DataHandler.form_submitted == 0) {

            if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '') {

                DataHandler.form_submitted = 1;
                if (this.vehicle_type == 'new') {
                    DataHandler.currentSubmitType = 'auto';
                }
                else if (this.vehicle_type == 'used') {
                    DataHandler.currentSubmitType = 'auto';
                }

                DataHandler.hint_comments = 'App-submitAbandonedLead-200'
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                    //  DataHandler.currentSubmitType = "";


                });
                return false;


            } else {
                //    DataHandler.form_submitted = 0;
                //DataHandler.currentSubmitType = "usr-x";
                if (this.vehicle_type == 'new') {
                    DataHandler.currentSubmitType = 'usr-x';
                }
                else if (this.vehicle_type == 'used') {
                    DataHandler.currentSubmitType = 'auto';
                }

            }

        } else {
            // DataHandler.form_submitted = 0;
            //DataHandler.currentSubmitType = "usr-x"; 
            if (this.vehicle_type == 'new') {
                DataHandler.currentSubmitType = 'usr-x';
            }
            else if (this.vehicle_type == 'used') {
                DataHandler.currentSubmitType = 'auto';
            }

        }
        return false;
    }

    ngAfterViewInit(): void {
         if(window.DDC == undefined  ){
            this.displayCta = true;
        }else{
            this.displayCta = false;
        }
        const heightB = this.elementBth?.nativeElement.offsetHeight;
        // console.log("Testysadas", heightB)

        if (isPlatformBrowser(this.platformId)) {
            DataHandler.isMobileScreen = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            );
        }
        if (DataHandler.dealer_cta[this.dealercode] == undefined) {
            DataHandler.dealer_cta[this.dealercode] = null;
        }
        if (DataHandler.dealer_cta[this.dealercode] == null) {
            DataHandler.dealer_cta[this.dealercode] = this.ctaData;
            if (this.dealercode != undefined) {
                this.appService.get_cta_config(this.dealercode, this.vin, this.vehicle_type).subscribe((response) => {
                    this.ctaData = response;
                    if (this.vehicle_type == '' || this.vehicle_type == null) {
                        this.vehicle_type = this.ctaData.custom_vehicle_type?.toLocaleLowerCase()
                    }
                    if (this.ctaData.dealer_type == undefined) {
                        this.ctaData.dealer_type = '';
                    }
                    if (this.ctaData != null && this.ctaData.button_image_url != '' && this.ctaData.button_image_url != null) {
                        if (this.ctaData.button_class == null) {
                            this.ctaData.button_class = '';
                            //this.ctaData.button_image_url = 'https://d1jougtdqdwy1v.cloudfront.net/images/widget_redesign/PaymentOptionsCTA1.svg';

                        }
                        if (this.ctaData.button_image_url == 'https://d1jougtdqdwy1v.cloudfront.net/images/widget_redesign/PaymentOptionsCTA1.svg') {
                            this.ctaData.defaultId = 'expressBtn_custom';
                        } else {
                            this.ctaData.defaultId = 'expressBtn';
                        }
                        // this.ctaData.button_image_url = 'https://d1jougtdqdwy1v.cloudfront.net/images/widget_redesign/PaymentOptionsCTA1.svg';
                    } else {
                        //this.ctaData = {};
                        this.ctaData.button_class = '';
                        this.ctaData.dealer_type = '';
                        this.ctaData.button_image_url = 'https://d1jougtdqdwy1v.cloudfront.net/images/widget_redesign/PaymentOptionsCTA1.svg';
                        this.ctaData.button_text = 'Payment options';
                        this.ctaData.defaultId = 'expressBtn_custom';
                    }
                    // Sort the secondar CTA to ascending order to display based on priority
                    this.secondaryCTAList =  this.ctaData.secondary_cta_order;
                    const sortedEntries = Object.entries(this.secondaryCTAList).sort((a, b) => {
                      return +a[1] - +b[1]; 
                        });
                    const keysOnly = sortedEntries.map(([key, _]) => key);
                    this.secondaryCTAListSorted =keysOnly
                });
            }
        } else {
            setTimeout(() => {
                this.ctaData = DataHandler.dealer_cta[this.dealercode];
                this.ctaData.defaultId = 'expressBtn';
            }, 2000);
        }
        if(this.defbutton !=undefined && this.defbutton.toLowerCase() == 'off'){
            var displayCta = document.getElementById(this.vin+'_widgetCta') as HTMLElement;
            displayCta.classList.add('hideCta')
        }
    }

    // private handleTabClose = (): void => {
    //     this.restService.submit_lead_details().subscribe({
    //         next: (response: any) => {
    //             console.log('Lead details submitted successfully on tab close.');
    //             DataHandler.currentSubmitType = '';
    //         },
    //         error: (err: any) => {
    //             console.error('Error submitting lead details on tab close:', err);
    //         }
    //     });
    // };

    ngOnInit() {
        this.getIp();
        this.observableservice.closeWidget$.subscribe(() => {
            this.ctaClicked=false;
            this.closeDialog();
        });

        this.eventEmitterService.closeMainDialog$.subscribe(() => {
            this.closeDialog();
        });

        if (isPlatformBrowser(this.platformId)) {
            this.loadMaterialCSS('https://fonts.googleapis.com/icon?family=Material+Icons');
            ShiftDigitalHandler.init(this.dealercode);
            //    this.eventEmitterService.reset();
            ShiftDigitalHandler.init(this.dealercode)
        }
        window['angularComponentReference'] = { component: this, zone: this.ngZone, loadAngularFunction: (vin: string, dealerCode: string, zipCode: string, firstname: string,lastname: string,email: string,phone: string,zpcode: string, dealerType: string, alstDesc: string, page: string, extra: string,vehicle_type: string,ft_id:string) => this.jsOpenDialog(vin, dealerCode, zipCode, firstname,lastname,email,phone, zpcode, dealerType, alstDesc, page, extra,vehicle_type,ft_id) };
        /*
        window.addEventListener('beforeunload', function (event) {
            alert(33333);
            ///this.AbandonedLead();
        });     
        */


    }

    loadMaterialCSS(url: string): void {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.appendChild(link);
    }

    // Method to disable background elements
disableBackgroundElements() {
    // Disable pointer events on the body to prevent clicks
    const bodyElement = document.body;
    bodyElement.style.pointerEvents = 'none';
    bodyElement.style.overflow = 'hidden';
    
    // Disable all buttons and clickable elements
    const allButtons = document.querySelectorAll('button, a, .inwidgetimage, [role="button"]');
    allButtons.forEach(button => {
        const el = button as HTMLElement;
        // Add a 'disabled' attribute
        el.setAttribute('disabled', 'true');
        // Store original pointer-events value to restore later
        el.dataset.originalPointerEvents = el.style.pointerEvents;
        // Disable pointer events
        el.style.pointerEvents = 'none';
        // Reduce opacity to visually indicate disabled state
        el.dataset.originalOpacity = el.style.opacity;
        el.style.opacity = '0.6';
    });
    
    // Re-enable pointer events for the overlay container after a short delay
    setTimeout(() => {
        const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
        if (overlayContainer) {
            overlayContainer.style.pointerEvents = 'auto';
            
            // Re-enable all elements inside the overlay
            const overlayElements = overlayContainer.querySelectorAll('button, a, [role="button"]');
            overlayElements.forEach(element => {
                const el = element as HTMLElement;
                el.removeAttribute('disabled');
                el.style.pointerEvents = 'auto';
                el.style.opacity = '1';
            });
        }
    }, 100);
}

    // Method to disable background elements
    // disableBackgroundElements() {
    //     const bodyElement = document.body;
    //     bodyElement.style.pointerEvents = 'none';
    //     bodyElement.style.overflow = 'hidden';
        
    //     // Re-enable pointer events for the overlay container
    //     setTimeout(() => {
    //         const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
    //         if (overlayContainer) {
    //             overlayContainer.style.pointerEvents = 'auto';
    //         }
    //     }, 100);
    // }

    // Method to re-enable background elements
    // enableBackgroundElements() {
    //     const bodyElement = document.body;
    //     bodyElement.style.pointerEvents = 'auto';
    //     bodyElement.style.overflow = 'auto';
    // }

    // Method to re-enable background elements
enableBackgroundElements() {
    // Re-enable pointer events on the body
    const bodyElement = document.body;
    bodyElement.style.pointerEvents = 'auto';
    bodyElement.style.overflow = 'auto';
    
    // Re-enable all buttons and clickable elements
    const allButtons = document.querySelectorAll('button, a, .inwidgetimage, [role="button"]');
    allButtons.forEach(button => {
        const el = button as HTMLElement;
        // Remove the disabled attribute
        el.removeAttribute('disabled');
        // Restore original pointer-events value if available
        if (el.dataset.originalPointerEvents) {
            el.style.pointerEvents = el.dataset.originalPointerEvents;
            delete el.dataset.originalPointerEvents;
        } else {
            el.style.pointerEvents = 'auto';
        }
        // Restore original opacity if available
        if (el.dataset.originalOpacity) {
            el.style.opacity = el.dataset.originalOpacity;
            delete el.dataset.originalOpacity;
        } else {
            el.style.opacity = '1';
        }
    });
    
    // Set a flag to indicate the wizard is closed
    this.ctaClicked = false;
    this.clickedButtonId = null;
}

    closeDialog() {
        
        if (this.dialogRef) {
            clearTimeout(DataHandler.clearInitialTimer)
            this.idealService.onClose();
            this.restService.setVisiblePopUp(false);
            this.enableBackgroundElements(); // Re-enable background elements
            this.dialogRef.close();
            this.dialogRef = null;
            /* setTimeout(() => {
                 DataHandler.initialleasecall = false;
                 this.store.dispatch(resetPhotoGallery());
                 this.store.dispatch(resetGetDealerInfo());
                 this.store.dispatch(resetVehicleDetailsSpec());
                 this.store.dispatch(resetCashDetail());
                 this.store.dispatch(resetcreateLead());
                 this.store.dispatch(resetFinanceDetail());
                 this.store.dispatch(resetLeaseDetail());
                 this.store.dispatch(resetServiceProtection());
                 this.store.dispatch(resetserviceContract());
                 this.store.dispatch(resetserviceContractFinance());
                 this.store.dispatch(resetserviceContractCash());
                 //this.handleTabClose();
                 this.eventEmitterService.reset();  
             }, 1000)*/
        }
    }



  openDialog(page: string = '') {
    debugger;
    // existing code remains exactly as you have it
    var gtag_script = document.createElement('script');
    gtag_script.setAttribute('src', 'https://dealeradmin.drivefca.com/js/gtag_inwidget.js');
    document.head.appendChild(gtag_script);

    this.page = page;
    DataHandler.dealer_cta[this.dealercode] = this.ctaData;
    this.ctaData.dealercode_gtag = this.dealercode;

    if ((this.vehicle_type == undefined || this.vehicle_type == '') ||
        (this.vehicle_type?.toLowerCase() != 'new' &&
         this.vehicle_type?.toLowerCase() != 'used' &&
         this.vehicle_type?.toLowerCase() != 'cpo')) {
      this.appService.get_cta_config(this.dealercode, this.vin, '')
        .subscribe((response) => {
          this.cta_Data = response;
          this.vehicle_type = this.cta_Data.custom_vehicle_type?.toLocaleLowerCase();
        });

      setTimeout(() => {
        this.openWidgetDialog();
      }, 1000);
    } else {
      this.openWidgetDialog();
    }
  }


    openWidgetDialog() {
        debugger;
        if(DataHandler.isWidgetOpen){
            document.getElementById('mainwidgetCloseButton')?.click();
            DataHandler.isWidgetOpen = false;
        }
       
        DataHandler.reset();
        DataHandler.initialleasecall = false;
        this.store.dispatch(resetPhotoGallery());
        this.store.dispatch(resetGetDealerInfo());
        this.store.dispatch(resetVehicleDetailsSpec());
        this.store.dispatch(resetCashDetail());
        this.store.dispatch(resetcreateLead());
        this.store.dispatch(resetFinanceDetail());
        this.store.dispatch(resetLeaseDetail());
        this.store.dispatch(resetServiceProtection());
        this.store.dispatch(resetserviceContract());
        this.store.dispatch(resetserviceContractFinance());
        this.store.dispatch(resetserviceContractCash());
        //this.handleTabClose();
        this.eventEmitterService.reset();
        DataHandler.page = this.page
        //this.observableservice.reset();  
        setTimeout(() => {
            if (this.zipcode.length == 4) {
                this.zipcode = "0" + this.zipcode
            }
            DataHandler.vin = this.vin
            DataHandler.dealercode = this.dealercode
            DataHandler.dealer = this.dealercode
            console.log("1vin:", DataHandler.vin, DataHandler.dealer)
            this.zipcode = this.zipcode.split('-')[0].trim();
            DataHandler.zipcode = this.zipcode.trim()
            DataHandler.actualVehicleType = this.vehicle_type.toLowerCase();
            let vehicle_type = this.vehicle_type
            if (this.vehicle_type?.toLowerCase() == 'cpo' || this.vehicle_type?.toLowerCase() == 'cpov')
                vehicle_type = 'used';
             DataHandler.isWidgetOpen = true;
             const links = document.querySelectorAll('.inwidgetimage');
                links.forEach(link => {
                     const el = link as HTMLElement;
                        // Add a 'disabled' attribute (for custom styling or logic)
                        el.removeAttribute('disabled');         
                        el.style.pointerEvents = "auto";
                        el.style.opacity = "1";                                
                });
            this.dialogRef = this.dialog.open(MainPageComponent, {
                panelClass: ['widgetMobile', 'widgetDesktop'],
                data: {
                    dealercode: this.dealercode,
                    vin: this.vin,
                    zipcode: this.zipcode.trim(),
                    vehicle_type: vehicle_type
                },
                position: {
                    top: '10px',
                    left: '10px',
                },
                width: '85vw',
                // height: 'auto',
                hasBackdrop: true,
                disableClose: true,
                scrollStrategy: this.overlay.scrollStrategies.block()
                // disableClose:true // Uncomment this after adding close button to the popup
            });
            
            // Disable background elements after dialog opens
            this.disableBackgroundElements();
            
            let mainWidget = <HTMLScriptElement>document.getElementsByClassName('widgetMobile')[0].parentElement?.parentElement;
            mainWidget.classList.add("widgetMobile-cdk-container");
            let gtag_script = document.createElement('script');
            gtag_script.setAttribute('src', 'https://dealeradmin.drivefca.com/js/gtag_inwidget.js');
            document.head.appendChild(gtag_script);
           
            this.dialogRef.afterClosed().subscribe((result) => {
                if (DataHandler.form_submitted == 0) {
                    ShiftDigitalHandler.shiftdigitalexecutor('drop save');
                }
                AscHandler.Ascexecutor('widget-close');
            });
        }, 200)

    }

    jsOpenDialog(vin: any, dealercode: any, zipcode: any,firstname: string,lastname: string,email: string,phone: string,zpcode: string = '',dealerType:any, alstDesc:any, page:any, extra:any,vehicle_type: any,ft_id:any) {
        console.log('vin',vin,"dealercode:",dealercode,"zipcode",zipcode,"firstname",firstname,"lastname",lastname,"email",email,"phone",phone,"zpcode",zpcode,"dealerType",dealerType,"alstDesc",alstDesc,"page",page,"extra",extra,"vehicle_type",vehicle_type,"ft_id:",ft_id)
         if(DataHandler.isWidgetOpen){
            document.getElementById('mainwidgetCloseButton')?.click();
            DataHandler.isWidgetOpen = false;
        }
        DataHandler.reset();        
        DataHandler.initialleasecall = false;
        this.store.dispatch(resetPhotoGallery());
        this.store.dispatch(resetGetDealerInfo());
        this.store.dispatch(resetVehicleDetailsSpec());
        this.store.dispatch(resetCashDetail());
        this.store.dispatch(resetcreateLead());
        this.store.dispatch(resetFinanceDetail());
        this.store.dispatch(resetLeaseDetail());
        this.store.dispatch(resetServiceProtection());
        this.store.dispatch(resetserviceContract());
        this.store.dispatch(resetserviceContractFinance());
        this.store.dispatch(resetserviceContractCash());
        //this.handleTabClose();
        this.eventEmitterService.reset();
        //this.observableservice.reset(); 
         this.zipcode = zipcode;
        if(DataHandler.zipcode != null && DataHandler.zipcode != ''){
            this.zipcode =DataHandler.zipcode
        }
        DataHandler.page = page;
       
       if (firstname != '' && lastname != '' && email != '') {
                DataHandler.firstname = firstname;
                DataHandler.lastname = lastname;
                DataHandler.email = email;
                DataHandler.phone = phone;
               this.zipcode  = DataHandler.zipcode = zpcode;
                
        }
        setTimeout(() => {
            if (this.zipcode.length == 4) {
                this.zipcode = "0" + this.zipcode
            }
            DataHandler.ft_id = ft_id
            DataHandler.vin = vin
            DataHandler.dealer = dealercode
            DataHandler.dealercode = dealercode
            if(dealerType?.toLowerCase() == 'alst' || alstDesc?.toLowerCase() == 'alst'){
            DataHandler.sourceType = 'alst';
            }
             if(dealerType?.toLowerCase() == 'fullpath' || alstDesc?.toLowerCase() == 'fullpath'){
            DataHandler.sourceType = 'fullpath';
            }
            console.log("2vin:", DataHandler.vin, DataHandler.dealer)
            this.vehicle_type = vehicle_type;
            console.log("vehicle_type",this.vehicle_type)
            if ((this.vehicle_type == undefined || this.vehicle_type == '') || (this.vehicle_type?.toLowerCase() != 'new' && this.vehicle_type?.toLowerCase() != 'used' && this.vehicle_type?.toLowerCase() != 'cpo')) {
                this.appService.get_cta_config(this.dealercode, this.vin, '').subscribe((response) => {
                    this.cta_Data = response;
                    this.vehicle_type = this.cta_Data.custom_vehicle_type?.toLocaleLowerCase()
                    console.log("vehicle:",this.vehicle_type)
                });
                
            } 
            setTimeout(()=>{
                this.vin = vin;
            this.dealercode = dealercode;
            this.zipcode = this.zipcode.split('-')[0].trim();
            DataHandler.zipcode = this.zipcode
            DataHandler.actualVehicleType = this.vehicle_type.toLowerCase();
            if (this.vehicle_type.toLowerCase() == 'cpo' || this.vehicle_type.toLowerCase() == 'cpov')
                this.vehicle_type = 'used';
            DataHandler.isWidgetOpen = true;
            console.log("veh",this.vehicle_type)
             const links = document.querySelectorAll('.inwidgetimage');
                links.forEach(link => {
                 const el = link as HTMLElement;
            // Add a 'disabled' attribute (for custom styling or logic)
            el.removeAttribute('disabled');         
             el.style.pointerEvents = "auto";
            el.style.opacity = "1";                       
        });
            this.dialogRef = this.dialog.open(MainPageComponent, {
                panelClass: ['widgetMobile', 'widgetDesktop'],
                data: {
                    dealercode: this.dealercode,
                    vin: this.vin,
                    zipcode: this.zipcode,
                    vehicle_type: this.vehicle_type
                },
                position: {
                    top: '10px',
                    left: '10px',
                },
                width: '85vw',
                // height: 'auto',
                hasBackdrop: true,
                disableClose: true,
                scrollStrategy: this.overlay.scrollStrategies.block()

                // disableClose:true // Uncomment this after adding close button to the popup
            });
            
            // Disable background elements after dialog opens
            this.disableBackgroundElements();
            
            let mainWidget = <HTMLScriptElement>document.getElementsByClassName('widgetMobile')[0].parentElement?.parentElement;
            mainWidget.classList.add("widgetMobile-cdk-container");
            let gtag_script = document.createElement('script');
            gtag_script.setAttribute('src', 'https://dealeradmin.drivefca.com/js/gtag_inwidget.js');
            document.head.appendChild(gtag_script);

            },2000)
            
            // setTimeout(() => {
            //     // this.ga4dealerService.submit_to_api_ga4dealer('WidgetStart').subscribe((response: any) => { });
            //     // this.ga4dealerService.fire_asc_events('WidgetStart').subscribe((response: any) => { });
            //     // this.ga4dealerService.fire_asc_events('WidgetStartone').subscribe((response: any) => { });
            // }, 3000);

        }, 200)

    }


}


@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'app-certified',
    standalone: true,
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class AppCertifiedComponent extends AppComponent {

}

@Injectable({
    providedIn: 'root',
})
@Component({
    selector: 'eshop-inventory',
    standalone: true,
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class EshopInventoryComponent extends AppComponent {

}


@Component({
    selector: 'header-template',
    standalone: true,
    templateUrl: './header.template.html',
    imports: [MaterialModule, PhotoGalleryComponent]
})

export class HeaderComponent implements OnInit {

    vehicleInfo: any;
    dealerInfo: any;
    display_vehicle_name: string | undefined;
    msrp: any;
    vin: any;
    @Output() showTestDrive: EventEmitter<void> = new EventEmitter<void>();
    displayTestDrive: boolean = true;
    public unsubscribe$: Subject<void> = new Subject<void>();
    veh_images: any;
    ind: number = 0;
    dealerprice: any;
    vehicle_type: any;
    showTestDriveBtn: any;
    TestDrive: any;
    hidePayment = false;
    redirectionURL: any;
    vehicle_data: any;
    leaseListPrice : any
    financeListPrice : any
    cashListPrice : any
    ListPrice : any

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private restService: RestService, public dialogRef: MatDialogRef<AppComponent>, rootRenderer: RendererFactory2, private idleService: IdleService, private store: Store<any>, public gaDealerAnalyticsService: GADealerAnalyticsService, private observableService: ObservableLiveData) {
        this.observableService.displayTestDrive$.subscribe((value) => {
            this.displayTestDrive = value
        });

        this.dealerprice = DataHandler.dealerprice;
        this.vehicle_type = DataHandler.vehicle_type;
        
    }
    ngOnInit() {
        this.observableService.selectedPaymentType$.subscribe((value)=>{
            if(value.toLowerCase() == 'lease'){
              this.observableService.leaseListPrice$.subscribe((value) =>{
              this.ListPrice = value
            });
             
            }else if(value.toLowerCase() == 'finance'){
                this.observableService.financeListPrice$.subscribe((value) =>{
                this.ListPrice = value
            })

            }else if(value.toLowerCase() == 'cash'){
                this.observableService.cashListPrice$.subscribe((value) =>{
                this.ListPrice = value
            })
            }
        })

        this.vin = DataHandler.vin;
        this.redirectionURL = 'https://www.jeep.com/hostd/windowsticker/getWindowStickerPdf.do?vin=' + this.vin
       
        // console.log("vin",this.vin);
        this.observableService.hideCalcSubject$.subscribe(value => {
            if (value !== null && value !== undefined) {
                this.hidePayment = value;
            }
        });
        this.observableService.showTestDriveSubject$.subscribe((value) => {
            this.TestDrive = value
        })


        if (DataHandler.vehicle_type == 'used' || DataHandler.vehicle_type == 'cpo' || DataHandler.vehicle_type == 'cpov') {
            this.veh_images = DataHandler.photoGalleryImages;
            this.display_vehicle_name = DataHandler.display_vehicle_name;
            DataHandler.defaultPayment = 'finance'
            this.observableService.setLeaseResponseStatus(false);
            if (this.vehicle_type === 'used') {
                this.restService.get_used_photogallary_images(this.data.dealercode, this.data.vin).subscribe((response) => {
                    this.vehicle_data = response;
                    var obj = JSON.parse(JSON.stringify(this.vehicle_data));
                    DataHandler.trim = obj.result.trim_desc;
                    DataHandler.customize_testdrive = obj.result.delivery_status_customize_testdrive;
                    this.showTestDriveBtn = DataHandler.customize_testdrive;
                });
            }
        }
        else {
            this.store
                .pipe(select(getPhotoGalleryAPIResp), takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (data: any) => {
                        let response = data.photoGallery[0];
                        this.display_vehicle_name = response?.display_vehicle_name;
                        DataHandler.base_msrp = this.msrp = response?.msrp;
                        DataHandler.defaultPayment = response?.default_payment_mode
                        DataHandler.current_session = response?.current_session_pre_qual;
                        DataHandler.currentSession_PrivateOffer = DataHandler.current_session
                        DataHandler.GA4_measurement_id = response.ga4_measurement_id;
                        DataHandler.customize_testdrive = response.delivery_status_customize_testdrive;
                        this.showTestDriveBtn = response.delivery_status_customize_testdrive;
                        DataHandler.trim = encodeURIComponent(response?.trim_desc);
                        this.veh_images = response?.photo_images;
                        this.gaDealerAnalyticsService.initGADealerLaunchScript();

                    },

                    error: (e: any) => console.error(e),
                });
        }

    }

    invokeTestDrive() {
        //document.getElementById('testDriveButton')?.click();
        this.adobe_sdg_event("test-drive", "interaction-click");
        this.showTestDrive.emit();
        this.adobe_sdg_event("test-drive", "page-load");
    }
    closeWidget() {

        this.observableService.closeWidget();

    }
  
    public adobe_sdg_event(event_type: any, event_name: any = 'click', param: any = '') {
        // console.log('HeaderComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            pageLoad.site = "dealer";
            interactionClick.site = "dealer";
            interactionClick.type = "func";
            interactionClick.location = "vehicle-information";
            interactionClick.name = "test-drive";

            if (event_type === "test-drive") {
                if (event_name === "page-load") {
                    pageLoad.pageType = "overlay";
                    pageLoad.pageName = "schedule-a-test-drive";
                    DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                    AdobeSDGHandler.eventLogger("page-load", pageLoad);
                }

                if (event_name === "interaction-click") {
                    interactionClick.description = null;
                    AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
                }
                return;
            }

        } catch (e) {
            console.log('HeaderComponent-adobe_sdg_event issue', e);
        }
    }
}


@Component({
    selector: 'detailspage-template',
    standalone: true,
    templateUrl: './detailspage.template.html',
    imports: [MaterialModule, PaymentOptionsComponent]
})

export class DetailsPageComponent {
    vehicleInfo: any;
    dealerInfo: any;
    public unsubscribe$: Subject<void> = new Subject<void>();
    vehicleSpec: any;
    detailspresent: any;
    specs: any;
    step: number = 0;
    vehicleSpecsOpen: boolean = false;
    activeTab: any;
    vin: any;
    dealer: any;
    customerstate: any;
    vehicle_type: any;
    countycity: any;
    currentSession: any;
    vehicle_specification: any;
    toggleDetailedSpecs: boolean = false;
    phoneNumber: any = '';
    @Output() accordionExpanding = new EventEmitter<boolean>();
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private ga4dealerService: GA4DealerService, private restService: RestService, public dialogRef: MatDialogRef<AppComponent>, rootRenderer: RendererFactory2, private idleService: IdleService, private store: Store<any>, private observableService: ObservableLiveData,
        private ga4Service: GA4Service) {
        this.vehicle_type = data.vehicle_type?.toLowerCase()
    }

    ngOnInit() {
        this.specs = [];
        this.observableService.selectedPaymentType$.subscribe((value) => {
            this.activeTab = value
        });

        this.vehicleInfo = DataHandler.vehicle_info;
        if (this.vehicle_type == 'new') {
            this.store.dispatch(vehicleDetailsSpec({ vin: this.data.vin }));
        }
        if (this.vehicle_type == 'used') {
            this.restService.get_Used_Vehicle_Details_Spec(this.vin).subscribe((response) => {
                this.vehicle_specification = response;
                var obj = JSON.parse(JSON.stringify(this.vehicle_specification));
                this.vehicle_specification = obj?.result?.vehicle_spec?.vds_group_data?.length;
                if (obj?.result?.vehicle_spec?.vds_group_data?.length > 0) {
                    this.specs = obj?.result?.vehicle_spec?.vds_group_data;
                };
            });

            this.restService.get_Used_DealerInfo(this.data.vin, this.data.dealercode).subscribe((response: any) => {
                DataHandler.vehicle_info = this.vehicleInfo = response.result.vehicle_information;
            });
        }

    }


    ngAfterViewInit() {
        this.phoneNumber = DataHandler.dealerinfo?.phoneNumber;

        if (this.vehicle_type == 'new') {
            this.store
                .pipe(select(getVehicleDetailsSpec), takeUntil(this.unsubscribe$))
                .subscribe({
                    next: ((data: any) => {
                        let obj = JSON.parse(JSON.stringify(data));
                        this.detailspresent = obj?.vehicle_spec?.vds_group_data?.length;
                        if (obj?.vehicle_spec?.vds_group_data?.length > 0) {
                            this.specs = obj?.vehicle_spec?.vds_group_data;

                        };

                    }), error: ((error: any) => {
                        console.log("error", error)
                    })
                });
        }
        if (this.vehicle_type == 'used') {
            this.restService.get_Used_Vehicle_Details_Spec(this.vin).subscribe((response) => {
                this.vehicle_specification = response;
                var obj = JSON.parse(JSON.stringify(this.vehicle_specification));
                this.vehicle_specification = obj?.result?.vehicle_spec?.vds_group_data?.length;
                if (obj?.result?.vehicle_spec?.vds_group_data?.length > 0) {
                    this.specs = obj?.result?.vehicle_spec?.vds_group_data;
                };
            });
        }

        this.store
            .pipe(select(dealerInfoDetailsNewResp), takeUntil(this.unsubscribe$))
            .subscribe({
                next: (data: any) => {
                    this.vehicleInfo = data.dealerDetails[0]?.vehicle_information;
                    DataHandler.dealerstate = data.dealerDetails[0]?.Dealer_info.dealerState

                }, error: (error: any) => {
                    // Do nothing
                }
            });
        // this.store
        // .pipe(select(getLeaseDetailsState), takeUntil(this.unsubscribe$))
        // .subscribe({ 
        //   next: (data) => { 
        //   },error:(error)=>{
        //         // Do nothing
        //   }
        //   });
        this.adobe_sdg_event("vehicle-details", 'page-load');
        setTimeout(() => {
            this.phoneNumber = DataHandler.dealerinfo?.phoneNumber;

            //  console.log("Test vehicle-details 11111111111111")
        }, 3000);
    }

    changeStep(index: number, tab_header: any, isClosed: any = false) {
        let event_name = 'expand-vehicle-detail-spec';
        this.step = index;

        if (event_name) {
            this.adobe_sdg_event(event_name, 'interaction-click', tab_header);
        }
    }

    setStep(index: number) {
        this.step = index;
    }

    paymentSelctionChange(event: any) {
        this.observableService.setSelectedPaymentType(event);
    }

    // public dispatchLeaseDetailsAPICall(
    //   zipcode: string,
    //   downpayment: string,
    //   tradein: string,
    //   terms: string,
    //   mileage: string,
    //   ids: string,
    //   step: string,
    //   state: string,
    //   county: string,
    //   iscustomzip: string,
    //   lender_code: string
    // ) { 
    //   let leaseDetailsPayload: leaseDatails = {
    //     vin: DataHandler.vin,
    //     dealercode: DataHandler.dealercode,
    //     zipcode: zipcode,
    //     msrp: !this.isValueEmpty(DataHandler.base_msrp)
    //       ? parseInt(DataHandler.base_msrp)
    //       : Number('0'),
    //     transactionType: 'lease',
    //     tiers: '1',
    //     loading: step,
    //     tradein: !this.isValueEmpty(tradein) ? parseInt(tradein) : 0,
    //     prevtradein: DataHandler.prevtradeinlease,
    //     term: terms,
    //     mileage: mileage,
    //     down: downpayment,
    //     prevdown: DataHandler.prevdownlease,
    //     selectedIds: ids,
    //     is_widget: 'Y',
    //     dealer_discount_available: DataHandler.dealerdiscount,
    //     user_service_a_protection: DataHandler.serviceleaseIds,
    //     customer_state: this.customerstate,
    //     customer_county_city: this.countycity,
    //     is_customer_zipcode: iscustomzip,
    //     current_session:   DataHandler.current_session,
    //     get_down_pay_from_ui: DataHandler.get_down_pay_from_ui,
    //     sltMoparAcc: DataHandler.moparid,
    //     lender_code:   'US-169'
    //   };
    //   this.store.dispatch(leaseDetailAction({ payload: leaseDetailsPayload }));
    // }


    isValueEmpty(val: any): any {
        if (
            val === 'undefined' ||
            val === 'null' ||
            val === '0' ||
            val === undefined ||
            val === null ||
            val === 0 ||
            val === '' ||
            val === '∞' ||
            val === '$0'
        ) {
            return true;
        }
        return false;
    }

    detailedSpecClick() {
        //DataHandler.userInteraction = true; 
        this.toggleDetailedSpecs = !this.toggleDetailedSpecs;
        GoogleAnalyticsHandler.googleAnalyticsExecutor('VehicleInformation-GaGoal');
        this.ga4Service.submit_to_api('VehicleInformation', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('VehicleInformation').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('VehicleInformation').subscribe((response: any) => { });
        if (this.toggleDetailedSpecs) {
            this.adobe_sdg_event("view-detailed-specs");
        } else {
            this.adobe_sdg_event("hide-detailed-specs");
        }
    }

    public adobe_sdg_event(event_type: any, event_name: any = 'click', param: any = '') {
        //  console.log('DetailsPageComponent-', event_type, event_name);
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };

            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            pageLoad.site = "dealer";
            if (event_type == 'vehicle-details' && event_name === "page-load") {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:vehicle-details";
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }
            interactionClick.site = "dealer";
            interactionClick.type = "func";
            interactionClick.location = "vehicle-information";
            interactionClick.page = "build-your-deal:vehicle-details";
            if (event_type === 'test-drive') {
                interactionClick.name = "test-drive";
            }
            if (event_type === 'view-detailed-specs') {
                interactionClick.description = null;
                interactionClick.name = "view-detailed-specs";
            }
            if (event_type === 'hide-detailed-specs') {
                interactionClick.description = null;
                interactionClick.name = "hide-detailed-specs";
            }

            if (event_type === 'call-vehicle-detail-empty') {
                interactionClick.description = "";
                interactionClick.name = "call-for-information";
            }

            if (event_type === 'expand-vehicle-detail-spec') {
                interactionClick.description = 'expand-' + param.toLocaleLowerCase();
                interactionClick.name = "vehicle-details-specs";
            }

            if (event_type === 'collapsed-vehicle-detail-spec') {
                interactionClick.description = 'collapsed-' + param.toLocaleLowerCase();
                interactionClick.name = "vehicle-details-specs";
            }

            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);

        } catch (e) {
            console.log('DetailsPageComponent-adobe_sdg_event issue', e);
        }
    }
}

@Component({
    selector: 'mainpage-template',
    standalone: true,
    imports: [NgbScrollSpyModule, DetailsPageComponent, AccessoriesComponent, ServiceProtectionComponent, SubmitToDealerComponent, SubmitToDealerDialogComponent, TradeInComponent, HeaderComponent,
        PaymentOptionsComponent, MaterialModule, PaymentSectionComponent, ApplyCreditComponent, TestDriveComponent, ReserveNowComponent], //PrequalifyComponent,
    templateUrl: './mainpage.template.html',
})

@Injectable({ providedIn: 'root' })
export class MainPageComponent implements OnInit, AfterViewChecked, OnDestroy {
    @ViewChildren('detailsSection, tradeSection, protectionSection, protectionAccessoriesSection, accessoriesSection, submitSection')
    sections!: QueryList<ElementRef>;
    isMobileScreen: boolean | undefined;
    renderer: any;
    jeepLogo: string | undefined;
    eshopLogo: string | undefined;
    vin: any
    year: any;
    msrp: string | undefined;
    display_vehicle_name: string | undefined;
    vehicle_data: any;
    vehicle_msrp: any;
    dealer_phone: any;
    no_inventory_message: string | undefined;
    is_phone_available: boolean | undefined;
    loaded: number = 0;
    vehicle_monthly: any;
    dealername: any;
    dealerInfo: any;
    vehicleinfo: any;
    tradeinpar: any;
    selectedPaymentType: any
    previousZipCode: any;
    vehicle_info: any;
    public unsubscribe$: Subject<void> = new Subject<void>();
    vehicle_type!: string;
    showHowItWorks: number = 0;
    make_video: any;
    showTestDrive: boolean = false;
    // public prequalifyBtn = false;
    // showPreQualify: boolean = false;
    showReserveNowComponent: boolean = false;
    dealerinforesponse: any;
    logourl: string = '';
    public isApplyCreditClicked = false;
    showApplyCreditComponent: boolean = false;
    autofiEnable: any;
    iframeurl: any;
    showHideMainContent: boolean = false;
    submitTab: boolean = false;
    vehicle_img: any;
    isOpenInitialPopup: boolean = false;
    vehicle_model: any;
    selected = new FormControl(0);
    make_url: any = ''
    displaySP: any = '';
    reserveNowButtonText: string = 'Reserve';
    reserveNowButtonStatus: string = 'disable';
    dealerprice: any;
    showTestDriveBtn: any;
    customize_reservation: any;
    registerForm!: FormGroup;
    isValidFlg = true;
    formSubmitted: boolean = false;
    hidebackbutton = false;
    vehicleOnce = false;
    //showoverlay = true
    intervel: any;
    @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
    @ViewChild('elementBth', { static: false }) elementBth?: ElementRef;
    @ViewChild('accessaries1', { static: false }) accessaries1?: ElementRef;

    isFormPristine: boolean = true;

    dateValue: any = null;
    timeValue: any = null;
    accessoriesClicked = false;
    isTabClick = false;
    public isAccessoriessScrolled: boolean = false;
    private destroy$ = new Subject<void>();
    widgetCloseBtn: boolean = false;
    isAccordionExpanding: boolean = false;
    page:string =''
    paypal_onboarding_status: any;
    is_reserve_button_enable: any;
    submitDialogOpened: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private restService: RestService, public dialogRef: MatDialogRef<AppComponent>, rootRenderer: RendererFactory2, private ga4dealerService: GA4DealerService, private idleService: IdleService, private store: Store<any>,
        private observableService: ObservableLiveData, private gaDealerAnalyticsService: GADealerAnalyticsService, private dom: DomSanitizer, private eventEmitterService: EventEmitterService, private sharedService: SharedService, public overlay: Overlay,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private viewportScroller: ViewportScroller,
        private ga4Service: GA4Service,
        private renderer1: Renderer2,
         private ngZone: NgZone
    ) {
        this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);

        this.observableService.backbutton$.subscribe(() => {
            this.closeApplycredit();
        })

        this.observableService.hideBackButton$.subscribe((value) => {
            this.hidebackbutton = value
        })
           this.eventEmitterService.displayMainContentView.subscribe((name: string) => {
            this.showMainContent()
        });
        this.eventEmitterService.closeWidgetSDG.subscribe(() => {
            this.closeWidgetSDG();
        })
          this.observableService.setWidgetCloseBtn$.subscribe((value:any) => {
            this.widgetCloseBtn = value;
        })

         this.eventEmitterService.loadSDGVehicleDetails.subscribe(()=>{
            this.sdgPageLoad();
        })

        this.eventEmitterService.closeMainDialogSDG$.subscribe(() => {
            this.closeDialog();
            // this.ga4dealerService.submit_to_api_ga4dealer('widget-close').subscribe((response: any) => { });
            // this.ga4dealerService.fire_asc_events('widget-close').subscribe((response: any) => { });
        })
        this.observableService.backbutton$.subscribe(() => {
            this.closeApplycredit();
        })

        this.observableService.selectedPaymentType$.subscribe((value: any) => {
            this.selectedPaymentType = value
        });
        this.observableService.getShowTestDrive$.subscribe((value: any) => {
            this.showTestDrive = value
        });
        if ((this.data.vin.substring(0, 3) == 'ZAS') || (this.data.vin.substring(0, 3) == 'ZAR'))
            DataHandler.make_url = "ALFA";
        else
            DataHandler.make_url = "JEEP";

        this.observableService.setFormSubmitted$.subscribe((value) => {
            this.formSubmitted = value;
        });

        this.restService.accessoriesClicked$.subscribe(
            (value) => (this.accessoriesClicked = value)
        );
        
        setTimeout(() => {
            MerkleHandler.merkleexecutor('page-load');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('page-load');
            // this.ga4dealerService.submit_to_api_ga4dealer('WidgetStart').subscribe((response: any) => { });
            // this.ga4dealerService.fire_asc_events('WidgetStart').subscribe((response: any) => { });
            // this.ga4dealerService.fire_asc_events('WidgetStartone').subscribe((response: any) => { });
        }, 3000);
        setTimeout(() => {
            let widgetPageloadFired = false;

            function firePageViewEventIfNotFiredAlready() {
                if (!widgetPageloadFired) {
                    ShiftDigitalHandler.pageload('widget open');
                    widgetPageloadFired = true;
                    // Optionally, log to the console for debugging
                    // console.log('Page view event fired');
                } else {
                    // Optionally, log to the console when it's skipped
                    // console.log('Page view event already fired, skipping');
                }
            }
            AscHandler.Ascexecutor('widget-load');

            ShiftDigitalHandler.shiftdigitalexecutor('CTA click');
            ShiftDigitalHandler.shiftdigitalexecutor('impression');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('page-load');
            ShiftDigitalHandler.shiftdigitalexecutor('lead form show');
            ShiftDigitalHandler.shiftdigitalexecutor('open Review Payment option');
        }, 2000);
    }

    AbandonedLead() {
        if (DataHandler.form_submitted == 0) {
            if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '') {
                DataHandler.form_submitted = 1;
                if (this.vehicle_type == 'new') {
                    DataHandler.currentSubmitType = 'auto';
                }
                else if (this.vehicle_type == 'used') {
                    DataHandler.currentSubmitType = 'auto';
                }
                DataHandler.hint_comments = 'App-AbandonedLead-1062'
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                });
                // return false;


            }

        }

    }
    
    deliveryChangesStatus: number = 1;

    onFormStatusChange(event: { date: any, time: any, pristine: boolean }) {
        this.dateValue = event.date;
        this.timeValue = event.time;
        this.isFormPristine = event.pristine;
    }

    navigateToSubmitTabs() {
        if (this.tabGroup) {
            const submitTabIndex = this.tabGroup._tabs.toArray().findIndex(tab => tab.textLabel === 'Submit');
            if (submitTabIndex !== -1) {
                this.selectedTabIndex = submitTabIndex;
            } else {
                console.warn('Submit tab not found!');
            }
        }
    }

    updateActiveButtonClass(label: string) {
        const allButtons = document.querySelectorAll('.widget-list-group-item');
        const lowerLabel = label.toLowerCase();

        allButtons.forEach((btn: any) => {
            const text = btn?.innerText?.trim().toLowerCase();
            if (text && text.includes(lowerLabel)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    getSectionIdFromLabel(label: string): string {
        const mapping: any = {
            'Details': 'details',
            'Trade-In': 'trade',
            'Protection': 'protection',
            'Protection & Accessories': 'protection-accessories',
            'Accessories': 'accessories',
            'Submit': 'submit'
        };
        return mapping[label.trim()] || '';
    }

    scrollSpyEnabled = true;
    @ViewChild(NgbScrollSpy) spy!: NgbScrollSpy;

    changeTabByLabel(tabLabels: string[]) {
        
        if (!this.tabGroup || !this.tabGroup._tabs) {
            
            const sectionIdMap: { [key: string]: string } = {
                'Details': 'details',
                'Trade-In': 'trade',
                'Protection': 'protection',
                'Accessories': 'accessories',
                'Protection & Accessories': 'items-3',
                'Submit': 'submit',
                'Review': 'submit'
            };
    
            const sectionId = sectionIdMap[tabLabels[0]];
            
            if (sectionId) {
                const section = document.querySelector(`#${sectionId}`) as HTMLElement;
                
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.updateActiveButtonClass(tabLabels[0]);
                } else {
                    console.warn('Section element not found for ID::', sectionId);
                }
            } else {
                console.warn('No matching section ID found for tab::', tabLabels[0]);
            }
    
            setTimeout(() => {
                this.scrollSpyEnabled = true;
                if (this.spy && typeof (this.spy as any).refresh === 'function') {
                    (this.spy as any).refresh();
                }
            }, 1500);
    
            return;
        }

        this.scrollSpyEnabled = false;

        const tabIndex = this.tabGroup._tabs.toArray().findIndex(tab =>
                    tabLabels.some(label => tab.textLabel.trim().toLowerCase().includes(label.trim().toLowerCase()))
                );
                if (tabIndex !== -1) {
                            this.selectedTabIndex = tabIndex;
                            setTimeout(() => {
                                const sectionId = this.getSectionIdFromLabel(tabLabels[0]); // implement this
                                const section = document.querySelector(`#${sectionId}`) as HTMLElement;
                                if (section) {
                                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                
                                this.updateActiveButtonClass(tabLabels[0]);
                
                                setTimeout(() => {
                                    this.scrollSpyEnabled = true;
                                    if (this.spy && typeof (this.spy as any).refresh === 'function') {
                                        (this.spy as any).refresh();
                                    }
                                }, 1500);
                            }, 100);
                } else {
                    console.log('No matching tab found for::', tabLabels);
                }
    }
    
    updateDeliveryStatus(status: number) {
        DataHandler.deliverychanges = status;
        this.deliveryChangesStatus = status;
    }


    selectedTabIndex: any = 0;
    submitTabIndex: number = -1;
    timeoutInitialPopup :any=0;

    currentActiveSectionIndex: number = 0; // Track the currently active section in view (separate from selectedTabIndex)

    // Flag to ensure IntersectionObserver is only set up once
    private observerSetUp: boolean = false;
    private observer: IntersectionObserver | null = null;


    // Temporary observer to detect the first section in view
    setupInitialIntersectionObserver(): void {
        const options = {
            root: null, // Observer root is the viewport
            threshold: 0.1, // Trigger when 10% of the section is in view
        };
        // Create an observer that will trigger when any section comes into view
        const tempObserver = new IntersectionObserver(this.onFirstSectionInView.bind(this), options);
        // Observe only the first section (you can choose any section here)
        const firstSection = this.sections.first?.nativeElement;
        if (firstSection) {
            tempObserver.observe(firstSection);
        }
    }

    // Callback function to handle when the first section is in view
    onFirstSectionInView(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.setupIntersectionObserver();
            }
        });
    }

    // Function to setup the IntersectionObserver for all sections
    setupIntersectionObserver(): void {
        const options = {
            root: null, // Observer root is the viewport
            threshold: 0.4, // Trigger when 10% of the section is in view
        };

        this.observer = new IntersectionObserver(this.onIntersection.bind(this), options);

        // Observe all sections
        this.sections.toArray().forEach((section) => {
            this.observer?.observe(section.nativeElement);
        });

        // Set the flag to prevent setting up the observer again
        this.observerSetUp = true;
    }

    // IntersectionObserver callback
    onIntersection(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;  // Get the section's id
                //console.log(`Section ${sectionId} is in view.`);
                // Find the index of the section that is in view and update the selectedTabIndex
                // Track the section index without updating selectedTabIndex
                const activeIndex = this.sections.toArray().findIndex((section) => section.nativeElement.id === sectionId);
                // Only update currentActiveSectionIndex to reflect the section in view
                this.currentActiveSectionIndex = activeIndex;
                if (this.selectedTabIndex !== this.currentActiveSectionIndex) {
                    // Update the selected tab index manually based on the active section index
                    this.selectedTabIndex = this.currentActiveSectionIndex;
                }
            }
        });
    }

    public isAccordionTransitioning = false;
    private accordionDebounceTimer: any;
    @ViewChild('spy') spyExpand: any;


    setAccordionExpanding(isExpanding: boolean): void {
        clearTimeout(this.accordionDebounceTimer);
        this.isAccordionTransitioning = true;
      
        if (!isExpanding) {
          this.accordionDebounceTimer = setTimeout(() => {
            this.isAccordionTransitioning = false;
      
            if (this.eventType !== 'Details') {
              const detailsSection = document.getElementById('items-1');
              if (detailsSection) {
                detailsSection.scrollIntoView({ behavior: 'auto', block: 'start' });
              }
            }
          }, 600);
        }
      }
       

    getTabNameFromFragment(fragment: string): string {
        switch (fragment) {
          case 'items-1': return 'Details';
          case 'items-2': return 'Trade-In';
          case 'items-3': return 'Protection';
          case 'items-4': return 'Accessories';
          case 'items-5': return 'Submit';
          default: return '';
        }
      }
      

    onScrollChange(event: any) {
        if(event != 'items-1')
        //DataHandler.userInteraction = true;   
        if (this.isAccordionTransitioning || this.isTabClick) {
            return;
        }
        
        this.eventType = this.getTabNameFromFragment(event);
        // if (this.isTabClick) return;

        if (this.isAccordionExpanding) {
            return;
        }
        if (event == 'items-1') {

            this.submitTab = false;
            this.observableService.setTestDrive(true)
            if (this.vehicleOnce == true) {
                 if(!DataHandler.accessoriesClick) 
                    this.adobe_sdg_event('vehicle-details-scroll');
            }
            this.vehicleOnce = true
            this.isApplyCreditClicked = false;
            this.observableService.setDisplayTestDrive(true);
            this.ga4dealerService.submit_to_api_ga4dealer('Details').subscribe((response: any) => { });

        } else if (event == 'items-2') {                    
            if(!DataHandler.accessoriesClick) 
            this.adobe_sdg_event('tradein-scroll');
            this.submitTab = false;
            this.observableService.setDisplayTestDrive(false);

            if (this.tradeinpar == 'bb') {
                GoogleAnalyticsHandler.googleAnalyticsExecutor('TradeInBB-GaGoal');
                GA4Handler.ga4VirtualPageView('TradeInBB');
                this.ga4Service.submit_to_api('TradeInBB', '', '', '', '', '', '').subscribe((response) => { });
                this.ga4Service.submit_to_api('TradeInBBnew', '', '', '', '', '', 'Trade In').subscribe((response) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('TradeInBB').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('TradeInPageView').subscribe((response: any) => { });
            }
            if (this.tradeinpar == 'kbb') {
                GA4Handler.ga4VirtualPageView('TradeInkbb');
                GoogleAnalyticsHandler.googleAnalyticsExecutor(event.tab.textLabel + '-kbb', 0);
                GoogleAnalyticsHandler.googleAnalyticsExecutor('tradein-kbb-start', '');
                GoogleAnalyticsHandler.googleAnalyticsExecutor('TradeInKBB-GaGoal');
                this.ga4Service.submit_to_api('TradeInKBB', '', '', '', '', '', '').subscribe((response) => { });
                this.ga4Service.submit_to_api('TradeInKBBnew', '', '', '', '', '', 'Trade In').subscribe((response) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('TradeInKBB').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('TradeInPageView').subscribe((response: any) => { });
            }

        } else if (event == 'items-3') {  
            this.submitTab = false;
            this.observableService.setTestDrive(false)
            if(!DataHandler.accessoriesClick) 
            this.adobe_sdg_event('protection-scroll');
            this.observableService.setDisplayTestDrive(false);
            if (DataHandler.custom_plan_added == 0) {
                //when user changing the zipcode that time we are calling the respected selectedPayemt tab api 
                if (this.previousZipCode != DataHandler.zipcode) {
                    DataHandler.leaseServiceContract = false;
                    DataHandler.financeServiceContract = false;
                    DataHandler.cashServiceContract = false;
                    this.previousZipCode = DataHandler.zipcode
                    //to call the three api with latest zipcode
                }

                if (!DataHandler.leaseServiceContract || DataHandler.previousleaseterm != DataHandler.leasedafaultterm) {
                    DataHandler.previousleaseterm = DataHandler.leasedafaultterm
                    if (this.selectedPaymentType == 'lease') {
                        DataHandler.leaseServiceContract = true
                        this.observableService.getLeasePlane();
                    }
                }

                if (!DataHandler.financeServiceContract || DataHandler.previousfinanceterm != DataHandler.financedafaultterm) {
                    DataHandler.previousfinanceterm = DataHandler.financedafaultterm
                    if (this.selectedPaymentType == 'finance') {
                        DataHandler.financeServiceContract = true
                        this.observableService.getFinancePlane();
                    }
                }

                if (!DataHandler.cashServiceContract) {
                    if (this.selectedPaymentType == 'cash') {
                        DataHandler.cashServiceContract = true
                        this.observableService.getCashPlane();
                    }
                }
            }
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtectionView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('ServiceProtectionView').subscribe((response: any) => { });

        } else if (event == 'items-4') {      
            DataHandler.accessoriesClick = false;
            this.submitTab = false;
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('accessories-scroll');
            this.observableService.setDisplayTestDrive(false);

            this.submitTab = false;
            this.ga4Service.submit_to_api('Accessoriesnew', '', '', '', '', '', 'Accessories').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('AccessoriesView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('AccessoriesView').subscribe((response: any) => { });

        } else {

            this.observableService.setTestDrive(false)
            this.observableService.setDisplayTestDrive(false);
            this.adobe_sdg_event('submit-scroll')
            this.submitTab = true;
            this.ga4Service.submit_to_api('DeliveryReview', '', '', '', '', '', 'Delivery Review and Submit').subscribe((response) => { });
            this.ga4Service.submit_to_api('DeliveryReviewnew', '', '', '', '', '', 'Delivery Review and Submit').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('DeliverySubmitView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('DeliverySubmitView').subscribe((response: any) => { });

        }
        let tabNavigation = document.querySelector('.tab-navigation') as HTMLElement;
        if (this.submitTab) {
            tabNavigation.classList.add('tab-navigation-Onsubmit');
        }
        if (this.submitTab == false) {
            tabNavigation.classList.remove('tab-navigation-Onsubmit');
        }
    }

    scrollToElementWhenAvailable(id: string, maxRetries = 10, interval = 200) { 
        let retries = 0;
        const check = () => {
          const el = document.getElementById(id);
          if (el) {
            const container = this.findScrollableParent(el);
            const offset = 80; // adjust for header height, try 100 if unsure

            if (container) {
            const top = el.offsetTop - offset;
            container.scrollTo({ top, behavior: 'smooth' });
            } else {
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            }
          } else if (retries < maxRetries) {
            retries++;
            setTimeout(check, interval);
          } else {
            console.log('Element #${id} not found after ${maxRetries} retries');
          }
        };
        check();
      }

      findScrollableParent(element: HTMLElement): HTMLElement | null { 
        let parent: HTMLElement | null = element.parentElement;
        while (parent) {
          const overflowY = window.getComputedStyle(parent).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            return parent;
          }
          parent = parent.parentElement;
        }
        return null;
      }      
      
    onTabClick(par: any): void {
        //DataHandler.userInteraction = true;     
        this.eventType = par;
        this.isTabClick = true;
        setTimeout(() => {
            this.isTabClick = false
            this.heightAdj();
        }, 1000)

        if (par == 'Details') {
            this.submitTab = false;
            this.observableService.setTestDrive(true)
            this.adobe_sdg_event('vehicle-details-page');
            this.isApplyCreditClicked = false;
            this.observableService.setDisplayTestDrive(true);
            this.ga4dealerService.submit_to_api_ga4dealer('Details').subscribe((response: any) => { });
        }
        if (par == 'Trade-In') {
            this.adobe_sdg_event('tradein');
            this.submitTab = false;
            this.observableService.setDisplayTestDrive(false);

            if (this.tradeinpar == 'bb') {
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => {

                });
            }
            if (this.tradeinpar == 'kbb') {
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => { });
            }
        }
        if (par == 'Protection') {

            this.submitTab = false;
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('protection');
            this.observableService.setDisplayTestDrive(false);
            if (DataHandler.custom_plan_added == 0) {
                //when user changing the zipcode that time we are calling the respected selectedPayemt tab api 
                if (this.previousZipCode != DataHandler.zipcode) {
                    DataHandler.leaseServiceContract = false;
                    DataHandler.financeServiceContract = false;
                    DataHandler.cashServiceContract = false;
                    this.previousZipCode = DataHandler.zipcode
                    //to call the three api with latest zipcode
                }

                if (!DataHandler.leaseServiceContract || DataHandler.previousleaseterm != DataHandler.leasedafaultterm) {
                    DataHandler.previousleaseterm = DataHandler.leasedafaultterm
                    if (this.selectedPaymentType == 'lease') {
                        DataHandler.leaseServiceContract = true
                        this.observableService.getLeasePlane();
                    }
                }

                if (!DataHandler.financeServiceContract || DataHandler.previousfinanceterm != DataHandler.financedafaultterm) {
                    DataHandler.previousfinanceterm = DataHandler.financedafaultterm
                    if (this.selectedPaymentType == 'finance') {
                        DataHandler.financeServiceContract = true
                        this.observableService.getFinancePlane();
                    }
                }

                if (!DataHandler.cashServiceContract) {
                    if (this.selectedPaymentType == 'cash') {
                        DataHandler.cashServiceContract = true
                        this.observableService.getCashPlane();
                    }
                }
            }
            this.ga4Service.submit_to_api('service-protection', '', '', '', '', '', 'Service Protection & accessories').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtectionView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('ServiceProtectionView').subscribe((response: any) => { });
        }
        if (par == 'Accessories') {
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('accessories');
            this.observableService.setDisplayTestDrive(false);

            this.submitTab = false;
            this.ga4Service.submit_to_api('Accessoriesnew', '', '', '', '', '', 'Accessories').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('AccessoriesView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('AccessoriesView').subscribe((response: any) => { });
        }
        if (par == 'Review' || par == 'Submit') {
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('submit');
            this.observableService.setDisplayTestDrive(false);
            this.submitTab = true;
            this.ga4dealerService.submit_to_api_ga4dealer('DeliverySubmitView').subscribe((response: any) => { });
            const tabLabel = this.eventType;
            if (tabLabel === 'Submit') {
                this.observableService.notifyTabChange('Submit');
            }
        }
        let tabNavigation = document.querySelector('.tab-navigation') as HTMLElement;
        if (this.submitTab) {
            tabNavigation?.classList.add('tab-navigation-Onsubmit');
        }
        if (this.submitTab == false) {
            tabNavigation?.classList.remove('tab-navigation-Onsubmit');
        }
        this.showTestDrive = false;
    }

    @ViewChild('tradeSection') tradeSection!: ElementRef;
    hasNavigated = false;
   
    ngAfterViewChecked() {
        if (this.submitTabIndex === -1 && this.tabGroup) {
            this.submitTabIndex = this.findSubmitTabIndex();
        }
        if (!this.observerSetUp) {
            this.setupInitialIntersectionObserver();
        }
        
    }


    findSubmitTabIndex(): number {
        if (!this.tabGroup) return -1;
        const tabs = this.tabGroup._tabs.toArray();
        return tabs.findIndex(tab => tab.textLabel.trim() === 'Submit');
    }

    get isSubmitMatTabActive(): boolean {
        if (this.isMobileScreen) {
            return this.eventType === 'Submit'
        } else {
            return this.selectedTabIndex === this.submitTabIndex
        }
    }

    onTabChange(index: number) {
        this.selectedTabIndex = index;
        if (this.selectedTabIndex === 3) {
            this.accessoriesClicked = false;
        }
        // Get the index of the "Submit" tab dynamically
        this.findSubmitTabIndex();
    }

    onTabChanges(event: any) {
        const tabLabel = event.tab.textLabel.trim();
        if (tabLabel === 'Submit') {
            this.observableService.notifyTabChange('Submit');
        }
    }

    openAccessoriesTab() {
        this.selectedTabIndex = 3; // Index of the Accessories Tab
    }

    closeReserveNowHandler() {
        this.showReserveNowComponent = false; // Hides the reserve-now component
        this.loaded = 1;
        this.showTestDrive = false;
        this.showApplyCreditComponent = false;
        this.isApplyCreditClicked = false;
        this.showHideMainContent = false;
    }

    //openQualifyDialog() {
    //  const preQualDialog = this.dialog.open(PrequalifyComponent, {
    //   panelClass: [],
    //   maxWidth: 600,
    //   maxHeight: 800,
    //   width: '100%',
    //   height:'auto',
    // });
    // this.observableService.setShowPrequal(true); 
    /* 
    if (!DataHandler.isMobileScreen) {
      this.showPreQualify = true;
      this.observableService.setShowPrequal(true);
    } else {
      if (this.selectedTabIndex !== 0) {
      this.selectedTabIndex = 0;
      setTimeout(() => {this.observableService.setShowPrequal(true)}, 300);
    } else {
      this.observableService.setShowPrequal(true);
    }
    }*/
    //}

    openPaymentCalculator() {
        //DataHandler.userInteraction = true; 
        DataHandler.SDGEvents.isFloatingCalcClick = true;
        this.observableService.openPaymentCalculator();
    }

    homeFieldsValid: boolean = true;
    otherFieldsValid: boolean = true;

    @Output() navigateToSubmitTab = new EventEmitter<void>();

    openSubmitToDealerDialog() {
        DataHandler.userInteraction = true; 
        this.ga4Service.submit_to_api('ScheduleDelivery', '', '', '', '', '', '').subscribe((response) => { });
        //this.ga4dealerService.submit_to_api_ga4dealer('ScheduleDelivery').subscribe((response: any) => { });
        //this.ga4dealerService.fire_asc_events('ScheduleDelivery').subscribe((response: any) => { });
        this.adobe_sdg_event('submit-to-dealer');

        const isFormFilled = !this.isFormPristine;
        if (!this.isSubmitMatTabActive && isFormFilled) {
            this.onTabClick('Submit');
            setTimeout(() => {
                this.openSubmitToDealerDialog();
            }, 500);
            return;
        }

        if (this.isSubmitMatTabActive && DataHandler.deliverychanges === 1) {
            setTimeout(() => {
                document.getElementById('date')?.focus();
                document.getElementById('date')?.scrollIntoView(true);
            }, 500);
            this.eventEmitterService.validateSubmitForm();
            return;
        } else {
            DataHandler.deliverychanges = 0;
        }

        if (this.isSubmitMatTabActive) {
            if (this.isFormPristine) {
                console.log("Pop-up allowed: Form is untouched.");
            }
            // Block pop-up if date is selected but time is missing
            else if (this.dateValue && !this.timeValue) {
                setTimeout(() => {
                    document.getElementById('time')?.focus();
                    document.getElementById('time')?.scrollIntoView(true);
                }, 500);
                this.eventEmitterService.validateSubmitForm();
                return;
            }
            // Block pop-up if time is selected but date is missing
            else if (!this.dateValue && this.timeValue) {
                setTimeout(() => {
                    document.getElementById('date')?.focus();
                    document.getElementById('date')?.scrollIntoView(true);
                }, 500);
                this.eventEmitterService.validateSubmitForm();
                return;
            }
            else if (!this.dateValue || !this.timeValue ||
                (this.selectedLocation === 'My Home' && !this.homeFieldsValid) ||
                (this.selectedLocation === 'Other Location (No extra charge)' && !this.otherFieldsValid)) {
                setTimeout(() => {
                    if (!this.dateValue) {
                        document.getElementById('date')?.focus();
                    } else if (!this.timeValue) {
                        document.getElementById('time')?.focus();
                    } else if (this.selectedLocation === 'My Home' && !this.homeFieldsValid) {
                        document.getElementById('hlhomeAddress')?.focus();
                    } else if (this.selectedLocation === 'Other Location (No extra charge)' && !this.otherFieldsValid) {
                        document.getElementById('olhomeAddress')?.focus();
                    }
                }, 500);
                this.eventEmitterService.validateSubmitForm();
                return;
            }
        }
        //check whether delivery option is selected or not
        setTimeout(() => {
            if (DataHandler.deliverychanges == 1) {
                this.eventEmitterService.validateSubmitForm();
                if (DataHandler.deliverychanges == 1) {
                    // this.selectedTabIndex = 4;
                    setTimeout(() => {
                        document.getElementById('date')?.focus();
                        document.getElementById('date')?.scrollIntoView(true);
                    }, 500)
                    return;
                }
            }

            if (!this.isSubmitMatTabActive && !this.isFormPristine) {
                this.navigateToSubmitTab.emit();
                return;
            }

            if (!this.isFormPristine && DataHandler.deliverychanges === 1) {
                return;
            }
            if (!this.submitDialogOpened) {
                this.submitDialogOpened = true;
                const submittodealerDialog = this.dialog.open(SubmitToDealerDialogComponent, {
                    panelClass: [],
                    width: '70%',
                    height: 'auto',
                    disableClose: true,
                    scrollStrategy: this.overlay.scrollStrategies.noop(),
                });
            
            this.adobe_sdg_event('submit-to-dealer', 'page-load');
            submittodealerDialog.afterClosed().subscribe((result) => {
                if (result === 'Accessories') {
                    const items4Section = document.getElementById('items-4');
                    const section = document.getElementById('items-3');
                    if (items4Section) {
                        setTimeout(() => {
                            this.isAccessoriessScrolled = true;
                            items4Section.scrollIntoView({ behavior: 'smooth' });
                            this.viewportScroller.scrollToAnchor('items-4');
                            this.cdr.detectChanges();
                        }, 300);
                    } else if (section) {
                        setTimeout(() => {
                            this.isAccessoriessScrolled = true;
                            section.scrollIntoView({ behavior: 'smooth' });
                            this.viewportScroller.scrollToAnchor('items-3');
                            this.cdr.detectChanges();
                        }, 300);
                    }
                }
                this.submitDialogOpened = false;
            });
        }
        }, 500);
    }


    tradeinbb() {
        if (DataHandler.tradein_type == 'bb') {
            this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => {
                this.adobe_sdg_event("trade-in");
            });
        }
        if (DataHandler.tradein_type == 'kbb') {
            this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => {
                this.adobe_sdg_event("trade-in");
            });
        }
    }

    closeDialog(): void {
        this.observableService.closePaymentCalculator();
        DataHandler.isWidgetOpen = false;
        DataHandler.initialClose?.close()
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.observableService.closeWidget()
        this.observableService.setShowApplyCredit$.subscribe((value: any) => {
            this.isApplyCreditClicked = value
        });

        this.iframeurl = this.transform('');

        if ((this.eventEmitterService.subsVar == undefined) != (this.eventEmitterService.subsVar != undefined)) {

            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeIframeComponentFunction.subscribe((param: string) => {
                    this.iframeurl = this.transform(param);
                });
        }
        this.ga4dealerService.submit_to_api_ga4dealer('widget-close').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('widget-close').subscribe((response: any) => { });
        this.adobe_sdg_event("close-main-dialog");
        
        clearTimeout(this.timeoutInitialPopup)
        if (DataHandler.form_submitted == 0) {
            if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '') {
                DataHandler.form_submitted = 1;
                if (this.vehicle_type == 'new') {
                    DataHandler.currentSubmitType = 'usr-x';
                }
                else if (this.vehicle_type == 'used') {
                    DataHandler.currentSubmitType = 'auto';
                }
                DataHandler.hint_comments = 'App-closeDialog-1727'
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                });
            }
        }
        // this.ga4dealerService.submit_to_api_ga4dealer('widget-close').subscribe((response: any) => { });
        // this.ga4dealerService.fire_asc_events('widget-close').subscribe((response: any) => { });
    }
    closeWidgetSDG() {
        this.adobe_sdg_event("close-main-dialog");
    }

    transform(url: any) {
        return this.dom.bypassSecurityTrustResourceUrl(url);
    }

    applyCreditBtnClick() {
        DataHandler.userInteraction = true; 
        this.adobe_sdg_event('apply-credit');
        this.showApplyCreditComponent = true;
        this.showTestDrive = false;
        this.showReserveNowComponent = false;
      //  this.showHideMainContent = true;
        this.observableService.setShowApplyCredit(true);
        this.creditAppState = 'open';
    }

    creditAppState: string = 'not-open';
    hidePaymentCalc = false;

    applyCreditDialog() {
        DataHandler.autofiStatus = 'Initiated';
        DataHandler.is_lead_form_open = true;
        const creditdialogRef = this.dialog.open(ApplyCreditDialog, {
            panelClass: [],
            // maxWidth: 600,
            // maxHeight: 800,
            width: '70%',
            height: 'auto',
            disableClose: true,
            scrollStrategy: this.overlay.scrollStrategies.noop()
        });

        // MerkleHandler.merkleexecutor('bottom-apply-credit');
        creditdialogRef.afterClosed().subscribe(result => {
            // MerkleHandler.merkleexecutor('apply-to-credit-popup-close');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('apply-to-credit-popup-close');
            DataHandler.is_lead_form_open = false;
        });
        DataHandler.creditAppState = this.creditAppState = 'open';
        //}
    }

    displayApplyCredit() {
     //   this.showHideMainContent = true;
        this.showApplyCreditComponent = true;
        this.showTestDrive = false;
        this.showReserveNowComponent = false;
    }
    showMainContent(){
          this.showHideMainContent = true;
        this.showApplyCreditComponent = true;
        this.showTestDrive = false;
        this.showReserveNowComponent = false;
    }

    disableSubmit!: any;
    private subscription!: Subscription;
    selectedLocation: string | null = null;
    private ga4Triggered = false;
   
    ngOnInit() {
        this.page = DataHandler.page;
        // DataHandler.vin = this.data.vin;
        this.observableService.openPrequalDialog$
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: any) => {
                this.openPrequalDialog(event)
            })

        this.formSubmitted = DataHandler.formSubmitted = false;

        this.observableService.hideCalcSubject$.subscribe(value => {
            if (value !== null && value !== undefined) {
                this.hidePaymentCalc = value;
            }
        });

        this.observableService.formStatus$.subscribe(status => {
            if (!status.pristine && this.eventType !== 'Submit') {
                //this.onTabClick('Submit'); //Check for validation
            }
            this.dateValue = status.date;
            this.timeValue = status.time;
            this.selectedLocation = status.location;
            this.homeFieldsValid = status.homeFieldsValid;
            this.otherFieldsValid = status.otherFieldsValid;
            this.isFormPristine = status.pristine;
        });

        this.subscription = this.observableService.formSubmitted$.subscribe(
            (status: any) => {
                this.disableSubmit = status;
            }
        );

        DataHandler.form_submitted = 0;
        DataHandler.adobeSDGgetGlobalVisitorsIds = AdobeSDGHandler.generateUUID();

        this.make_url = DataHandler.make_url;
        this.eventEmitterService.tabChange$.subscribe((index: number) => {
            this.selectedTabIndex = index;
        });
        this.eventEmitterService.tabChangeAcc$.subscribe(tabLabels => {
            if (tabLabels) {
                setTimeout(() => this.changeTabByLabel(tabLabels), 0);
            }
        });
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.vin = this.data.vin;
        this.vehicle_type = this.data.vehicle_type?.toLowerCase();
        if (DataHandler.isMobileScreen) {
            this.renderer.setAttribute(
                document.querySelector('html'), 'dir', 'mobile'
            );
        } else {
            this.renderer.setAttribute(
                document.querySelector('html'), 'dir', 'desktop'
            );
        }
        DataHandler.activeTab = (this.vehicle_type == 'new') ? 'lease' : 'finance';
        this.jeepLogo = 'https://d1jougtdqdwy1v.cloudfront.net/t3-new-ui/assets/images/logo-jeep.png';
        this.eshopLogo = 'https://d1jougtdqdwy1v.cloudfront.net/t3-new-ui/assets/images/eshop_logo_white.png';

        DataHandler.vehicle_type = this.vehicle_type;
        this.restService.VinStatusCheck(this.data.dealercode, this.data.vin, this.vehicle_type).subscribe((response) => {
            let obj = JSON.parse(JSON.stringify(response));
            if (!obj || (obj.checkDlrVinStatus?.is_dealer_exists && !obj.checkDlrVinStatus.is_vin_exists)) {
                this.loaded = -1;
            } else if (!obj.checkDlrVinStatus?.is_dealer_exists) {
                this.loaded = -3;
            } else {
                if (
                    obj.checkDlrVinStatus?.is_vin_dealer_combo_exists ||
                    (obj.checkDlrVinStatus?.is_dealer_exists &&
                        obj.checkDlrVinStatus.is_vin_exists)
                ) {
                    let vehicleImagesPayload: vehicleImages = {
                        vin: this.data.vin,
                        dealercode: this.data.dealercode
                    };
                    if (this.vehicle_type === 'new') {
                        this.store.dispatch(photoGalleryAction({ payload: vehicleImagesPayload }));
                        setTimeout(() => {
                            this.store
                                .pipe(select(getPhotoGalleryAPIResp), takeUntil(this.unsubscribe$))
                                .subscribe({
                                    next: (data: any) => {
                                        this.vehicle_data = data.photoGallery[0];
                                        var obj = this.vehicle_data
                                        if (obj != undefined) {
                                            DataHandler.minimumPercentage = obj?.dpPercentage
                                            DataHandler.dpPercentage = DataHandler.dpFinPercentage = obj?.dpPercentage
                                            if(obj?.down_payment_set_flag == 'O'){
                                                DataHandler.minimumPercentage = 0
                                            }
                                            DataHandler.mandatory_phone = obj?.lead_mandatory_contact;

                                            DataHandler.defaultPayment = obj?.default_payment_mode;
                                            DataHandler.is_commnet_box_enable = obj?.is_lead_comment_enable
                                            DataHandler.is_dms_enabled = obj.dms_enabled
                                            DataHandler.vehicleInventoryStatusCode = obj.status_code
                                            DataHandler.GA4_measurement_id = obj.ga4_measurement_id;
                                            DataHandler.trim = encodeURIComponent(obj?.trim_desc);
                                            this.gaDealerAnalyticsService.initGADealerLaunchScript();
                                            DataHandler.msrp = this.vehicle_msrp = obj?.msrp;
                                            DataHandler.dealerName = obj.dealer_name;
                                            this.make_video = DataHandler.make = obj?.make;
                                            DataHandler.model = obj.model
                                            DataHandler.year = obj.year;
                                            DataHandler.showdelivery = obj.schedule_vehicle_delivery_status;
                                            DataHandler.schedule_delivery_disclimer = obj.schedule_delivery_disclaimer;
                                            DataHandler.testdrive_disclimer = obj.testdrive_disclaimer;
                                            DataHandler.showroomTimingFilter = obj.showroom_timings;
                                            DataHandler.Vehicle_delivery = obj.delivery_status_vehicle_status;
                                            this.dealer_phone = obj.dealer_phone;
                                            this.dealername = obj.dealer_name;
                                            this.tradeinpar = obj.trade_type;

                                            DataHandler.reserveAmount = obj.amount;
                                            DataHandler.current_session = obj.current_session_pre_qual;
                                            DataHandler.currentSession_PrivateOffer = DataHandler.current_session
                                            DataHandler.oreIdForReservation = obj.ore_id;
                                            DataHandler.reservationPrivacyLink = obj.reservation_privacy_link;
                                            if (obj.hero_image.src_url.thumbnail != null) {
                                                DataHandler.heroImage = obj.hero_image.src_url.thumbnail;
                                            }
                                            else {
                                                DataHandler.heroImage = obj.hero_image.src_url;
                                            }
                                            DataHandler.enableautofi = obj.autoFi_enabled_dealers;
                                            this.autofiEnable = DataHandler.enableautofi;
                                            DataHandler.paypalEnvironment = obj.paypal_environment;
                                            DataHandler.paypalClientId = obj.client_id;
                                            DataHandler.reserveCurrency = obj.currency;
                                            DataHandler.display_vehicle_name = this.display_vehicle_name = obj?.display_vehicle_name;
                                            DataHandler.dealerName = obj.dealer_name;
                                            DataHandler.customize_testdrive = obj.delivery_status_customize_testdrive;
                                            this.showTestDriveBtn = DataHandler.customize_testdrive;
                                            DataHandler.showroomTimingFilter = obj.showroom_timings;
                                            DataHandler.reservationTermLink = obj.reservation_term_link;
                                            this.customize_reservation = DataHandler.customize_reservation= obj.customize_reservation;                                             
                                            this.paypal_onboarding_status = DataHandler.paypal_onboarding_status = obj.paypal_onboarding_status;
                                            this.is_reserve_button_enable = DataHandler.is_reserve_button_enable = obj.is_reserve_button_enable;


                                            if (this.no_inventory_message != '' && this.no_inventory_message != null) {
                                                if (this.no_inventory_message.includes("[[phone]]")) {
                                                    this.is_phone_available = true;
                                                    this.no_inventory_message = this.no_inventory_message.replace('[[phone]]', "");
                                                }
                                            }
                                            this.year = DataHandler.year = obj.year;
                                            if (obj.status != "Vin not found") {
                                                this.loaded = 1;
                                                 this.loadPage();
                                                DataHandler.inwidget_initial_popup = obj.inwidget_initial_popup  // ="D";
                                                DataHandler.initial_popup_isdelay = obj.initial_popup_isdelay;
                                                DataHandler.dealerBC = obj.dlr_bc;
                                                
                                                // DataHandler.initial_popup_isdelay =  obj.initial_popup_isdelay;
                                                MerkleHandler.merkleexecutor("vehicle-details_pageload");
                                                this.store.dispatch(getDealerInfoAction({ dealer_code: this.data.dealercode, vin: this.data.vin }));
                                                setTimeout(() => {
                                                    this.store
                                                        .pipe(select(dealerInfoDetailsNewResp), takeUntil(this.unsubscribe$))
                                                        .subscribe({
                                                            next: (data: any) => {
                                                                this.dealerInfo = data.dealerDetails[0]?.Dealer_info
                                                                DataHandler.dealerzip = this.dealerInfo?.dealerZip
                                                                DataHandler.vehicle_info = this.vehicle_info = data.dealerDetails[0]?.vehicle_information;
                                                                DataHandler.dealerstate = data.dealerDetails[0]?.Dealer_info.dealerState
                                                                DataHandler.dealerinfo = this.dealerInfo;
                                                                if (DataHandler.zipcode == undefined || DataHandler.zipcode == null || DataHandler.zipcode == '') {
                                                                    DataHandler.zipcode = this.dealerInfo?.dealerZip
                                                                }
                                                                this.vehicleinfo = data.dealerDetails[0]?.vehicle_information;
                                                                for (let i = 0; i < this.vehicleinfo?.length; i++) {
                                                                    if (this.vehicleinfo[i].caption == 'Body Style') {
                                                                        DataHandler.bodyType = this.vehicleinfo[i].value;
                                                                    }
                                                                    if (this.vehicleinfo[i].caption == 'Exterior Color') {
                                                                        DataHandler.boyColor = this.vehicleinfo[i].value;
                                                                    }
                                                                    if (this.vehicleinfo[i].caption.toLowerCase() == 'horse power') {
                                                                        if (DataHandler.HybrideHP == 'Y') {
                                                                            this.vehicleinfo[i].value = DataHandler.HybridHPvalue;
                                                                            this.vehicleinfo[i].caption = 'Hybrid system net power output (HP)';
                                                                        } else if (DataHandler.HybrideHP == 'N') {
                                                                            this.vehicleinfo[i].value = DataHandler.HybridHPvalue;
                                                                            this.vehicleinfo[i].caption = 'Horsepower';
                                                                        } else {
                                                                            /*     this.vehicleinfo[i].value = this.vehicleinfo[i].value;
                                                                                 this.vehicleinfo[i].caption = this.vehicleinfo[i].caption;*/
                                                                        }
                                                                    }
                                                                }
                                                                if(this.ga4Triggered == false){
                                                                    this.ga4Triggered = true;
                                                                setTimeout(() => {
                                                                    this.ga4dealerService.submit_to_api_ga4dealer('WidgetStart').pipe(take(1)).subscribe();
                                                                    this.ga4dealerService.fire_asc_events('WidgetStart').pipe(take(1)).subscribe();
                                                                    this.ga4dealerService.fire_asc_events('WidgetStartone').pipe(take(1)).subscribe();
                                                                    //this.ga4dealerService.submit_to_api_ga4dealer('Details').subscribe((response: any) => { });
                                                                }, 3000);
                                                            }
                                                            }, error: (error: any) => {
                                                                // Do nothing 
                                                                this.loaded == -1
                                                            }
                                                        });
                                                }, 100)
                                                if (DataHandler.make?.toLowerCase() == 'ram' || DataHandler.make?.toLowerCase() == 'ramtrucks') {
                                                    this.logourl = "https://d1jougtdqdwy1v.cloudfront.net/t3-new-ui/assets/images/logo-ram.png";
                                                } else if (DataHandler.make?.toLowerCase() == 'chrysler') {
                                                    this.logourl = "https://d1jougtdqdwy1v.cloudfront.net/images/logos/2x/cdjr-logo-chryslertm.png";
                                                } else if (DataHandler.make?.toLowerCase() == 'jeep') {
                                                    this.logourl = "https://d1jougtdqdwy1v.cloudfront.net/images/logos/2x/cdjr-logo-jeeptm.png";
                                                } else if (DataHandler.make?.toLowerCase() == 'wagoneer') {
                                                    this.logourl = 'https://d1jougtdqdwy1v.cloudfront.net/images/logos/2x/cdjr-logo-jeeptm.png';
                                                } else if (DataHandler.make?.toLowerCase() == 'fiat') {
                                                    this.logourl = "https://d1jougtdqdwy1v.cloudfront.net/images/logo/logo-fiat.png";
                                                } else if (DataHandler.make?.toLowerCase() == 'alfa romeo') {
                                                    this.logourl = 'https://d1jougtdqdwy1v.cloudfront.net/images/logos/alfaromeo_logo_white.svg';
                                                } else if (DataHandler.make?.toLowerCase() == 'dodge') {
                                                    this.logourl = 'https://d1jougtdqdwy1v.cloudfront.net/images/logos/2x/cdjr-logo-dodge.png';
                                                }
                                                else {
                                                    this.logourl = DataHandler.asseturl + "images/logos/2x/" + DataHandler.make?.toLowerCase() + ".png";
                                                }

                                                this.idleService.initialize();
                                                this.idleService.idle$.subscribe(s => this.submitAbandonedLead());
                                            } else {
                                                this.loaded = -1;
                                            }
                                        }
                                    },
                                    error: (e: any) => console.error(e),
                                });
                                 const links = document.querySelectorAll('.inwidgetimage');
                                links.forEach(link => {
                                    // Add a 'disabled' attribute (for custom styling or logic)
                                 const links = document.querySelectorAll('.inwidgetimage');
                                    links.forEach(link => {
                                        const el = link as HTMLElement;
                                        // Add a 'disabled' attribute (for custom styling or logic)
                                        el.removeAttribute('disabled');         
                                        el.style.pointerEvents = "auto";
                                        el.style.opacity = "1";                       
                                    });                               
                                }); 
                        }, 1000)
                    }

                    if (this.vehicle_type === 'used') {
                        this.restService.get_used_photogallary_images(this.data.dealercode, this.data.vin).subscribe((response) => {
                            this.vehicle_data = response;
                            var obj = JSON.parse(JSON.stringify(this.vehicle_data));
                            if (obj.status != "Vin not found") {
                                 DataHandler.dpPercentage = DataHandler.dpFinPercentage = 10
                                DataHandler.minimumPercentage = 0 //used vehicles no dealer preference for min downpay
                                DataHandler.defaultPayment = 'finance'
                                DataHandler.trim = obj.result.trim_desc;
                                DataHandler.inwidget_initial_popup = obj.result?.inwidget_initial_popup
                                DataHandler.initial_popup_isdelay  = obj.result?.initial_popup_isdelay
                                DataHandler.testdrive_disclimer =  obj.result?.testdrive_disclaimer;
                                DataHandler.dealerBC = obj.result?.dlr_bc;       
                                //  DataHandler.initial_popup_isdelay =  obj.result?.initial_popup_isdelay;
                                this.displaySP = obj.result?.is_display_sp
                                DataHandler.showroomTimingFilterUsed = obj.result?.dealer_office_timing.days_schedule_byname;
                                if (obj.result?.hero_image?.src_url?.thumbnail != null) {
                                    DataHandler.heroImage = obj.result?.hero_image?.src_url?.thumbnail;
                                }
                                else {
                                    DataHandler.heroImage = obj.result.hero_image?.src_url;
                                }
                                DataHandler.mandatory_phone = obj?.result?.lead_mandatory_contact;
                               
                                DataHandler.is_dms_enabled = obj?.result?.dms_enabled
                                DataHandler.photoGalleryImages = obj.result?.photo_images
                                DataHandler.dealerprice = obj.result?.msrp;
                                this.dealerprice = DataHandler.dealerprice;
                                DataHandler.msrp = this.vehicle_msrp = obj?.result?.msrp;
                                DataHandler.enableautofi = obj.result.credit_flag;
                                this.autofiEnable = DataHandler.enableautofi;
                                DataHandler.dealerName = obj.result?.dealer_name;
                                this.make_video = DataHandler.make = obj?.result?.make;
                                DataHandler.model = obj.result.model
                                DataHandler.year = obj.result.year;
                                DataHandler.showdelivery = obj.result.schedule_vehicle_delivery_status;
                                DataHandler.schedule_delivery_disclimer = obj.result.schedule_delivery_disclaimer;
                                DataHandler.showroomTimingFilter = obj.result.showroom_timings;
                                DataHandler.Vehicle_delivery = obj.result.delivery_status_vehicle_status;
                                this.dealer_phone = obj.result.dealer_phone;
                                this.dealername = obj.result.dealer_name;
                                this.tradeinpar = obj.result.trade_type;
                                DataHandler.paypalEnvironment = obj.result.paypal_environment;
                                DataHandler.paypalClientId = obj.result.client_id;
                                DataHandler.reserveCurrency = obj.result.currency;
                                DataHandler.display_vehicle_name = this.display_vehicle_name = obj?.result?.display_vehicle_name;
                                DataHandler.dealerName = obj.result.dealer_name;
                                DataHandler.customize_testdrive = obj.result.delivery_status_customize_testdrive;
                                this.showTestDriveBtn = DataHandler.customize_testdrive;
                                DataHandler.showroomTimingFilter = obj.result.showroom_timings;
                                if (this.no_inventory_message != '' && this.no_inventory_message != null) {
                                    if (this.no_inventory_message.includes("[[phone]]")) {
                                        this.is_phone_available = true;
                                        this.no_inventory_message = this.no_inventory_message.replace('[[phone]]', "");
                                    }
                                }
                                this.year = DataHandler.year = obj.result.year;
                                setTimeout(() => {
                                    this.restService.get_Used_DealerInfo(this.data.vin, this.data.dealercode).subscribe((response) => {
                                        this.dealerinforesponse = response;
                                        var obj = JSON.parse(JSON.stringify(this.dealerinforesponse));
                                        this.dealerInfo = obj.result.Dealer_info
                                        DataHandler.dealerzip = this.dealerInfo?.dealerZip
                                        DataHandler.vehicle_info = this.vehicle_info = obj.result.vehicle_information;
                                        DataHandler.dealerstate = obj.result.Dealer_info.dealerState
                                        DataHandler.dealerinfo = this.dealerInfo;
                                        this.vehicleinfo = obj.result.vehicle_information;
                                    });
                                }, 100);
                                this.idleService.initialize();
                                this.idleService.idle$.subscribe(s => this.submitAbandonedLead());
                                this.loaded = 1;
                                 this.loadPage();
                            } else {
                                this.loaded = -1
                            }
                        });
                         const links = document.querySelectorAll('.inwidgetimage');
                        links.forEach(link => {
                             const el = link as HTMLElement;
                            // Add a 'disabled' attribute (for custom styling or logic)
                            el.removeAttribute('disabled');         
                            el.style.pointerEvents = "auto";
                            el.style.opacity = "1";                          
                        }); 
                    }
                }
            }
        });

 

        var counter = 0
        this.intervel = setInterval(() => {
            if (this.loaded == 1 || counter == 10) {
                let timeout = this.page?.toLowerCase() == 'applycredit'? 1500:100;
                
                if (this.loaded == 1 && DataHandler.inwidget_initial_popup != 'R' && DataHandler.page =='' ){
                    if((DataHandler.firstname == null || DataHandler.firstname =='')
                        && (DataHandler.lastname == null || DataHandler.lastname =='')
                            && (DataHandler.email == null || DataHandler.email =='')
                         ){
                            setTimeout(() => {
                                this.removeOverlay();
                                if (DataHandler.inwidget_initial_popup == 'M') {
                                    DataHandler.dialogClose = false
                                }
                            }, timeout)
                         }else{
                             this.widgetCloseBtn = true;
                         }                
                }else{
                     this.widgetCloseBtn = true;
                }
                setTimeout(() => {
                    this.heightAdj();
                }, 3000);

                clearInterval(this.intervel)
            }

            counter += 1

        }, 1000);

        this.eventEmitterService.invokeTabClick.subscribe(((tabIndex: any) => {
            this.selectedTabIndex = tabIndex;
        }));

        this.eventEmitterService.subsVar = this.eventEmitterService.reserveNowDisable.subscribe((status: string, text: string) => {
            this.reserveNowButtonStatus = status;
            this.reserveNowButtonText = 'Offer Pending';
        });
      
       
        this.restService.get_vin_lock_status().subscribe((response) => {
            var arResponseData = JSON.parse(JSON.stringify(response));

            if (arResponseData.action == 'booked') {
                this.reserveNowButtonStatus = 'disable';
                this.reserveNowButtonText = 'Offer Pending';
            }

            else if (arResponseData.action == 'locked') {
                this.reserveNowButtonStatus = 'enable';
                this.reserveNowButtonText = 'Reserve';
            }

            else if (arResponseData.action == 'continue' || arResponseData.action == 'expired-saved' || arResponseData.action == 'saved') {
                this.reserveNowButtonStatus = 'enable';
                this.reserveNowButtonText = 'Reserve';
            }
        });
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), this.atLeastOneAlphabet]],
            lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), Validators.pattern(/^[a-zA-Z-.']{2,}$/), this.atLeastOneAlphabet]],
            zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
            Validators.minLength(4), Validators.maxLength(5)]],
            phonenumber: [
                '',
                [
                    Validators.maxLength(14),
                    this.forbiddenFirstDigitValidator(),
                    Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
                ]
            ],
            email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],

        });

       
    }

    ngOnDestroy() {
        this.observableService.reset();
        this.destroy$.next();
        this.destroy$.complete();
        this.subscription.unsubscribe();
        clearInterval(this.intervel)
    }
    loadPage(){
        setTimeout(()=>{                                                   
            if(this.loaded ==1){
                        //check which primary CTA clicked and 
                switch(this.page.toLowerCase()){
                    case 'testdrive' :  document.getElementById('testDriveBtn')?.click()
                        break;
                    case 'tradein' :  setTimeout(()=>{
                                    this.loadTradeIn() 
                                },1000);
                                    
                        break;
                    case 'applycredit' : setTimeout(()=>{
                                this.loadApplyCredit();
                                  },3000);
                        break;
                    case 'reservenow' : this.loadReserveNow();
                        break;

                }
                this.page ='';
            }
        },2000)
    }
   loadApplyCredit() {
     let applyCreditBtnExists = document.getElementById('applyForCredit') as HTMLElement;
        if(applyCreditBtnExists != undefined){
            document.getElementById('applyForCredit')?.click()
        }else{   
             this.loadCTAError()
        }
        
    }
    loadReserveNow(){ 
        let reserveNowBtnExists = document.getElementById('reserveNowBtn') as HTMLElement;
        if(reserveNowBtnExists != undefined){
            if(this.reserveNowButtonStatus == 'enable'){         
                this.displayReserveNow();                
            }else{           
               this.loadCTAError()
            }
        }else{
            this.loadCTAError()
        }
       
    }
    loadCTAError(){
        
            setTimeout(()=>{
            const initialdialogRef = DataHandler.initialClose = this.dialog.open(CTAErrorComponent, {
                    panelClass: ['widget_init_pop'],
                    data: {
                        
                    },
                    width: '50%',
                    height: 'auto', 
                    disableClose: true,
                    scrollStrategy: this.overlay.scrollStrategies.noop(),  
                });
            },1000)
    }
    loadTradeIn(){
        if(!this.isMobileScreen){
            const tradeTabIndex = this.tabGroup._tabs.toArray().findIndex(tab => tab.textLabel === 'Trade');
            if (tradeTabIndex !== -1) {
                this.selectedTabIndex = tradeTabIndex;
            } else {
                console.warn('Submit tab not found!');
            }
        }else{
           if (this.tradeSection && !this.hasNavigated) {
             this.hasNavigated = true;
             this.onTabClick('Trade-In');
             this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                 setTimeout(() => {
                     this.scrollToElementWhenAvailable('items-2', 15, 200);
                   }, 500);
             });
        }
        }
       
    }

    atLeastOneAlphabet(control: any) {
        const regex = /[a-zA-Z]+/;
        const valid = regex.test(control.value);
        return valid ? null : { atLeastOneAlphabet: true };
    }

    firstDigitValidator(control: FormControl) {
        const firstDigit = control.value?.toString().charAt(1);
        if (firstDigit === '0' || firstDigit === '1') {
            return { 'invalidFirstDigit': true };
        }
        return null;
    }

    keyPress(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];

        // Allow navigation or control keys
        if (allowedKeys.includes(event.key)) {
            return;
        }

        // Prevent non-digit input
        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }

    validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');
        this.isValidFlg = (phoneNumDigits.length == 0 || phoneNumDigits.length == 10);
        if (phoneNumDigits.length >= 6) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6));
        } else if (phoneNumDigits.length >= 3) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3));
        }
    }

    onPhoneNumberInput(event: any): void {
        const input = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
        let formatted = input;

        // Apply formatting based on input length
        if (input.length > 3) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
        }
        if (input.length > 6) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
        }

        // Set the formatted value back to the input and form control
        event.target.value = formatted;
        this.registerForm.get('phonenumber')?.setValue(formatted, { emitEvent: false });
    }


    forbiddenFirstDigitValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const v: string = control.value || '';
            if (v.trim() === '') {
                return null;
            }
            var onlyDigit = v.replaceAll('(','').replaceAll(')','').replaceAll('-','')
            if ((onlyDigit[0] === '0' || onlyDigit[0] === '1')) {
                return { invalidFirstDigit: true };
            }
            if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(v)) {
                return { exactLength: true };
            }
            return null;
        };
    }

    get f() { return this.registerForm.controls; }

    submittedFalse = false;
    submitted = false;
    submitDealerSuccessFlag = false;
    enableThanksuccess: any = false;
    dealerOpeningTimings: any;
    dealeraddress: string = '';
    dealerPhone: any = '';
    dealerWebsite: any = '';
    dealerDirection: any = '';
    dealerMapAreaLable: any = '';
    appreciate_text: any = '';
    showthankyou = false;
    initialSuccess = false;
    firstime = 0;


    onSubmit() {
        if (this.registerForm.invalid) {
            this.submittedFalse = true;
            return;
        }
        DataHandler.firstname = this.registerForm.controls["firstName"].value;
        DataHandler.lastname = this.registerForm.controls["lastName"].value;
        DataHandler.email = this.registerForm.controls["email"].value;
        DataHandler.phone = this.registerForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '');

        DataHandler.zipcode = this.registerForm.controls['zipCode'].value;
        if (this.firstime == 1) {
            ShiftDigitalHandler.shiftdigitalexecutor('submit to dealer end');
            ShiftDigitalHandler.shiftdigitalexecutor('close Review Payment option');
            this.firstime = 2;
        }
        this.submitted = true;
        this.submitDealerSuccessFlag = true;
        // DataHandler.dealer = this.data.dealercode;
        DataHandler.form_submitted = 1
        DataHandler.hint_comments = 'App-onSubmit-2269'
        this.restService.submit_lead_details().subscribe((response: any) => {
            DataHandler.currentSubmitType = "uexp";
            this.eventEmitterService.fnApplyCreditDisable();
            this.enableThanksuccess = false;
            this.restService.get_deliver_data("", this.data.dealercode).subscribe((response) => {
                var obj = JSON.parse(JSON.stringify(response));
                DataHandler.dealerinfo = obj.result.Dealer_info;
                // DataHandler.make = obj.result.make;
                this.dealername = DataHandler.dealerinfo.dealerName;
                this.dealerOpeningTimings = DataHandler.dealerinfo.open_today_timings;
                //this.dealeraddress = DataHandler.dealerinfo.dealerAddress1 + ', ' + DataHandler.dealerinfo.dealerCity + ', ' + DataHandler.dealerinfo.dealerState + ', ' + DataHandler.dealerinfo.dealerZip;
                this.dealeraddress =
  DataHandler.dealerinfo?.dealerAddress1 +
  (DataHandler.dealerinfo?.dealerAddress2 ? ', ' + DataHandler.dealerinfo?.dealerAddress2 : '') +
  ', ' + DataHandler.dealerinfo?.dealerCity +
  ', ' + DataHandler.dealerinfo?.dealerState +
  ', ' + DataHandler.dealerinfo?.dealerZip;
                this.dealerPhone = DataHandler.dealerinfo.phoneNumber;
                this.dealerOpeningTimings = DataHandler.dealerinfo.open_today_timings;
                this.dealerWebsite = DataHandler.dealerinfo.dlr_web_addr;
                this.dealerDirection = DataHandler.dealerinfo.GoogleMapDirectionUrl;
                this.dealerMapAreaLable = DataHandler.dealerinfo.GoogleMapAriaLable;
                this.appreciate_text = DataHandler.appreciate_text;
                this.enableThanksuccess = true;
                this.initialSuccess = true;
                this.showthankyou = true;
            });
        });


    }

    shiftdigitalshow: any = 0;

    heightAdj() {
        if(!DataHandler.isMobileScreen){
        const rightcontent = document.querySelector('.widget_item-for') as HTMLElement;
        const setHeight = rightcontent.offsetHeight;
        const matbody = document.querySelector('.mat-mdc-tab-body-wrapper') as HTMLElement;
        setTimeout(() => {
            this.renderer.setStyle(matbody, 'height', setHeight + 'px');
        }, 500);
        }
    }

    tabClick(obj: any) {
        //DataHandler.userInteraction = true; 
        this.submitTab = false;
        if (obj?.tab.textLabel == 'Details' || obj == 'Details') {
            this.observableService.setTestDrive(true)
            this.adobe_sdg_event('vehicle-details');
            this.isApplyCreditClicked = false;
            this.observableService.setDisplayTestDrive(true);
            this.ga4dealerService.submit_to_api_ga4dealer('Details').subscribe((response: any) => { });
            this.heightAdj();
        }
        if (obj.tab.textLabel == 'Trade') {
            if (this.shiftdigitalshow == 0) {
                ShiftDigitalHandler.shiftdigitalexecutor('tradein show');
                setTimeout(() => {
                    ShiftDigitalHandler.shiftdigitalexecutor('tradein start');
                }, 1000);

                this.shiftdigitalshow = 1;
            }
            this.adobe_sdg_event('tradein');
            this.observableService.setDisplayTestDrive(false);

            if (this.tradeinpar == 'bb') {
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => {
                });
                this.ga4dealerService.fire_asc_events('TradeInBB').subscribe((response: any) => { });
            }
            if (this.tradeinpar == 'kbb') {
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('TradeInKBB').subscribe((response: any) => { });
            }

            setTimeout(() => {
                this.heightAdj();
            }, 2000);
        }

        if (obj.tab.textLabel == 'Protection' || obj.tab.textLabel == 'Protection & Accessories') {
            ShiftDigitalHandler.shiftdigitalexecutor('Service and Protection');
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('protection');
            this.observableService.setDisplayTestDrive(false);
            if (DataHandler.custom_plan_added == 0) {
                //when user changing the zipcode that time we are calling the respected selectedPayemt tab api 
                if (this.previousZipCode != DataHandler.zipcode) {
                    DataHandler.leaseServiceContract = false;
                    DataHandler.financeServiceContract = false;
                    DataHandler.cashServiceContract = false;
                    this.previousZipCode = DataHandler.zipcode
                    //to call the three api with latest zipcode
                }

                if (!DataHandler.leaseServiceContract || DataHandler.previousleaseterm != DataHandler.leasedafaultterm) {
                    DataHandler.previousleaseterm = DataHandler.leasedafaultterm
                    if (this.selectedPaymentType == 'lease') {
                        DataHandler.leaseServiceContract = true
                        this.observableService.getLeasePlane();
                    }
                }

                if (!DataHandler.financeServiceContract || DataHandler.previousfinanceterm != DataHandler.financedafaultterm) {
                    DataHandler.previousfinanceterm = DataHandler.financedafaultterm
                    if (this.selectedPaymentType == 'finance') {
                        DataHandler.financeServiceContract = true
                        this.observableService.getFinancePlane();
                    }
                }

                if (!DataHandler.cashServiceContract) {
                    if (this.selectedPaymentType == 'cash') {
                        DataHandler.cashServiceContract = true
                        this.observableService.getCashPlane();
                    }
                }
            }
            this.ga4Service.submit_to_api('service-protection', '', '', '', '', '', 'Service and Protection').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtectionView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('ServiceProtectionView').subscribe((response: any) => { });

            setTimeout(() => {
                this.heightAdj();
            }, 2000);
        }

        if (obj.tab.textLabel == 'Accessories') {
            ShiftDigitalHandler.shiftdigitalexecutor('accessories');
            ShiftDigitalHandler.shiftdigitalexecutor('submit');
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('accessories');
            this.observableService.setDisplayTestDrive(false);
            this.ga4Service.submit_to_api('Accessoriesnew', '', '', '', '', '', 'Accessories').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('AccessoriesView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('AccessoriesView').subscribe((response: any) => { });
            setTimeout(() => {
                this.heightAdj();
            }, 1000);

        }

        if (obj.tab.textLabel == 'Submit' || obj.tab.textLabel == 'Review') {
            ShiftDigitalHandler.shiftdigitalexecutor('accessoriesfinish');
            this.observableService.setTestDrive(false)
            this.adobe_sdg_event('submit');
            this.observableService.setDisplayTestDrive(false);
            this.submitTab = true;
            this.ga4dealerService.submit_to_api_ga4dealer('DeliverySubmitView').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('DeliverySubmitView').subscribe((response: any) => { });
            this.heightAdj();
        }
        // this.showPreQualify = false;
        this.showTestDrive = false;
    }

    addGTMToHeader() {
        throw new Error('Method not implemented.');
    }

    addGTMToBody() {
        throw new Error('Method not implemented.');
    }

    private _setDealerZip(obj: any) {
        if (DataHandler.vehicle_info?.vehicle_type?.toLowerCase() === 'used') {
            return obj?.result?.dealerZip;
        } else {
            return this.data.zipcode;
        }
    }

    private _setVehicleMsrp(payload: any) {
        if (payload && payload.vehicle_info.vehicle_type.toLowerCase() === 'new') {
            return payload.pricingInfo.dealerPrice !== 0 ? payload.pricingInfo.dealerPrice : payload.pricingInfo.msrp;
        } else {
            return payload.pricingInfo.dealerPrice;
        }
    }

    private _setVehicleInfo(vehicleInfo: any) {
        if (vehicleInfo && vehicleInfo.vehicle_type.toLowerCase() === 'new') {
            return vehicleInfo;
        } else {
            vehicleInfo.vehicle_type = 'used';
            return vehicleInfo;
        }
    }

    submitAbandonedLead() {
        if (DataHandler.form_submitted == 0) {
            ShiftDigitalHandler.shiftdigitalexecutor('drop save');
            this.ga4Service.submit_to_api('Idlelead', DataHandler.getGlobalVisitorsIds, '', '', '', '', '').subscribe((response: any) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('Idlelead').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('Idlelead').subscribe((response: any) => { });
            if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '' && DataHandler.zipcode != '') {
                DataHandler.form_submitted = 1;
                DataHandler.currentSubmitType = "ideal";
                if (DataHandler.extraParameter != '') {
                    DataHandler.currentSubmitType = DataHandler.currentSubmitType + '-' + DataHandler.extraParameter;
                }
                DataHandler.form_submitted = 1
                DataHandler.hint_comments = 'app-submitAbandonedLead-Method-2440-ideal-case'
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                    //DataHandler.currentSubmitType = "";
                });
            }
        }
    }

    displayReserveNow() {
        DataHandler.userInteraction = true; 
        ShiftDigitalHandler.pageload('Reserve now');
        if (DataHandler.isMobileScreen)
            this.adobe_sdg_event('reserve-vehicle');
        this.showReserveNowComponent = true;
        this.showHideMainContent = true;
        this.showTestDrive = false;
        this.showApplyCreditComponent = false;
        this.ga4Service.submit_to_api('ReserveNow', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('ReserveNow').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('ReserveNow').subscribe((response: any) => { });
    }

    openTestDrive() {
         DataHandler.userInteraction = true; 
        this.showHideMainContent = true;
        this.showTestDrive = true;
        this.showReserveNowComponent = false;
        this.showApplyCreditComponent = false;
        this.observableService.setShowTestDriveSubject(true)
    }

    closeTestDrive() {
    }

    openHowItWorks() {
        this.showHowItWorks = 1;
        MerkleHandler.merkleexecutor('how-its-works', 1);
    }

    hideHowItWorks() {
        this.showHowItWorks = 0;
        MerkleHandler.merkleexecutor('how-its-works-close', 1);
    }

    goToPage(event?: any) {
        if (this.showReserveNowComponent) {
            if (event?.isTrusted) {
                this.adobe_sdg_event('back-reserve-dialog');
            }
        }
        if (this.showTestDrive) {
            if (event?.isTrusted) {
                this.adobe_sdg_event('back-test-drive-dialog');
            }
        }

        if (this.showApplyCreditComponent) {
            if (event?.isTrusted) {
                this.adobe_sdg_event('back-apply-credit-dialog');
            }
        }
        this.showApplyCreditComponent = false;
        this.isApplyCreditClicked = false;
        this.showHideMainContent = false;
        //this.showPreQualify = false;
        this.showTestDrive = false;
        this.showReserveNowComponent = false;
        setTimeout(() => {
            this.heightAdj();
        }, 100)
    }

    closeApplycredit() {
        this.showApplyCreditComponent = false;
        this.showHideMainContent = false;
        setTimeout(() => {
            this.heightAdj();
        }, 100)
    }

    /* initialDialog() {
       if (DataHandler.initial_popup_isdelay != 0 && DataHandler.initial_popup_isdelay != undefined) {
             this.delayinitialDialog();
             fromEvent(document, 'click').subscribe(() => { console.log('clicked'); this.delayinitialDialog(); });
             fromEvent(document, 'keydown').subscribe(() => { console.log('key pressed'); this.delayinitialDialog(); });
         } else { 
             this.openinitialDialog();
         }
     }*/

    /*delayinitialDialog() {
        clearTimeout(DataHandler.timeoutInitialPopup);
        if (!this.isOpenInitialPopup && DataHandler.firstname == '' && DataHandler.lastname == '' && DataHandler.email == '' && this.loaded == 1) {

            DataHandler.timeoutInitialPopup = setTimeout(() => {
                if (!DataHandler.is_lead_form_open) {
                    this.openinitialDialog();
                }
            }, DataHandler.initial_popup_isdelay * 1000);
        }
    }*/



    removeOverlay() {
        // this.observableService.setlockDetailsSpecs(false)
        //this.showoverlay = false
        clearTimeout(this.timeoutInitialPopup)
        if(DataHandler.initial_popup_isdelay !="" && DataHandler.initial_popup_isdelay != null && DataHandler.initial_popup_isdelay !=0){
             this.widgetCloseBtn = true;
            DataHandler.clearInitialTimer = this.timeoutInitialPopup = setTimeout(()=>{    
                if( !DataHandler.userInteraction ){
                    if(DataHandler.inwidget_initial_popup == 'M') this.widgetCloseBtn = false;
                    this.openinitialDialog();
                }
            },DataHandler.initial_popup_isdelay *1000)

        }else{
            this.openinitialDialog()    
        }
                    
        
    }

    openinitialDialog() {
        DataHandler.is_lead_form_open = true;
        this.isOpenInitialPopup = true;
        if (DataHandler.isMobileScreen) {
            var width = '90%'
        }
        else {
            width = '52%'
        }
        let cssClass: any = ''
        if (DataHandler.inwidget_initial_popup == 'M') {
            cssClass = ['widget_init_pop', 'widgetClose']
        } else {
            cssClass = ['widget_init_pop']
        }
        if(DataHandler.inwidget_initial_popup =='D'){
            this.widgetCloseBtn = true;
        }else{
            this.widgetCloseBtn = false;
        }
        
        //  this.adobe_sdg_event('open-inital-lead-dialog');
        const initialdialogRef = DataHandler.initialClose = this.dialog.open(InitialDialog, {
            panelClass: cssClass,
            data: {
                message: this.vehicle_model,
                vin: this.vin.substring(9, 11)
            },
            width: width,
            height: 'auto',
            // position: {
            //   top: '5%',
            //   left: '10%'
            // },
            disableClose: true,
            scrollStrategy: this.overlay.scrollStrategies.noop(),

            // backdropClass: 'initialDialog-backdrop',
        });
        initialdialogRef.afterClosed().subscribe((result) => {
            //MerkleHandler.merkleexecutor('inwidget:vehicle-information:first-lead-submission-popup:close');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('inwidget:vehicle-information:first-lead-submission-popup:close');
            DataHandler.is_lead_form_open = false;
        });

    }

    openPrequalDialog(event: any) {
        DataHandler.userInteraction = true;
        if (event == 'prompt-yes') {
            this.adobe_sdg_event('open-prequalify-form-prompt-yes');
        } else if (event == 'form-confirmation') {
            this.adobe_sdg_event('open-prequal', 'form-confirmation');
        } else if (event == 'payment-options-prequal') {
            this.adobe_sdg_event('open-prequal', 'payment-options');
        }
        if (DataHandler.isMobileScreen) {
            var width = '90%'
        }
        else {
            width = '70%'
        }
        const prequaldialogRef = this.dialog.open(PrequalDialog, {
            panelClass: ['widget_init_pop'],
            width: width,
            height: 'auto',
            // position: {
            //   top: '5%',
            //   left: '10%'
            // },
            disableClose: true,
            scrollStrategy: this.overlay.scrollStrategies.noop()
            // backdropClass: 'initialDialog-backdrop',
        });
        prequaldialogRef.afterClosed().subscribe((result) => {
            //MerkleHandler.merkleexecutor('inwidget:vehicle-information:first-lead-submission-popup:close');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('inwidget:vehicle-information:first-lead-submission-popup:close');
            //DataHandler.is_lead_form_open = false;
            //this.adobe_sdg_event('close-inital-lead-dialog');
        });

    }

    onAccessoriesTabClick() {
        this.accessoriesClicked = false;
    }

    eventType!: string;
    sdgPageLoad(){// Calling Adobe SDG page load for vehicle-details once prequal is closed
        this.adobe_sdg_event('vehicle-details-prequal')
    }
    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '') {
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };

            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            let pageNameChange = false;
            if (event_type == "vehicle-details" && AdobeSDGHandler.responsiveState() != 'desktop') return
            if (event_type === 'submit-to-dealer' && param === 'page-load') {
                pageLoad.pageType = "overlay";
                if (this.vehicle_type === 'new') {
                    pageLoad.pageName = "add-accessories-before-submit-to-dealer";
                }
                else {
                    pageLoad.pageName = "submit-to-dealer-form";
                }
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }
            if (event_type == 'page-load') {
                //   DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }

            if (event_type == 'error-display') {
                errorDisplay.message = param;
                errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }

            interactionClick.site = "dealer";
            interactionClick.type = "nav";

            if (event_type == "logo-click") {
                interactionClick.location = "topnav";
                interactionClick.description = "logo";
            }

            if (event_type == "close-main-dialog") {
                interactionClick.location = "topnav";
                interactionClick.description = "close-eshop-modal";
            }
            if (event_type == "back-reserve-dialog") {
                interactionClick.location = "topnav";
                interactionClick.description = "go-back";
                interactionClick.page = 'reserve-vehicle-form';
            }
            if (event_type == "close-inital-lead-dialog") {
                interactionClick.page = 'first-form';
                interactionClick.location = "first-form-overlay";
                interactionClick.description = "close";
            }

            if (event_type == "open-inital-lead-dialog") {
                interactionClick.page = 'build-your-deal:vehicle-details';
                interactionClick.location = "vehicle-details";
                interactionClick.description = "open-first-form";
            }

            if (event_type == "back-test-drive-dialog") {
                interactionClick.page = 'schedule-a-test-drive';
                interactionClick.location = "topnav";
                interactionClick.description = "go-back";
            }

            if (event_type == "back-apply-credit-dialog") {
                interactionClick.page = 'apply-for-credit-form';
                interactionClick.location = "topnav";
                interactionClick.description = "go-back";
            }

            if (event_type == "vehicle-details" && AdobeSDGHandler.responsiveState() == 'desktop') {
                interactionClick.location = "step-navigation";
                interactionClick.description = "build-your-deal:vehicle-details";
                pageLoad.pageName = "build-your-deal:vehicle-details";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

             if (event_type == "vehicle-details-prequal") {   
                switch(this.selectedTabIndex){
                    case 0: pageLoad.pageName = "build-your-deal:vehicle-details";
                        DataHandler.SDGEvents.interactionClick.page = "build-your-deal:vehicle-details";
                        break;
                    case 1:pageLoad.pageName = "build-your-deal:trade-in";
                    DataHandler.SDGEvents.interactionClick.page = "build-your-deal:trade-in";
                        break;
                    case 2:pageLoad.pageName = "build-your-deal:service-and-protection";
                    DataHandler.SDGEvents.interactionClick.page = "build-your-deal:service-and-protection";
                        break;
                    case 3:  pageLoad.pageName = this.make_url?.toLowerCase() !='alfa' ? 
                                     "build-your-deal:accessories" : "build-your-deal:confirm-your-deal";
                             DataHandler.SDGEvents.interactionClick.page = this.make_url?.toLowerCase() !='alfa' ? 
                                     "build-your-deal:accessories" : "build-your-deal:confirm-your-deal";
                        break;
                    case 4:pageLoad.pageName = "build-your-deal:confirm-your-deal";
                            DataHandler.SDGEvents.interactionClick.page = "build-your-deal:confirm-your-deal";
                        break;                        
                }
                 pageLoad.pageType = "build-your-deal";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
                return;
            }
            if (event_type == "vehicle-details-page" && AdobeSDGHandler.responsiveState() != 'desktop') {
                interactionClick.location = "step-navigation";
                interactionClick.description = "build-your-deal:vehicle-details";
                pageLoad.pageName = "build-your-deal:vehicle-details";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }
            if (event_type == 'open-prequal') {
                if (param == 'form-confirmation') {
                    interactionClick.location = "first-form-submission-confirmation-overlay";
                    interactionClick.page  = 'first-form-submission-confirmation';
                     interactionClick.description = "open-prequalify-form"
                } else if (param == 'payment-options') {
                    interactionClick.location = "payment-options-" + AdobeSDGHandler.responsiveState();
                    if (AdobeSDGHandler.responsiveState() == 'mobile')
                        interactionClick.location = "vehicle-information"
                    interactionClick.name = 'prequalify-form'
                    interactionClick.description = "open-prequalify-form"
                }

                pageLoad.pageType = "overlay";
                pageLoad.pageName = "prequalify-form";
                pageLoad.site = "dealer";
                

                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type === 'open-prequalify-form-prompt') {
                pageLoad.pageName = "prequalify-form-prompt";
                pageLoad.pageType = "overlay";
                pageLoad.site = "dealer";
                pageNameChange = true;
                return;
            }
            if (event_type == 'open-prequalify-form-prompt-yes') {
                interactionClick.location = "prequalify-form-prompt";
                interactionClick.page = 'prequalify-form-prompt-overlay';
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "prequalify-form";
                pageLoad.site = "dealer";
                interactionClick.description = "prequalify-form-prompt-yes"
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }
            if (event_type == 'open-prequalify-form-prompt-no') {
                interactionClick.location = "prequalify-form-prompt";
                interactionClick.description = "prequalify-form-prompt-no"
            }

            if (event_type == "vehicle-details-scroll") {
                pageLoad.pageName = "build-your-deal:vehicle-details";
                interactionClick.description = "build-your-deal:vehicle-details";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "tradein-scroll") {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:trade-in";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "protection-scroll") {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:service-and-protection";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "accessories-scroll") {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:accessories";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "submit-scroll") {
                pageLoad.pageName = "build-your-deal:confirm-your-deal";
                pageLoad.pageType = "build-your-deal";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }



            if (event_type == "tradein") {
                interactionClick.location = "step-navigation";
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:trade-in";
                pageLoad.site = "dealer";
                interactionClick.description = "build-your-deal:trade-in"
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "protection") {
                interactionClick.location = "step-navigation";
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:service-and-protection";
                pageLoad.site = "dealer";
                interactionClick.description = "build-your-deal:service-and-protection";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == "accessories") {
                interactionClick.location = "step-navigation";
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:accessories";
                interactionClick.description = "build-your-deal:accessories";
                pageLoad.site = "dealer";
                pageNameChange = true;
                if (this.accessoriesClicked) {
                    try {
                        setTimeout(() => {
                            AdobeSDGHandler.eventLogger("page-load", pageLoad);
                        });
                    } catch (e) {
                        console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                    }
                } else {
                    try {
                        setTimeout(() => {
                            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
                            AdobeSDGHandler.eventLogger("page-load", pageLoad);
                        });
                    } catch (e) {
                        console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                    }
                }
            }

            if (event_type == "submit") {
                interactionClick.location = "step-navigation";
                pageLoad.pageName = "build-your-deal:confirm-your-deal";
                pageLoad.pageType = "build-your-deal";
                pageLoad.site = "dealer";
                interactionClick.description = "build-your-deal:confirm-your-deal";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
            }

            if (event_type == 'apply-credit') {
                interactionClick.location = "vehicle-action-buttons";
                interactionClick.description = 'credit-application';
            }

            if (event_type == 'reserve-vehicle') {
                interactionClick.location = "vehicle-action-buttons";
                interactionClick.description = 'reserve-vehicle';
            }

            if (event_type == 'submit-to-dealer') {
                interactionClick.location = "vehicle-action-buttons";
                interactionClick.description = 'submit-to-dealer';
            }


            if (event_type == 'trade-in') {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:trade-in";
                pageLoad.site = "dealer";
                pageNameChange = true;
            }

            if (pageNameChange) {
                DataHandler.SDGEvents.pageLoad = { ...pageLoad };
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
            }
            if (event_type !== "accessories" && event_type !== 'tradein-scroll' && event_type !== 'protection-scroll' && event_type !== 'accessories-scroll' && event_type !== 'submit-scroll' && event_type !== 'vehicle-details-scroll') {
                AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
            }

        } catch (e) {
            console.log('MainPageComponent-adobe_sdg_event issue', e);
        }
    }
}


@Component({
    selector: 'app-initial-lead',
    standalone: true,
    imports: [MaterialModule, PhoneFormatterDirective],
    templateUrl: './initial-lead.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class InitialDialog implements OnInit, AfterViewInit, AfterViewChecked {
    registerForm!: FormGroup;
    vehicle_model: any;
    vehicle_make: any;
    submitted = false;
    firstime = 0;
    par: any;
    showdelivery: any;
    disclaimerAge: any;
    vincode: any;
    inwidget_initial_popup: any;
    initialSuccess: boolean = false;
    isValidFlg: boolean = true;
    privateoffer: any;
    privateofferstatus: any;
    termsandcondition = 0;
    heroImage: any;
    model: any;
    year: any;
    dealername: any;
    showthankyou: boolean = false;
    GaGoalFirsttime: any = 0;
    initial_popup_text: any;
    lineOfText: any;
    arrayOfWords: any;
    make_url: any;
    mandatoryphone: any;
    timeoutInitialPopup: any;
    sdSessionId: any;
    dealercode: any;
    is_commnet_box_enable: any
    isFocused = false;
    initialFormFilled = false;
    creditEstimator = false;
    device:any;
    initalClose :boolean = false;
    windowWidth: number;
    windowHeight: number;
    isDevice: boolean;
    private hasFocused: boolean = false;
    dealerBC :any=''

    @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;


    constructor(private formBuilder: FormBuilder, public dialog: MatDialog, public initialdialogRef: MatDialogRef<MainPageComponent>, private eventEmitterService: EventEmitterService, @Inject(MAT_DIALOG_DATA) public data: DialogData, private restService: RestService, private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, private observableService: ObservableLiveData, public overlay: Overlay, private viewportScroller: ViewportScroller) {
        DataHandler.vehicle_model = this.vehicle_model;
        this.vincode = data.vin;
        this.showdelivery = DataHandler.showdelivery;
        this.disclaimerAge = DataHandler.disclaimerAge;
        this.inwidget_initial_popup = DataHandler.inwidget_initial_popup;
        this.heroImage = DataHandler.heroImage;
        this.model = DataHandler.display_vehicle_name;
        this.year = DataHandler.year;
        this.dealername = DataHandler.dealerinfo?.dealerName;
        this.initial_popup_text = DataHandler.initial_popup_text;
        this.make_url = DataHandler.make_url;
        this.mandatoryphone = DataHandler.mandatory_phone;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.isDevice = window.innerWidth < 1021;


        this.is_commnet_box_enable = DataHandler.is_commnet_box_enable
        


        if (this.GaGoalFirsttime == 0) {
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('Inital-Lead-GaGoal');
            this.GaGoalFirsttime = 1;
        }
        if (this.initial_popup_text != null) {
            this.lineOfText = this.initial_popup_text;
            this.arrayOfWords = this.lineOfText?.split("||");
        }
        this.restService.setVisiblePopUp(true);
    }
    
    @HostListener('window:resize', ['$event'])
    onResize(event?: Event): void {
	  this.isDevice = window.innerWidth < 1021;
	}

    shouldFocusFirstName(): boolean {
        return (!this.initialSuccess && this.device && !this.showthankyou && !this.creditEstimator) || !this.device;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
          if (this.firstNameInput?.nativeElement && !this.firstNameInput.nativeElement.disabled) {
            if(!this.device){
                this.firstNameInput.nativeElement.focus();
                this.registerForm.get('firstName')?.markAsPristine();
                this.registerForm.get('firstName')?.markAsUntouched();
          }
           
          }
        }, 300);
      }
      

    ngAfterViewChecked(): void {
        if (!this.hasFocused && this.shouldFocusFirstName() && this.firstNameInput?.nativeElement) {
          setTimeout(() => {
             if(!this.device){ 
            this.firstNameInput.nativeElement.focus();
            this.hasFocused = true;
             }
          }, 0);
        }
    }

    onFocus() {
        this.isFocused = true;
    }

    onBlur() {
        this.isFocused = false;
    }


    validateInput(event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value;
        const pattern = /^[a-zA-Z-.']*$/; // Only alphanumeric characters allowed

        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    initialevent() {
        if (this.firstime == 0) {
            AscHandler.Ascexecutor('lead-form-start');
            ShiftDigitalHandler.shiftdigitalexecutor('Initial popup form start');
            MerkleHandler.merkleexecutor('review-submit-start-first');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('review-submit-start-first');
            this.adobe_sdg_event('initial-form-start');
            this.ga4Service.submit_to_api('InitialLeadFormStart', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('InitialLeadFormStart').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('InitialLeadFormStart').subscribe((response: any) => { });
            this.firstime = 1;
        }
    }

    openPrequalDialog(eventType: any = '') {
        this.closepop()
        setTimeout(() => {
            this.observableService.openPrequalDialog(eventType)
        }, 100)
    }

    closeWidget() {
        this.eventEmitterService.closeWidget();
        clearInterval(this.timeoutInitialPopup);
    }

    openvideo() {
        this.eventEmitterService.launchvideoplayer();
        MerkleHandler.merkleexecutor('modal:initial-popup:how-itworks-link');
    }

    keyPress(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
        if (allowedKeys.includes(event.key)) return;
        if (!/^\d$/.test(event.key)) event.preventDefault();
        this.initialevent();
      }

    

    validateNumericInput(event: any): void {
        const input = event.target.value;
        // Remove any non-numeric characters
        event.target.value = input.replace(/[^0-9]/g, '');
    }
    validateNumber(event: any) {
        const allowedChars = /[0-9]/; // Allow only numbers
        const specialKeys = ['Backspace','Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
        if (!allowedChars.test(event.key) && !specialKeys.includes(event.key)) {
            event.preventDefault(); // Prevent the character from being entered

        }

        const keyCode = event.keyCode;
        const excludedKeys = [8, 9, 37, 39, 46];
        if (!((keyCode >= 48 && keyCode <= 57) ||
            (keyCode >= 96 && keyCode <= 105) ||
            (excludedKeys.includes(keyCode)))) {
            event.preventDefault();
        }
    }

    validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');
        this.isValidFlg = (phoneNumDigits.length == 0 || phoneNumDigits.length == 10);
        if (phoneNumDigits.length >= 6) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6));
        } else if (phoneNumDigits.length >= 3) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3));
        }
    }

    firstDigitValidator(control: FormControl) {
        //const firstDigit = control.value?.toString().charAt(1);
        const rawValue = control.value || '';
  const firstDigit = rawValue.replace(/\D/g, '');
        if (firstDigit.length >= 1 && firstDigit === '0' || firstDigit === '1') {
            return { 'invalidFirstDigit': true };
        }
        return null;
    }
    validateZipcode(event: any) {
        const input = Number(event.target.value.replace(/\D/g, ''));
        if (event.target.value.length > 1 && input == 0) {
            this.registerForm.controls["zipCode"].setValue('')
            return;
        }
    }

    forbiddenFirstDigitValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            // Extract the first digit of the area code
            const matches = value.match(/^\((\d)/);
            if (matches && (matches[1] === '0' || matches[1] === '1')) {
                return { invalidFirstDigit: true }; // Return an error if invalid
            }

            return null; // Valid input
        };
    }

    atLeastOneAlphabet(control: any) {
        const regex = /[a-zA-Z]+/; // Regular expression to match alphabet characters
        const valid = regex.test(control.value); // Check if the control value contains at least one alphabet character
        return valid ? null : { atLeastOneAlphabet: true }; // Return null if valid, or the validation error object if invalid
    }
    private formatPhoneNumber(phoneNumberControl: AbstractControl): void {
        if (!phoneNumberControl) return;

        phoneNumberControl.valueChanges.subscribe(value => {
            let newVal = value?.replace(/\D/g, '');

            if (newVal?.length === 0) {
                newVal = '';
            } else if (newVal?.length <= 3) {
                newVal = `(${newVal}`;
            } else if (newVal?.length <= 6) {
                newVal = `(${newVal.slice(0, 3)}) ${newVal.slice(3)}`;
            } else if (newVal?.length > 6) {
                newVal = `(${newVal.slice(0, 3)}) ${newVal.slice(3, 6)}-${newVal.slice(6, 10)}`;
            }

            if (value !== newVal) {
                phoneNumberControl.setValue(newVal, { emitEvent: false });
            }
        });
    }

    private exactLengthValidator(requiredLength: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const digitsOnly = (control.value || '').replace(/\D/g, '');
            return digitsOnly.length !== requiredLength
                ? { exactLength: { requiredLength, actualLength: digitsOnly.length } }
                : null;
        };
    }

    ngOnInit() {
        setTimeout(()=>{
            this.initalClose = true;
        },300);
        this.device = DataHandler.isMobileScreen
        this.dealercode = DataHandler.dealer;
        this.dealerBC  = DataHandler.dealerBC;

        if (DataHandler.mandatory_phone == 'Y') {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"),  this.atLeastOneAlphabet]],
                zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(4), Validators.maxLength(6)]],
                 phonenumber: ['', [Validators.required,Validators.pattern(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/),Validators.maxLength(14), this.nanpPhoneValidator()
                 ]],
                email: ['', [Validators.required]],
                acceptTerms: [false, null],
                Termsandcondition: [true, Validators.requiredTrue],
                commentSection: ['', '']
            });
            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            this.registerForm.controls["email"].setValue(DataHandler.email);

            if (DataHandler.phone) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone); // Create a utility for formatting raw strings
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            const phoneNumberControl = this.registerForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }

            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
            this.registerForm.controls["Termsandcondition"].setValue(false);
        } else {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(4), Validators.maxLength(5)]],
                phonenumber: ['', [Validators.maxLength(14), this.nanpPhoneValidator()
                ]],
                email: ['', [Validators.required]],
                acceptTerms: [false, null],
                Termsandcondition: [true, Validators.requiredTrue],
                commentSection: ['', '']
            });
            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            this.registerForm.controls["email"].setValue(DataHandler.email);

            if (DataHandler.phone) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone); // Create a utility for formatting raw strings
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            const phoneNumberControl = this.registerForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }

            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
            this.registerForm.controls["Termsandcondition"].setValue(false);
        }

        const dialogSurface = document.querySelector('.widget_init_pop') as HTMLElement;
        if (!DataHandler.isMobileScreen) {
            if (dialogSurface) {
                dialogSurface.style.overflow = 'auto'; // Reset transform dynamically
            }
        }
        this.adobe_sdg_event('page-load', 'form-load');
    }
    private formatRawPhoneNumber(phoneNumber: string): string {
        let newVal = phoneNumber.replace(/\D/g, '');

        if (newVal.length === 0) {
            return '';
        } else if (newVal.length <= 3) {
            return `(${newVal}`;
        } else if (newVal.length <= 6) {
            return `(${newVal.slice(0, 3)}) ${newVal.slice(3)}`;
        } else if (newVal.length > 6) {
            return `(${newVal.slice(0, 3)}) ${newVal.slice(3, 6)}-${newVal.slice(6, 10)}`;
        }
        return newVal;
    }

    nanpPhoneValidator(): ValidatorFn {
        const fullPattern = /^\([2-9]\d{2}\) [2-9]\d{2}-\d{4}$/;

        return (control: AbstractControl): ValidationErrors | null => {
            const v: string = control.value || '';
            if (v.trim() === '') {
                return null;
            }

            if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(v)) {
                return { exactLength: true };
            }

            if (!fullPattern.test(v)) {
                return { invalidFirstDigit: true };
            }

            return null;
        };
    }


    onPhoneNumberInput(event: any): void {
        const input = event.target.value.replace(/\D/g, '');


        let formatted = input;
        if (input.length > 3) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
        }
        if (input.length > 6) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
        }

        event.target.value = formatted;

        this.registerForm.get('phonenumber')?.setValue(formatted, { emitEvent: false });
    }


    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        if (this.registerForm.invalid) {
            this.adobe_sdg_event('error-display', 'error', 'Invalid form fields', 'form-validation');
            MerkleHandler.merkleexecutor('review-submit-invalid');
            return;
        }
       
        DataHandler.firstname = this.registerForm.controls["firstName"].value;
        DataHandler.lastname = this.registerForm.controls["lastName"].value;
        DataHandler.email = this.registerForm.controls["email"].value;
        //DataHandler.phone = this.registerForm.controls["phonenumber"].value;
        DataHandler.phone = this.registerForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '');

        DataHandler.zipcode = this.registerForm.controls["zipCode"].value;
        // DataHandler.LatestCommentValue = this.registerForm.controls["commentSection"].value;
         if(DataHandler.page.toLowerCase() == 'applycredit'){
            this.eventEmitterService.loadPIInfoEvent();
         }else if(DataHandler.page.toLowerCase() == 'testdrive'){
            this.eventEmitterService.loadTestDrivePIInfoEvent();
         }if(DataHandler.page.toLowerCase() == 'reservenow'){
            this.eventEmitterService.loadReserveNowPIInfoEvent();
         }

        //DataHandler.sdSessionId = (document.getElementById("shift_sessionid") as HTMLInputElement).value;

        let timer = setInterval(() => {
            DataHandler.sdSessionId = (document.getElementById("shift_sessionid") as HTMLInputElement).value;
        }, 1000);
        clearInterval(timer);

        if (this.firstime == 1) {
            AscHandler.Ascexecutor('lead-form-submit');
            ShiftDigitalHandler.shiftdigitalexecutor('Initial popup form submit');
            this.adobe_sdg_event('initial-form-submit');
            this.ga4dealerService.submit_to_api_ga4dealer('InitialLeadFormEnd').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('InitialLeadFormEnd').subscribe((response: any) => { });

            MerkleHandler.merkleexecutor('review-submit-end-first');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('review-submit-end-first');
            this.ga4Service.submit_to_api('InitialLeadFormEnd', '', '', '', '', '', '').subscribe((response) => { });
            this.firstime = 2;
            this.initialFormFilled = true;
            this.restService.setInitialFormFilled(true);
        }
        DataHandler.termscondtioncheckbox = true;

        if (DataHandler.leadtrack == 0) {
            this.restService.track_lead().subscribe((response) => {
            });
            DataHandler.leadtrack = 1;
        }
        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

        DataHandler.submitdealer = this.registerForm.value;

        this.eventEmitterService.disableviewoffer(0);

        //this.initialdialogRef.close();

        this.vehicle_make = DataHandler.make;
        // enable the dealer discount and refresh payment calculator 
        DataHandler.dealerdiscount = "true";
        this.restService.private_offers().subscribe((response: any) => {
            this.privateoffer = JSON.parse(JSON.stringify(response));
            this.adobe_sdg_event('page-load', 'form-submission-confirmation');
            if (this.privateoffer != undefined && this.privateoffer != null) {
                DataHandler.private_Offer_Status = this.privateoffer.status;
                if (DataHandler.private_Offer_Status == true) {
                    DataHandler.privateofferID = this.privateoffer.privateOffers.programNumber;
                    DataHandler.privateofferamount = this.privateoffer.privateOffers?.amount;
                    DataHandler.certificatecode = this.privateoffer.privateOffers.certificateCode;
                    DataHandler.offerexpire = this.privateoffer.privateOffers.expiryDate;
                    this.initialSuccess = true;
                    this.showthankyou = true;

                    if (DataHandler.open_private_offer_pop == 0 && DataHandler.private_Offer_Status == true) {
                        setTimeout(() => {
                            const couponCodeDialogRef = this.dialog.open(PrivateOfferMessageDialog, {
                                panelClass: ['inWidget', 'incentiveAddedDialog-container'],
                                maxWidth: 100,
                                disableClose: true,
                                hasBackdrop: true,
                                scrollStrategy: this.overlay.scrollStrategies.block()
                            });
                        }, 1000);
                    }
                    DataHandler.open_private_offer_pop = 1;
                    DataHandler.private_offer_email = this.registerForm.controls["email"].value;
                    this.eventEmitterService.paymentleaserefresh([]);
                    this.eventEmitterService.paymentfinancerefresh([]);
                    this.eventEmitterService.paymentcashrefresh([]);
                    //this.eventEmitterService.fnOpenPrivateOffer();
                    //DataHandler.open_private_offer_pop = 1;
                    //this.initialdialogRef.close();

                } else {
                    this.initialSuccess = true;
                    this.showthankyou = true;
                    // var dealerForm = document.getElementById('initialDialog_wrapper') as HTMLElement;
                    // var initialSuccess = document.getElementById('initialSuccess') as HTMLElement;
                    // dealerForm.style.display = 'none';
                    // initialSuccess.classList.add('showThis');
                    //this.eventEmitterService.paymentleaserefresh([]);
                    //this.eventEmitterService.paymentfinancerefresh([]);
                }
            } else {
                this.initialSuccess = true;
                this.showthankyou = true;
                // var dealerForm = document.getElementById('initialDialog_wrapper') as HTMLElement;
                // var initialSuccess = document.getElementById('initialSuccess') as HTMLElement;
                // dealerForm.style.display = 'none';
                // initialSuccess.classList.add('showThis');
                //this.eventEmitterService.paymentleaserefresh([]);
                //this.eventEmitterService.paymentfinancerefresh([]);
            }

        });
        DataHandler.dialogClose = true
         setTimeout(()=>{
            this.observableService.setWidgetCloseBtn(true)
         },500)
    }

    closepop(type: any = '') {//type refers to close type whether close button or no button clicked
        this.initialdialogRef.close();
        this.observableService.setWidgetCloseBtn(true)
        if (type == 'no') {
            this.adobe_sdg_event('prequal-form-prompt-no');
        } else if (type == 'continue') {
            this.adobe_sdg_event('continue-inital-lead-dialog');
        } else if (type == 'close') {
            this.adobe_sdg_event('close-inital-lead-dialog');
        }

        GoogleAnalyticsHandler.googleAnalyticsExecutor('PhotoGallery-GaGoal');
        this.ga4Service.submit_to_api('PhotoGallery', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('PhotoGallery').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('PhotoGallery').subscribe((response: any) => { });
        setTimeout(() => {
            if (DataHandler.inwidget_initial_popup != 'M') {
                if (type == 'continue' || type == 'no' || type == 'close')
                    this.adobe_sdg_event('page-load', 'vehicle-details');
            } else if ((DataHandler.inwidget_initial_popup == 'M' && this.initialSuccess && this.showthankyou)) {
                if (type == 'continue' || type == 'close') this.adobe_sdg_event('page-load', 'vehicle-details');
            }
        }, 1000)

    }

    fntermsandcondition() {
        this.observableService.setWidgetCloseBtn(true);
        this.adobe_sdg_event('view-terms-and-conditions');
        this.termsandcondition = 1;
        this.adobe_sdg_event('page-load', 'terms-and-conditions');
        // if(!this.isDevice) {
            setTimeout(() => {
                const element = document.getElementById('terms_close_btn');
                window.scrollTo(0, 0);
                if (element) {
                    element.scrollIntoView(true);
                }
            }, 1000);
        // }
    }

    closetermsandcondition(source?: any) {
        if(this.inwidget_initial_popup == 'M')
        this.observableService.setWidgetCloseBtn(false);
        if (!source && this.termsandcondition == 1 && source !== 'back') {
            this.adobe_sdg_event('terms-and-conditions-overlay-close');
        } else if (this.termsandcondition == 1 && source === 'back') {
            this.adobe_sdg_event('terms-and-conditions-overlay-back');
        }
        this.termsandcondition = 0;
    }

    openWarningMessage() {
        if(DataHandler.inwidget_initial_popup =='M')
            this.observableService.setWidgetCloseBtn(false)
        if (DataHandler.isMobileScreen) {
            var width = '90%'
        }
        else {
            width = '42%'
        }

        let cssClass: any = ''

        cssClass = ['widget_init_pop','warningPop']

        const warningdialogRef = this.dialog.open(WarningMessage, {
            panelClass: cssClass,
            width: width,
            height: 'auto',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            disableClose: true,
        });
    }

    openbetterEstimateDialog() {
        this.observableService.setWidgetCloseBtn(true)
        if (DataHandler.dialogClose == false) {
            this.adobe_sdg_event('mandatory-close');
            this.adobe_sdg_event('exit-options');
            this.openWarningMessage()
            // return
        } else {
            if (this.initialSuccess && this.showthankyou) {
                this.closepop('close')
            } else if (!this.initialSuccess && !this.showthankyou && !this.creditEstimator && DataHandler.inwidget_initial_popup != 'M') {
                this.adobe_sdg_event('close-inital-lead-dialog');
                this.creditEstimator = true
                this.adobe_sdg_event('open-prequalify-form-prompt');
            } else if (!this.initialSuccess && !this.showthankyou && this.creditEstimator) {
                this.closepop('close')
            } else {
                if (DataHandler.inwidget_initial_popup == 'M') {
                    this.closepop('close')
                    setTimeout(() => {
                        this.eventEmitterService.closeWidgetSDGEvent();
                        this.eventEmitterService.closeMainDialog();
                    }, 100)
                } else {
                    this.closepop()
                }
            }
        }

        // setTimeout(() => {
        //     DataHandler.is_lead_form_open = true;
        //     //document.getElementById("preQualifyBtn")?.click();
        // }, 100);
        // this.ga4dealerService.submit_to_api_ga4dealer('PhotoGallery').subscribe((response: any) => { });
        // setTimeout(() => {
        //     this.adobe_sdg_event('page-load', 'vehicle-details');
        // }, 1000)
    }

    onImageError(event: Event) {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'https://d1jougtdqdwy1v.cloudfront.net/inwidget/images/Noimage.png';
    }

    public adobe_sdg_event(event_type: any, event_name: any = '', param: any = '', param1: any = '') {
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            pageLoad.site = "dealer";
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = this.dealercode;

            if (event_name === 'terms-and-conditions' && event_type == "page-load") {
                pageLoad.pageName = "terms-and-conditions";
            }

            if (event_type === 'page-load' && event_name === 'form-load') {
                pageLoad.page = "first-form";
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "first-form";
            }

            if (event_type === 'page-load' && event_name === 'vehicle-details') {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:vehicle-details";
            }

            if (event_type === 'page-load' && event_name === 'form-submission-confirmation') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "first-form-submission-confirmation";
            }

            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            interactionClick.page = "first-form";
            formStart.formType = "eshop:first-form";
            formStart.formDescription = "lead";
            formStart.displayType = "modal";
            formStart.displayFormat = "modal";

            formSubmit.formType = "eshop:first-form";
            formSubmit.formDescription = "lead";
            formSubmit.displayType = "modal";
            formSubmit.displayFormat = "modal";

            if (event_type == "page-load") {
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }
            if (event_type == 'initial-form-start') {
                // if (DataHandler.firstname != "" && DataHandler.firstname != null) return;
                AdobeSDGHandler.eventLogger("form-start", formStart);
                return;
            }
            if (event_type == 'initial-form-submit') {
                AdobeSDGHandler.eventLogger("form-submit", formSubmit);
                return;
            }

            if (event_type == 'error-display') {
                errorDisplay.message = param;
                errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }
            if (event_type === 'open-prequalify-form-prompt') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "prequalify-form-prompt";
                pageLoad.site = "dealer";
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
                return;
            }
            if (event_type === 'mandatory-close') {  
              //  interactionClick.page = "first-form";
                interactionClick.location = "first-form-overlay";
                interactionClick.description = "exit";
            }
            if (event_type === 'exit-options') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "exit-options";
                pageLoad.site = "dealer";
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
                return;
            }
            if (event_type === 'close-inital-lead-dialog') {
                    interactionClick.location = "first-form-overlay";
                    interactionClick.description = "close"          
                
            }
           

            if (event_type === 'terms-and-conditions-overlay-back') {
                interactionClick.page = "terms-and-conditions";
                interactionClick.location = "terms-and-conditions";
                interactionClick.description = "back-to-form";
            }

            if (event_type === 'terms-and-conditions-overlay-close') {
                interactionClick.page = "terms-and-conditions";
                interactionClick.location = "terms-and-conditions-overlay";
                interactionClick.description = "close";
            }

            if (event_type === 'view-terms-and-conditions') {
                interactionClick.location = "terms-and-conditions";
                interactionClick.description = "view";
            }
            if (event_type === 'continue-inital-lead-dialog') {
                interactionClick.page = 'first-form-submission-confirmation';
                interactionClick.location = "first-form-submission-confirmation-overlay";
                interactionClick.description = "continue-shopping";
            }
            if (event_type === 'prequal-form-prompt-no') {
                interactionClick.page = 'prequalify-form-prompt-overlay';
                interactionClick.location = "prequalify-form-prompt";
                interactionClick.description = "prequalify-form-prompt-no";
            }

            AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
        } catch (e) {
            console.log('InitialDialog-adobe_sdg_event issue', e);
        }
    }
}

@Component({
    selector: 'app-prequal-form',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './prequal-form.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class PrequalDialog implements OnInit {
    iFrameUrl: SafeResourceUrl | null = null;
    loaded = 0;
    counter = 0;
    prequalurl: any

    constructor(public prequalFormDialogRef: MatDialogRef<PrequalDialog>,private ga4dealerService: GA4DealerService, private restService: RestService, private sanitizer: DomSanitizer,private eventEmitterService: EventEmitterService) {


    }

    ngOnInit() {
        if (environment.production) {
            this.prequalurl = 'https://dms.apicarzato.com/prequal?';
        } else {
            this.prequalurl = 'https://uat-dms.apicarzato.com/prequal?';
        }

        this.openbetterpopup()

        let intervel = setInterval(() => {
            if (DataHandler.prequalIframeurl != undefined || this.counter == 10) {

                this.loaded = 1;
                clearInterval(intervel)
                this.iFrameUrl = DataHandler.prequalIframeurl

            }

            this.counter += 1

        }, 3000);

    }

    handlePREQUALIframeMessage = (event: MessageEvent): void => {
        const iframe = document.getElementById('prequalifyIframe') as HTMLIFrameElement;

        if (event.source !== iframe.contentWindow) {
            console.warn('Event source does not match the iframe.');
            return;
        }

        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            console.warn('Invalid JSON format in event data:', event.data);
            return;
        }

        // Process DMS events
        if (data.event && data.event.startsWith('prequal')) {
            switch (data.event) {

                case 'prequal_page_load':
                    DataHandler.iframeAnalyticsData = data.analytics_payload;
                    if (data.page_name == 'prequal_form') {
                        MerkleHandler.merkleexecutor('prequal_iframe_pageload');
                    } else if (data.page_name == 'score_page_manual') {
                        MerkleHandler.merkleexecutor('prequal_score_pageload');
                        this.adobe_sdg_event("open-estimated-credit-score");
                    }
                    if (data.page_name == 'prequal_form' && data.cta_name == "form_start") {
                        this.adobe_sdg_event("prequal-form-start");
                    } else if (data.page_name == 'prequal_form' && data.event_name == "prequal_page_load") {
                        this.adobe_sdg_event("open-prequal-form");
                    }
                    break;

                case 'prequal_formError':
                    DataHandler.iframeAnalyticsData = data.analytics_payload;
                    if (data.page_name == 'prequal_form' && data.cta_name == 'estimate') {
                        MerkleHandler.merkleexecutor('prequal_form_error');
                    }
                    this.adobe_sdg_event('error-display', 'Invalid form fields', 'form-validation')
                    break;

                case 'prequal_formStart':
                    DataHandler.iframeAnalyticsData = data.analytics_payload;
                    if (data.page_name == 'prequal_form' && data.cta_name == 'form_start') {
                        MerkleHandler.merkleexecutor('prequal_firstaname');
                    }

                    break;

                case 'prequal_form_action':
                    DataHandler.iframeAnalyticsData = data.analytics_payload;
                    if (data.page_name == 'prequal_form' && data.action_type == 'Checkbox') {
                        MerkleHandler.merkleexecutor('prequal_checkbox');
                    }
                    break;

                case 'prequal_ctaClick':

                    DataHandler.iframeAnalyticsData = data.analytics_payload;
                    if (data.page_name == 'prequal_form' && data.cta_name == 'estimate') {
                        MerkleHandler.merkleexecutor('prequal_estimate_btn');
                        DataHandler.firstname = data.form_data.first_name;
                        DataHandler.lastname = data.form_data.last_name;
                        DataHandler.email = data.form_data.email;
                        DataHandler.phone = data.form_data.phone;
                        DataHandler.zipcode = data.form_data.zipcode;
                        DataHandler.prequalComment = 'Prequal Checked';
                        this.ga4dealerService.fire_asc_events('CreditEstimatorEnd').subscribe((response: any) => {});
                        this.restService.set_redis_cache_initial_form().subscribe((response) => { });
                        this.adobe_sdg_event('estimate')
                    }
                    else if (data.page_name == 'score_page_manual') {
                        if (data.cta_name == 'Proceed') {
                            MerkleHandler.merkleexecutor('prequal_submit_btn');
                            this.closePrequal();
                            this.adobe_sdg_event("prequal-form-submit");
                              this.eventEmitterService.loadSDGVehicleDetailsEvent()
                        } else if (data.cta_name == 'Back') {
                            this.adobe_sdg_event("back")
                            this.adobe_sdg_event("open-prequal");
                            MerkleHandler.merkleexecutor('prequal_back_btn');
                        }
                    } else if (data.page_name == 'score_page_actual') {
                        if (data.cta_name == 'Proceed') {
                            MerkleHandler.merkleexecutor('prequal_actual_submit_btn');
                            this.adobe_sdg_event("prequal-form-submit");
                              this.eventEmitterService.loadSDGVehicleDetailsEvent()
                            this.closePrequal();
                        }
                        else if (data.cta_name == 'Back') {
                            MerkleHandler.merkleexecutor('prequal_actual_back_btn');
                            this.adobe_sdg_event("back")
                            this.adobe_sdg_event("open-prequal");
                        }
                    } else if (data.page_name == 'error_page' && data.cta_name == 'Return') {
                        this.closePrequal();
                        MerkleHandler.merkleexecutor('error_page_continue');
                    } else if (data.page_name == 'prequal_form' && data.cta_name == "credit-slider") {
                        // call slider sdg
                        this.adobe_sdg_event("credit-slider", data.action, data.score)
                    }
                    break;
                default:
                    console.warn("Unhandled event:", data.event);
            }
        } else {
            console.warn('Unrecognized event format:', data);
        }
    };

    openbetterpopup(): void {
        var merkleTire;
        if (DataHandler.merkleTire == 'ORE') {
            merkleTire = 'standalone';
        } else {
            merkleTire = DataHandler.merkleTire;
        }

        let urlObject = {
            'userEmail': (DataHandler.email != null) ? DataHandler.email : '',
            'firstName': (DataHandler.firstname != null) ? DataHandler.firstname : '',
            'lastName': (DataHandler.lastname != null) ? DataHandler.lastname : '',
            'make': (DataHandler.make != null) ? DataHandler.make : '',
            'tier': (merkleTire != null) ? merkleTire : '',
            'siteprefix': "DriveFCA:inwidget_redesign",
            'zipCode': (DataHandler.zipcode != null) ? DataHandler.zipcode : '',
            'source': (merkleTire != null) ? merkleTire : '',
            'phone': (DataHandler.phone != null) ? DataHandler.phone : '',
            'vin': (DataHandler.vin != null) ? DataHandler.vin : '',
            'dealer_code': (DataHandler.dealer != null) ? DataHandler.dealer : '',
            'model': (DataHandler.model != null) ? DataHandler.model : '',
            'year': (DataHandler.year != null) ? DataHandler.year : '',
            'vehicle_type': (DataHandler.vehicle_type != null) ? DataHandler.vehicle_type : '',
            'ftid':(DataHandler.ft_id != null && DataHandler.ft_id != '') ? DataHandler.ft_id : DataHandler.adobeSDGgetGlobalVisitorsIds

        }

        var prequalify_Data = { 'url': JSON.stringify(urlObject) };
        this.restService.get_dms_encryptedData('url_encryption', JSON.stringify(prequalify_Data)).subscribe(
            (response) => {
                const encryptData = `journey_id=${response.url}`;
                DataHandler.prequalIframeurl = this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.prequalurl + encryptData);
                window.addEventListener('message', this.handlePREQUALIframeMessage);
            },
            (error) => {
                console.warn('Error:', error);
            }
        );
    }

    ngOnDestroy(): void {
        window.removeEventListener('message', this.handlePREQUALIframeMessage);
    }

    closePrequal() {
        this.prequalFormDialogRef.close();
    }

    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '', p0: string = '') {
        console.log("event_type", event_type + "---" + param)
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            formStart.formType = "eshop:prequalify-form";
            formStart.formDescription = "lead";
            formStart.displayType = "modal";
            formStart.displayFormat = "modal";

            formSubmit.formType = "eshop:prequalify-form";
            formSubmit.formDescription = "lead";
            formSubmit.displayType = "modal";
            formSubmit.displayFormat = "modal";

            let pageNameChange = false;
            if (event_type == 'page-load') {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:vehicle-details";
                pageLoad.site = "dealer";
                //  DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }
            if (event_type == 'prequal-form-start') {
                AdobeSDGHandler.eventLogger("form-start", formStart);
                return;
            }
            if (event_type == 'prequal-form-submit') {
                AdobeSDGHandler.eventLogger("form-submit", formSubmit);
                return;
            }

            if (event_type == 'error-display') {
                errorDisplay.message = param?.toLowerCase();
                errorDisplay.type = param1?.toLowerCase();
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }

            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            if (event_type == "close") {
                interactionClick.location = "prequalify-form-overlay";
                interactionClick.description = "close";
            }


            if (event_type == "estimate") {
                interactionClick.location = "prequalify-form-overlay";
                interactionClick.description = "estimate";
            }
            if (event_type == "back") {
                interactionClick.location = "credit-slider";
                interactionClick.description = "back";
                interactionClick.type = "func";
            }
            if (event_type == "credit-slider") {
                interactionClick.location = "credit-slider";
                interactionClick.type = "func";
                interactionClick.description = param + "-score";//+param1;
            }

            if (event_type == 'open-prequal') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "prequalify-form";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
                return;
            }
            if (event_type == 'open-estimated-credit-score') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "estimated-credit-score";
                pageLoad.site = "dealer";
                pageNameChange = true;
                try {
                    setTimeout(() => {
                        AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    });
                } catch (e) {
                    console.error("Error while calling AdobeSDGHandler.eventLogger:", e);
                }
                return;
            }

            if (pageNameChange) {
                DataHandler.SDGEvents.pageLoad = { ...pageLoad };
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
            }
            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);

        } catch (e) {
            console.log('MainPageComponent-adobe_sdg_event issue', e);
        }
    }

    close() {
        this.adobe_sdg_event("close")
        // Call page load event of MainPageComponent for vehicle-details 
        this.eventEmitterService.loadSDGVehicleDetailsEvent()
    }
}

@Component({
    selector: 'app-warning-message',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './warning-message.html',
    styleUrl: './app.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class WarningMessage implements OnInit {


    constructor(private observableService: ObservableLiveData) {

    }


    ngOnInit() {


    }

    closeWidget() {
        this.adobe_sdg_event('yes')
        this.observableService.closePaymentCalculator();
    //    this.adobe_sdg_event("close-main-dialog")
        DataHandler.initialClose?.close()
        this.observableService.closeWidget();
    }
    noClick() {
        this.adobe_sdg_event('no')
    }

     public adobe_sdg_event(event_type: any, param: any = '', param1: any = '', p0: string = '') {
        console.log("event_type", event_type + "---" + param)
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            
            let pageNameChange = false;
            
            interactionClick.page ='exit-options'
            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            if (event_type == "close") {
                interactionClick.location = "exit-options-overlay";
                interactionClick.description = "close";               
            }


            if (event_type == "no") {
                interactionClick.location  = "exit-options-overlay";
                interactionClick.description = "close-no";
            }
            if (event_type == "yes") {
                interactionClick.location =  "exit-options-overlay";
                interactionClick.description = "close-yes";                
            } 
              if (event_type == "close-main-dialog") {
                interactionClick.location = "exit-options-overlay";
                interactionClick.description = "close-eshop-modal";                
            }

            if (pageNameChange) {
                DataHandler.SDGEvents.pageLoad = { ...pageLoad };
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
            }
            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);

        } catch (e) {
            console.log('MainPageComponent-adobe_sdg_event issue', e);
        }
    }
}




@Component({
    selector: 'reserve-now-error',
     standalone: true,
    templateUrl: './cta-error.html',
    imports: [MaterialModule]
})
export class CTAErrorComponent implements OnInit{
    page :any =''
    constructor(){

    }

    ngOnInit(): void {
        this.page = DataHandler.page.toLowerCase();
    }
}


