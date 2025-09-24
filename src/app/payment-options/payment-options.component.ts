import { Component, Inject, Input, RendererFactory2, ViewChild, ElementRef, Injectable, Output, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { RestService } from '../services/rest.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { IdleService } from '../ideal.service';
import { DataHandler } from '../common/data-handler';
import { CommonModule } from '@angular/common';
import { leaseDetailAction } from '../common/store/lease-details/lease-details-action';
import { Store, select } from '@ngrx/store';
import { leaseDatails } from '../common/data-models';
//import { PrequalifyComponent } from '../prequalify/prequalify.component';
import { getLeaseDetailsState } from '../common/store/lease-details/lease-details-selector';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PaymentCalculatorComponent } from '../payment-calculator/payment-calculator.component';
import { getFinanceDetailsState } from '../common/store/finance-details/finance-details-selector';
import { getCashDetailsState } from '../common/store/cash-details/cash-details-selector';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EventEmitterService } from '../event-emitter.service';
import { ReserveNowComponent } from '../reserve-now/reserve-now.component';
import { getPhotoGalleryAPIResp, getVehicleDetailsSpec } from '../app-store/app-component-selector';
import { vehicleDetailsSpec } from '../app-store/app-component-action';
import { ObservableLiveData } from '../common/observable-live-data';
import { ApplyCreditDialog } from '../apply-credit/apply-credit-dialog';
import { SubmitToDealerDialogComponent } from '../submit-to-dealer-dialog/submit-to-dealer-dialog.component';
import { PhotoGalleryComponent } from '../photo-gallery/photo-gallery.component';
import { GA4DealerService } from '../services/ga4dealer.service';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { SharedService } from '../shared.service';
import { Overlay } from '@angular/cdk/overlay';
import { GA4Service } from '../services/ga4.service';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';


@Component({
    selector: 'app-payment-options',
    standalone: true,
    imports: [MaterialModule, CommonModule, MatProgressBarModule, PaymentCalculatorComponent, ReserveNowComponent, ApplyCreditDialog],
    templateUrl: './payment-options.component.html',
    styleUrl: './payment-options.component.scss'
})
@Injectable({ providedIn: 'root' })

export class PaymentOptionsComponent implements OnInit, OnDestroy {

    vehicleInfo: any;
    dealerInfo: any;
    display_vehicle_name: string | undefined;
    msrp: any;
    isMobileScreen: boolean | undefined;
    vin: any;
    dealer: any;
    leasetier: any;
    customerstate: any;
    countycity: any;
    currentSession: any;
    //prequalifyBtn: boolean = false;
    dialogRef: any;
    activeTab: string | undefined;
    public unsubscribe$: Subject<void> = new Subject<void>();
    vehicle_type: string | undefined;
    leasedetails: any; financedetails: any; autofiEnable: any;
    creditAppState: string = 'not-open';
    enblecredit = 0;
    url: any;
    @Output() showApplyCredit: EventEmitter<void> = new EventEmitter<void>();
    @Output() showReserveNow: EventEmitter<void> = new EventEmitter<void>()
    @Output() showTestDrive: EventEmitter<void> = new EventEmitter<void>();
    cashdetails: any;
    leasedueatsigningval: any;
    leaseserviceprotection: any;
    financedueatsigningval: any;
    monthlyPayment: any;
    financemonthlyPayment: any;
    paymentValue: boolean = false;
    dueAtSigningTooltip: any = '';
    cashDownTooltip: string = '';
    leasedownpayment: any;
    leaseTotalTaxesFees: any;
    leasemonthlycost: any;
    leaseServiceValue: any;
    financedownpayment: any;
    financeTotalTaxesFees: any;
    cashdown: any
    cashPayment: any
    finaceResponseAvailable: boolean = false;
    leaseResponseAvailable: boolean = false
    heroImage: string = ''
    formSubmitted: boolean = false;
    reserveNowButtonText: string = 'Reserve';
    reserveNowButtonStatus: string = 'disable';
    customize_reservation: any;
    selectedLocation: string | null = null;
    initialFormFilled: boolean = false;

    @Input() deliveryChanges: number = 1;
    @Input() isSubmitMatTabActive: boolean = false;
    @Output() formStatus = new EventEmitter<{ date: any, time: any }>();
    showTestDriveBtn: any;
    redirectionURL: any;
    cashResponseAvailable = false;
    paypal_onboarding_status: any;
    is_reserve_button_enable: any;
    seating: any ='';
    horsepower: any='';
    drive: any='';
    submitDialogOpened: boolean = false;

    constructor(private store: Store<any>, public dialog: MatDialog,public overlay:Overlay, private renderer1: Renderer2,
        private restService: RestService, private ga4dealerService: GA4DealerService, private eventEmitterService: EventEmitterService, private observableService: ObservableLiveData, private sharedService: SharedService,
        private ga4Service: GA4Service) {
        this.observableService.selectedPaymentType$.subscribe((value: any) => {
            this.activeTab = value
            DataHandler.objActivePaymentData.activeTab = value
        });
        this.vin = DataHandler.vin;
        this.redirectionURL = 'https://www.jeep.com/hostd/windowsticker/getWindowStickerPdf.do?vin='+this.vin
        this.heroImage = DataHandler.heroImage;
        this.observableService.setFormSubmitted$.subscribe((value) => {
            this.formSubmitted = value;
        })
        this.restService.initialFormFilled$.subscribe(
            (value) => (this.initialFormFilled = value)
        );
    }

    isFormPristine: boolean = true;
    dateValue: any = null;
    timeValue: any = null;
    hidePaymentCalculator = false;

    onFormStatusChange(event: { date: any, time: any, pristine: boolean }) {
        this.dateValue = event.date;
        this.timeValue = event.time;
        this.isFormPristine = event.pristine;
    }

    @Output() navigateToSubmitTab = new EventEmitter<void>();

    homeFieldsValid: boolean = true;
    otherFieldsValid: boolean = true;

    openPrequalDialog(){
        this.observableService.openPrequalDialog('payment-options-prequal');
    }  
    
    openSubmitToDealerDialog() {
        DataHandler.userInteraction = true;
        this.adobe_sdg_event('submit-to-dealer');
        this.ga4Service.submit_to_api('ScheduleDelivery','','','','','','').subscribe((response) => {});
        //this.ga4dealerService.submit_to_api_ga4dealer('ScheduleDelivery').subscribe((response: any) => { });
        //this.ga4dealerService.fire_asc_events('ScheduleDelivery').subscribe((response: any) => {});
        if (this.isSubmitMatTabActive && DataHandler.deliverychanges == 1) {
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
                    // this.eventEmitterService.clickTabEvent(4)
                    setTimeout(() => {
                        document.getElementById('date')?.focus();
                        document.getElementById('date')?.scrollIntoView(true);
                    }, 500)
                    return;
                }
            }

            if (!this.isSubmitMatTabActive && !this.isFormPristine && !this.isFormFilled) {
                this.navigateToSubmitTab.emit();
                return;
            }
            
            if (!this.isFormPristine && DataHandler.deliverychanges === 1) {
                return;
            }

            if (!this.isFormFilled && !this.isFormPristine) {
                this.eventEmitterService.validateSubmitForm();
                return;
            }

            if (!this.submitDialogOpened) {
                this.submitDialogOpened = true;
                this.dialog.open(SubmitToDealerDialogComponent, {
                    panelClass: [],
                    height: 'auto',
                    width: '70%',
                    disableClose: true,
                    scrollStrategy: this.overlay.scrollStrategies.noop()
                }).afterClosed().subscribe(() => {
                    this.submitDialogOpened = false;
                });
            }
        }, 500);

        this.adobe_sdg_event('submit-to-dealer', 'page-load');

        if (this.initialFormFilled === true && this.vehicle_type != 'new') {
            this.adobe_sdg_event('form-start');
        }
    }

    updateDeliveryStatus(status: number) {
        DataHandler.deliverychanges = status;
        console.log("Updated DataHandler.deliverychanges in payment-options:", DataHandler.deliverychanges);
    }

    onApplyCreditClick() {
        this.adobe_sdg_event('apply-credit');
        this.creditAppState = 'open';
        this.showApplyCredit.emit();
        this.eventEmitterService.updateData(true);
    }

    disableSubmit!: any;

    private subscription!: Subscription;

    isFormFilled: boolean = false;

    ngOnInit() {
        this.observableService.hideCalcSubject$.subscribe(value => {
            if (value !== null && value !== undefined) {
                this.hidePaymentCalculator = value;
            }
        });

        // this.observableService.cashResponseAvailable$.subscribe((value) => {
        //     this.cashResponseAvailable = value;
        // });
        this.subscription = this.observableService.formSubmitted$.subscribe(
            (status: any) => {
              this.disableSubmit = status;
            }
          );
        
        this.customize_reservation = DataHandler.customize_reservation;
        this.creditAppState = DataHandler.creditAppState;
        this.paypal_onboarding_status = DataHandler.paypal_onboarding_status;
        this.is_reserve_button_enable = DataHandler.is_reserve_button_enable;

        this.observableService.openPaymentCalculator$.subscribe(() => {
            this.openPaymentCalculator()
        })
        this.formSubmitted = DataHandler.formSubmitted;
        this.observableService.leaseResponseAvailable$.subscribe((value) => {
            this.leaseResponseAvailable = value
        })
        this.observableService.financeResponseAvailable$.subscribe((value) => {
            this.finaceResponseAvailable = value
            //console.log("value:", value)
        })


        this.observableService.showleaseMonthlyPayment$.subscribe(value => {
            this.monthlyPayment = value
            this.leasedownpayment = DataHandler.leasedownpay?.toString().replaceAll(",", '');
             //console.log("lease down payment", DataHandler.leasedownpay);
        })

        this.observableService.leasedueatsigning$.subscribe(value => {
            this.leasedueatsigningval = value
        })
        this.observableService.showfinanceMonthlyPayment$.subscribe(value => {
            this.financemonthlyPayment = value
            this.financedownpayment = DataHandler.financedownpay?.toString().replaceAll(",", '');

        })

        this.observableService.financedueatsigning$.subscribe(value => {
            this.cashdown = value
            //console.log("cash1 down",this.financedueatsigningval)
        })

        this.observableService.showcashPayment$.subscribe(value => {
            this.cashPayment = value
        })

        this.observableService.showleasetaxandfees$.subscribe(value => {
            this.leaseTotalTaxesFees = value.toString().replaceAll(",", '')
            //console.log("leaseTotalTaxesFees",this.leaseTotalTaxesFees)

        })

        this.observableService.leasefirstmonth$.subscribe(value => {
            this.leasemonthlycost = value.toString().replaceAll(",", '')
            // console.log("fees", value)
        })

        this.observableService.showfinancetaxandfees$.subscribe(value => {
            this.financeTotalTaxesFees = Math.round(Number(value))
        })

        this.observableService.closePaymentCalculator$.subscribe(() => {
            this.closePaymentCalculator();
        });

        this.observableService.formStatus$.subscribe(status => {
            this.dateValue = status.date;
            this.timeValue = status.time;
            this.selectedLocation = status.location;
            this.homeFieldsValid = status.homeFieldsValid;
            this.otherFieldsValid = status.otherFieldsValid;
            this.isFormPristine = status.pristine;
        });

        this.observableService.formFilled$.subscribe(isFilled => {
            this.isFormFilled = isFilled;
        });

        setTimeout(() => {
            this.isMobileScreen = DataHandler.isMobileScreen;
            this.vehicleInfo = DataHandler.vehicle_info;
             if(this.vehicleInfo?.length>0){
                this.seating = this.vehicleInfo[1]?.value;
                this.horsepower = this.vehicleInfo[2]?.value;
                this.drive = this.vehicleInfo[4]?.value;
             }
            this.vehicle_type = DataHandler.vehicle_type.toLowerCase();
            if (this.vehicle_type.toLowerCase() == 'used') {
                this.activeTab = 'finance';
            }
        }, 200);
        this.display_vehicle_name = DataHandler.display_vehicle_name;
        this.msrp = DataHandler.msrp;
        this.activeTab = DataHandler.activeTab;
        this.autofiEnable = DataHandler.enableautofi;
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

        this.eventEmitterService.selectedLocation$.subscribe(location => {
            this.selectedLocation = location;
        });
        this.showTestDriveBtn = DataHandler.customize_testdrive;
        // this.eventEmitterService.deliveryChanges$.subscribe((value) => {
        //     this.deliveryChanges = value;
        //   });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    convertToNumber(prData: any) {
        return parseInt(prData);
    }

    applyCreditDialog() {
        DataHandler.userInteraction = true;
        DataHandler.autofiStatus = 'Initiated';
        DataHandler.is_lead_form_open = true;
        const creditdialogRef = this.dialog.open(ApplyCreditDialog, {
            panelClass: [],
            maxWidth: 600,
            maxHeight: '100vh',
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
    ngAfterViewInit() {
        //this.eventEmitterService.resetpayment( );
        let closeInterval = setInterval(() => {
            this.vehicleInfo = DataHandler.vehicle_info;
            this.leasedueatsigningval = DataHandler.leasedueatsigning;
            this.financedueatsigningval = DataHandler.financedueatsigning;
            //this.monthlyPayment           = DataHandler.monthlyLeaseValue;
           // this.leasedownpayment = DataHandler.leasedownpayment?.toString().replaceAll(",", '');
            //this.leaseTotalTaxesFees = (DataHandler.leaseTotalTaxesFees! = 0) ? DataHandler.leaseTotalTaxesFees.toString().replaceAll(",", '') : 0;
            //this.leasemonthlycost = (DataHandler.leasemonthlycost! = 0) ? DataHandler.leasemonthlycost.toString().replaceAll(",", '') : 0;
            this.leaseServiceValue = (DataHandler.leaseServiceValue! = 0) ? DataHandler.leaseServiceValue.toString().replaceAll(",", '') : 0;

            //this.financedownpayment = DataHandler.financedownpayment?.toString().replaceAll(",", '');
            if (this.leasedueatsigningval != null || this.monthlyPayment != null || this.financedueatsigningval != null) {
                clearInterval(closeInterval)
                this.paymentValue = true;
            }   
        }, 3000);
    }
    paymentSelectionClicked(){ 
        //DataHandler.userInteraction = true; 
    }

    paymentSelctionChange(event: any) {      
        this.observableService.setSelectedPaymentType(event)
    }

    private paymentdialogRef: MatDialogRef<PaymentCalculatorComponent> | null = null;

    openPaymentCalculator() {
         //DataHandler.userInteraction = true; 
        let cssClass = (this.isMobileScreen) ? "widgetMobile" : "paymentCalculatorPopup";
        this.paymentdialogRef = this.dialog.open(PaymentCalculatorComponent, {
            panelClass: [cssClass],
            data: {
            },
            width: '70%',
            height: '',
            position: {
                top: '2%',
                left: ''
            },
            disableClose: true,
            scrollStrategy: this.overlay.scrollStrategies.noop()
        });
        this.adobe_sdg_event('open-payment-estimator');
        this.sharedService.setPaymentCalculatorState(true);
    }

    closePaymentCalculator() {
        if (this.paymentdialogRef) {
            this.paymentdialogRef.close();
            this.paymentdialogRef = null
            this.adobe_sdg_event('close-payment-estimator');
            this.eventEmitterService.loadSDGVehicleDetailsEvent()
        }
    }

    openTestDrive() {
        let testDrive = document.getElementById('testDriveButton');
        testDrive?.click();
    }        

    openReserveNow() {
       if(!DataHandler.isMobileScreen)
         this.adobe_sdg_event('reserve-vehicle');
        this.showReserveNow.emit();
        //this.ga4dealerService.submit_to_api_ga4dealer('ReserveNow').subscribe((response: any) => {});
    }

    // openQualifyDialog() {
    //   const preQualDialog = this.dialog.open(PrequalifyComponent, {
    //     panelClass: [],
    //     maxWidth: 600,
    //     maxHeight: 600,
    //     width: '50%',
    //     height: 'auto',
    //   });
    //   this.observableService.setShowPrequal(true);
    // }

    closeDialog(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '') {
        // console.log("Event Triggered:", event_type, "Param:", param);
        // console.log('PaymentOptionsComponent-', event_type, param);
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;
            DataHandler.SDGEvents.interactionClick.site = "dealer";
            DataHandler.SDGEvents.interactionClick.type = "nav";
            DataHandler.SDGEvents.interactionClick.location = "payment-options-" + AdobeSDGHandler.responsiveState();           
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
            if (event_type === "test-drive") {
                if (param === "page-load") {
                    pageLoad.pageType = "overlay";
                    pageLoad.pageName = "schedule-a-test-drive";
                    DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                    AdobeSDGHandler.eventLogger("page-load", pageLoad);
                    DataHandler.SDGEvents.interactionClick.page = "build-your-deal:vehicle-details";
                }

                if (param === "interaction-click") {
                    DataHandler.SDGEvents.interactionClick.name = 'test-drive';
                    DataHandler.SDGEvents.interactionClick.description ='';
                    AdobeSDGHandler.eventLogger("interaction-click", DataHandler.SDGEvents?.interactionClick);
                    DataHandler.SDGEvents.interactionClick.name='';
                }
                 return;
            }
            if (event_type === 'page-load') {
                DataHandler.SDGEvents.interactionClick.page = DataHandler.SDGEvents.pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", DataHandler.SDGEvents.pageLoad);
                return;
            }
             if (event_type === 'page-load' && param === 'vehicle-details') {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:vehicle-details";
                AdobeSDGHandler.eventLogger("page-load", DataHandler.SDGEvents.pageLoad);
                return;
            }
            if (event_type == 'error-display') {
                DataHandler.SDGEvents.errorDisplay.message = param;
                DataHandler.SDGEvents.errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", DataHandler.SDGEvents.errorDisplay);
                return;
            }
            if (event_type == 'payment-option-click') {
                DataHandler.SDGEvents.interactionClick.description = this.activeTab;
            }
            if (event_type == 'open-payment-estimator') {
                if (DataHandler.SDGEvents.isFloatingCalcClick) {
                    DataHandler.SDGEvents.interactionClick.location = "floating-calculator";
                    DataHandler.SDGEvents.isFloatingCalcClick = false;
                }
                DataHandler.SDGEvents.interactionClick.description = "open-payment-estimator";
            }

            if (event_type == 'close-payment-estimator') {
                DataHandler.SDGEvents.interactionClick.type = "func";
                DataHandler.SDGEvents.interactionClick.page = "payment-estimator";
                DataHandler.SDGEvents.interactionClick.location = "payment-estimator-modal";
                DataHandler.SDGEvents.interactionClick.description = "close";
            }
           
            if (event_type == 'apply-credit') {
                DataHandler.SDGEvents.interactionClick.location = "vehicle-action-buttons";
                DataHandler.SDGEvents.interactionClick.description = 'credit-application';
            }

            if (event_type == 'reserve-vehicle') {
                DataHandler.SDGEvents.interactionClick.location = "vehicle-action-buttons";
                DataHandler.SDGEvents.interactionClick.description = 'reserve-vehicle';
            }

            if (event_type == 'submit-to-dealer') {
                DataHandler.SDGEvents.interactionClick.location = "vehicle-action-buttons";
                DataHandler.SDGEvents.interactionClick.description = 'submit-to-dealer';
            }

            if (event_type == 'view-disclaimer') {
                DataHandler.SDGEvents.interactionClick.description = "view-disclaimer";
            }

            if (event_type === 'form-start') {
                let formStart = {
                    "formDescription": "lead",
                    "formType": "eshop:submit-to-dealer-form",
                    "displayType": "modal",
                    "displayFormat": "modal"
                }
                AdobeSDGHandler.eventLogger('form-start', { ...formStart });
                return;
            }

            AdobeSDGHandler.eventLogger("interaction-click", DataHandler.SDGEvents?.interactionClick);
 
            const rightcontent1 = document.querySelector('.widget_item-for') as HTMLElement;
            const matbody1 = document.querySelector('.mat-mdc-tab-body-wrapper') as HTMLElement;
            setTimeout(() => {
                const setHeight1 = rightcontent1.offsetHeight;
                this.renderer1.setStyle(matbody1, 'height', setHeight1+'px');
                //console.log("test" + '' + setHeight1);
            }, 500);
        } catch (e) {
            console.log('PaymentOptionsComponent-adobe_sdg_event issue', e);
        }
    }
    invokeTestDrive() {
        this.adobe_sdg_event("test-drive", "interaction-click");
        this.showTestDrive.emit();
        this.adobe_sdg_event("test-drive", "page-load");
        this.ga4dealerService.fire_asc_events('TestDriveFormclick').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('TestDriveFormStart').subscribe((response: any) => { });
    }
}

@Component({
    selector: 'payment-section-template',
    standalone: true,
    templateUrl: './payment-section.template.html',
    imports: [MaterialModule, PaymentCalculatorComponent, PhotoGalleryComponent]
})
@Injectable({ providedIn: 'root' })

export class PaymentSectionComponent {
    @Input() vehicle_info!: [];
    //lockDetailsSpecs = true
    vehicleInfo: any;
    dealerInfo: any;
    display_vehicle_name: string | undefined;
    msrp: any;
    specs: any;
    step = 0;
    detailspresent: any = 1;
    phoneNumber: any;
    showVehicleDetails: boolean = false;
    vehicle_specification: any;
    vin: any;
    vehicle_type: any;
    veh_images: any;
    toggleDetailedSpec: boolean = false;
    showTestDriveBtn: any;
    dealerPrice: any
    ListPrice : any
    
  
    popUpVisible: boolean = false;

    hidePaymentCalc: any;
    leaseListPrice : any
    financeListPrice : any
    cashListPrice : any
    seating :any='';
    horsepower:any ='';
    drive :any = '';
    LeaseListPrice : any
    FinanceListPrice : any
    CashListPrice : any
    selectedPaymentType : any

    @ViewChild('expandVehicleDetails') expandVehicleDetails!: ElementRef;
    public unsubscribe$: Subject<void> = new Subject<void>();
    ind: number = 0;
    constructor(public dialog: MatDialog, private ga4dealerService: GA4DealerService, private restService: RestService, private store: Store<any>,public overlay:Overlay,
        private observableLiveData: ObservableLiveData, private ga4Service: GA4Service) {
        this.restService.visiblePopUp$.subscribe(
            (value) => (this.popUpVisible = value)
        );
    }
    ngOnInit() {

       

        this.observableLiveData.selectedPaymentType$.subscribe((value)=>{

            this.selectedPaymentType = value.toLowerCase();

            if(value.toLowerCase() == 'lease'){
              this.observableLiveData.leaseListPrice$.subscribe((value) =>{
              this.LeaseListPrice = value
              console.log("Llistprice",this.LeaseListPrice)
            });
             
            }else if(value.toLowerCase() == 'finance'){
                this.observableLiveData.financeListPrice$.subscribe((value) =>{
                this.FinanceListPrice = value
                console.log("Flistprice",this.FinanceListPrice)
                
            })

            }else if(value.toLowerCase() == 'cash'){
                this.observableLiveData.cashListPrice$.subscribe((value) =>{
                this.CashListPrice = value
                console.log("Clistprice",this.CashListPrice)
            })
            }
        })

        //  this.observableLiveData.financeListPrice$.subscribe((value) =>{
        //         this.ListPrice = value
        //         console.log("1Flistprice",this.ListPrice)
                
        //     })


        this.observableLiveData.hideCalcSubject$.subscribe(value => {
            if (value !== null && value !== undefined) {
                this.hidePaymentCalc = value;
            }
        });
        
        // this.observableLiveData.lockDetailsSpecs$.subscribe(value =>{
        //     this.lockDetailsSpecs = value
        // });
   //     this.veh_images = DataHandler.vehicle_images;
        this.ind = 0;
        this.vin = DataHandler.vin;
        
        this.vehicle_type = DataHandler.vehicle_type;
        if (this.vehicle_type == 'new') {
            this.store.dispatch(vehicleDetailsSpec({ vin: DataHandler.vin }));
        }
        if (this.vehicle_type == 'used') {
            this.veh_images = DataHandler.photoGalleryImages
            this.restService.get_Used_Vehicle_Details_Spec(this.vin).subscribe((response) => {
                this.vehicle_specification = response;
                var obj = JSON.parse(JSON.stringify(this.vehicle_specification));
                //console.log("vehicle spec response:used:", response);
                this.vehicle_specification = obj?.result?.vehicle_spec?.vds_group_data?.length;
                if (obj?.result?.vehicle_spec?.vds_group_data?.length > 0) {
                    this.specs = obj?.result?.vehicle_spec?.vds_group_data;
                    // console.log("used:vehicle spec:", this.specs)
                };
            });
        }
        if (this.vehicle_type == 'new') {
            this.store
                .pipe(select(getPhotoGalleryAPIResp), takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (data) => {
                        let response = data.photoGallery[0];
                        this.display_vehicle_name = response?.display_vehicle_name;
                        DataHandler.base_msrp = this.msrp = response?.msrp;
                        DataHandler.current_session = response?.current_session_pre_qual;
                        DataHandler.GA4_measurement_id = response?.ga4_measurement_id;
                        DataHandler.trim = encodeURIComponent(response?.trim_desc);
                        this.veh_images = response?.photo_images;
                        DataHandler.customize_testdrive = response?.delivery_status_customize_testdrive;
                        this.showTestDriveBtn = DataHandler.customize_testdrive;
                    },
                    error: (e) => console.error(e),
                });
        }
        if (!DataHandler.isMobileScreen) {
            setTimeout(() => {
                if (!this.popUpVisible) {
                    this.adobe_sdg_event("vehicle-details", 'page-load');
                }
            }, 500);
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.vehicleInfo = DataHandler.vehicle_info;
            if(this.vehicleInfo?.length>0){
                this.seating = this.vehicleInfo[1]?.value;      
                this.horsepower = this.vehicleInfo[2]?.value;
                this.drive = this.vehicleInfo[4]?.value;
            }
            

            this.display_vehicle_name = DataHandler.display_vehicle_name;
            // console.log("msrp",DataHandler.msrp)
            this.dealerPrice = DataHandler.msrp;
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
            this.phoneNumber = DataHandler.dealerinfo?.phoneNumber;
        }, 2000)


    }

   

     openVehicleDetails() {
        const dialogRef = this.dialog.open(VehicleDetailsComponent, {
            panelClass: ['paymentCalculatorPopup'],
            data: {
            },
            height: 'auto',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.noop()
        });
    }

    setStep(index: number) {
        this.step = index;
    }

    changeStep(index: number, tab_header: any = '') {
        this.step = index;
      //  this.adobe_sdg_event("expand-vehicle-detail-spec", 'interaction-click', tab_header);
    }

    tabClick(event: any) {
        this.step = event.index;
        this.adobe_sdg_event("expand-vehicle-detail-spec", 'interaction-click', this.specs[event.index]['@attributes'].name);
    }

    displayVehicleDetails() {
        //DataHandler.userInteraction = true; 
        this.showVehicleDetails = !this.showVehicleDetails;
        this.toggleDetailedSpec = !this.toggleDetailedSpec;
        setTimeout(() => {
            if (this.expandVehicleDetails) {
                this.expandVehicleDetails.nativeElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0);
        GoogleAnalyticsHandler.googleAnalyticsExecutor('VehicleInformation-GaGoal');
        this.ga4Service.submit_to_api('VehicleInformation','','','','','','').subscribe((response) => {});
        this.ga4dealerService.submit_to_api_ga4dealer('VehicleInformation').subscribe((response: any) => { });
        this.ga4dealerService.fire_asc_events('VehicleInformation').subscribe((response: any) => {});
        if (this.toggleDetailedSpec) {
            this.adobe_sdg_event("view-detailed-specs");
        } else {
            this.adobe_sdg_event("hide-detailed-specs");
        }
    }

   

    public adobe_sdg_event(event_type: any, event_name: any = 'click', param: any = '') {
        //console.log('PaymentSectionComponent-', event_type, event_name);
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

            if (event_type == 'vehicle-details') {
                pageLoad.pageType = "build-your-deal";
                pageLoad.pageName = "build-your-deal:vehicle-details";
            }

            if (event_type === "test-drive") {
                if (event_name === "page-load") {
                    pageLoad.pageType = "overlay";
                    pageLoad.pageName = "schedule-a-test-drive";
                    DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                    AdobeSDGHandler.eventLogger("page-load", pageLoad);
                }

                if (event_name === "interaction-click") {
                    interactionClick.name = "test-drive";
                    interactionClick.site = "dealer";
                    interactionClick.type = "func";
                    interactionClick.description = null;
                    interactionClick.location = "vehicle-information";
                    interactionClick.page = "build-your-deal:vehicle-details";
                    AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
                }
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
                interactionClick.description = param;
                interactionClick.name = "vehicle-details-specs";
            }

            if (event_name === "page-load") {
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
            }
            if (event_name === "click" || event_name === "interaction-click") {
                AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
            }

        } catch (e) {
            console.log('PaymentSectionComponent-adobe_sdg_event issue', e);
        }
    }
}


@Component({
    selector: 'vehicle-details',
    standalone: true,
    templateUrl: './vehicle-details.template.html',
    styleUrl: './payment-options.component.scss',
    imports: [MaterialModule, CommonModule]
})
export class VehicleDetailsComponent {
    @Input() vin!: any;
    specs: any;

    detailspresent: any = 1;
    phoneNumber: any;
    vehicle_type: any;
    finaceResponseAvailable: boolean = false;
    leaseResponseAvailable: boolean = false

    constructor(private restService: RestService, private observableService: ObservableLiveData) { }

    ngOnInit(): void {
        DataHandler.vehicle_type = this.vehicle_type;
        if (this.vehicle_type == "new") {
            this.restService.get_vehicle_specification(this.vin).subscribe((response) => {

                var obj = JSON.parse(JSON.stringify(response));

                this.detailspresent = obj.result.vehicle_spec.vds_group_data.length;

                this.specs = obj.result.vehicle_spec.vds_group_data;

            });
            this.observableService.leaseResponseAvailable$.subscribe((value) => {
                this.leaseResponseAvailable = value
            })
            this.observableService.financeResponseAvailable$.subscribe((value) => {
                this.finaceResponseAvailable = value
            });
            
            setTimeout(() => {
                this.phoneNumber = DataHandler.dealerinfo?.phoneNumber;
            }, 2000);
        }

        if (this.vehicle_type == "used") {
            //vehicle specification 
            this.restService.get_Used_Vehicle_Details_Spec(this.vin).subscribe((response) => {
                var obj = JSON.parse(JSON.stringify(response));
                //console.log("vehiclespecification_response:", response);
                this.detailspresent = obj.result.vehicle_spec.vds_group_data.length;
            });
        }
    }

    step = 0;

    setStep(index: number) {
        this.step = index;
    }

    changeStep(index: number, tab_header: any = '') {
        this.step = index;
        this.adobe_sdg_event("expand-vehicle-detail-spec", 'interaction-click', tab_header);
    }

    public adobe_sdg_event(event_type: any, event_name: any = 'click', param: any = '') {
        //console.log('VehicleDetailsComponent-', event_type, event_name);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };

            interactionClick.site = "dealer";
            interactionClick.type = "func";
            interactionClick.location = "vehicle-information";
            interactionClick.page = "build-your-deal:vehicle-details";
            if (event_type === 'expand-vehicle-detail-spec') {
                interactionClick.description = param;
                interactionClick.name = "vehicle-details-specs";
            }
            if (event_type === 'call-vehicle-detail-empty') {
                interactionClick.description = "";
                interactionClick.name = "call-for-information";
            }
            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);

        } catch (e) {
            console.log('VehicleDetailsComponent-adobe_sdg_event issue', e);
        }
    }
}



