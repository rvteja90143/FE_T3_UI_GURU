import { Component, EventEmitter, Output } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DataHandler } from "../common/data-handler";
import { ApplyCreditComponent } from "./apply-credit.component";
import { RestService } from "../services/rest.service";
import { DomSanitizer } from "@angular/platform-browser";
import { EventEmitterService } from "../event-emitter.service";
import { GA4Service } from "../services/ga4.service";
import { GA4DealerService } from "../services/ga4dealer.service";
import { MaterialModule } from "../material/material.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { ObservableLiveData } from "../common/observable-live-data";
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { PrivateOfferMessageDialog } from "../test-drive/test-drive.component";
import { Overlay } from "@angular/cdk/overlay";
import { ShiftDigitalHandler } from "../common/shift-digital";

@Component({
    selector: 'apply-credit-dialog',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './apply-credit-dialog.html',
})

export class ApplyCreditDialog {
    registerForm!: FormGroup;
    submitted = false;
    formSubmitted = false;
    firstime = 0;
    url: any;
    showdelivery: any;
    disclaimerAge: any;
    privateoffer: any;

    selectTab = new FormControl(0);
    isValidFlg: boolean = true;
    alstDesc: any = '';
    isBcincentiveAvailable: boolean = false;
    termsandcondition = 0;
    model: any;
    year: any;
    heroImage: any;
    GoalGAFirstTime: any = 0;
    vehicle_model: any;
    make_url: any;
    mandatoryphone: any;
    applyDT: any;
    applyR1: any;
    iframeurl: any;
    dealercode: any;

    constructor(private formBuilder: FormBuilder, public creditdialogRef: MatDialogRef<ApplyCreditComponent>, private restService: RestService, private dom: DomSanitizer, private eventEmitterService: EventEmitterService,
        private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, private observableService: ObservableLiveData,private dialog:MatDialog,public overlay:Overlay) {
        this.eventEmitterService.subsVar = this.eventEmitterService.
            checkBCIncentive.subscribe((name: string) => {
                this.isBcincentiveAvailable = true;
            });
        this.alstDesc = DataHandler.alstDesc;
        //   let bcIncentive = this.restService.checkBCincentiveAvailable();
        //   if (bcIncentive.length > 0) {
        //     this.isBcincentiveAvailable = true;
        //   }
        this.showdelivery = DataHandler.showdelivery;
        this.disclaimerAge = DataHandler.disclaimerAge;
        this.model = DataHandler.display_vehicle_name;
        this.year = DataHandler.year;
        this.heroImage = DataHandler.heroImage;
        this.vehicle_model = DataHandler.vehicle_model;
        this.make_url = DataHandler.make_url;
        this.mandatoryphone = DataHandler.mandatory_phone;

        if (DataHandler.enableautofi == 'dt') {
            this.applyDT = 1;
            if (this.GoalGAFirstTime == 0) {
                //   GoogleAnalyticsHandler.googleAnalyticsExecutor('ApplyForCreditDT-GaGoal');
                this.GoalGAFirstTime = 1;
            }
        }
        if (DataHandler.enableautofi == 'rone') {
            this.applyR1 = 1;
            if (this.GoalGAFirstTime == 0) {
                //   GoogleAnalyticsHandler.googleAnalyticsExecutor('ApplyForCreditRone-GaGoal');
                this.GoalGAFirstTime = 1;
            }
        }

        this.iframeurl = this.transform('');
        if ((this.eventEmitterService.subsVar == undefined) != (this.eventEmitterService.subsVar != undefined)) {

            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeIframeComponentFunction.subscribe((param: string) => {
                    this.iframeurl = this.transform(param);
                });
        }
        this.eventEmitterService.subsVar = this.eventEmitterService.addPiInfo.subscribe(() => {
                    this.loadPIInfo();
                });
        
    }

    transform(url: any) {
        return this.dom.bypassSecurityTrustResourceUrl(url);
    }

    fntermsandcondition() {
        this.adobe_sdg_event('view-terms-and-conditions');
        this.termsandcondition = 1;
        this.adobe_sdg_event('page-load', 'terms-and-conditions');
        setTimeout(() => {
            const element = document.getElementById('terms_condition');
            window.scrollTo(0, 0);
            if (element) {
                element.scrollIntoView(true);
            }
        }, 0);
    }

    closetermsandcondition(source?: any) {
        if (!source && this.termsandcondition == 1 && source !== 'back') {
            this.adobe_sdg_event('terms-and-conditions-overlay-close');
        } else if (this.termsandcondition == 1 && source === 'back') {
            this.adobe_sdg_event('terms-and-conditions-overlay-back');
        }
        this.termsandcondition = 0;
    }

    initialevent() {
        if (this.firstime == 0) {
            ShiftDigitalHandler.shiftdigitalexecutor('apply for credit start');

            // MerkleHandler.merkleexecutor('apply-credit-start');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('apply-credit-start');


            if (DataHandler.enableautofi == 'dt') {
                this.ga4Service.submit_to_api('ApplyForCreditFormStartDT', '', '', '', '', '', '').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('ApplyForCreditFormStartDT').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('ApplyForCreditFormStartDT').subscribe((response: any) => { });
            } else if (DataHandler.enableautofi == 'rone') {
                this.ga4Service.submit_to_api('ApplyForCreditFormStartR1', '', '', '', '', '', '').subscribe((response: any) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('ApplyForCreditFormStartR1').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('ApplyForCreditFormStartR1').subscribe((response: any) => { });
            }
            setTimeout(()=>{
              //if(DataHandler.firstname =="" ||  DataHandler.firstname == null) 
                this.adobe_sdg_event('apply-credit-form-start');
            },1000)
            this.firstime = 1;
        }
    }

    creditForm() {
        this.selectTab.setValue(1);
    }

    keyPress(event: KeyboardEvent): void {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
        const input = event.key;

        // Allow control keys
        if (allowedKeys.includes(event.key)) {
            return;
        }

        // Prevent anything other than digits
        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
            return;
        }

        this.validatePhoneNo(event.target as HTMLInputElement);
        this.initialevent();
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
        const firstDigit = control.value?.toString().charAt(1);
        if (firstDigit === '0' || firstDigit === '1') {
            return { 'invalidFirstDigit': true };
        }
        return null;
    }

    forbiddenFirstDigitValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          if (!value) return null;
      
          const fullMatch = /^\((\d{3})\) \d{3}-\d{4}$/.exec(value);
          if (!fullMatch) return null;
      
          const areaCodeFirstDigit = fullMatch[1].charAt(0);
          if (areaCodeFirstDigit === '0' || areaCodeFirstDigit === '1') {
            return { invalidFirstDigit: true };
          }
      
          return null;
        };
      }  

    validateInput(event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value;
        const pattern = /^[a-zA-Z]*$/; // Only alphanumeric characters allowed

        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
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

    ngOnInit() {
        if (DataHandler.mandatory_phone == 'Y') {
            this.registerForm = this.formBuilder.group({

                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$")]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.pattern(/^[a-zA-Z]{2,}$/)]],
                zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(4), Validators.maxLength(6)]],
                // phonenumber: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                // Validators.minLength(14), Validators.maxLength(14), this.forbiddenFirstDigitValidator()]],
                phonenumber: ['', [Validators.maxLength(14), this.nanpPhoneValidator()
                ]],
                email: ['', [Validators.required]],
                acceptTerms: [true, null],
                Termsandcondition: [true, Validators.requiredTrue]

            });

            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            this.registerForm.controls["email"].setValue(DataHandler.email);
            this.registerForm.controls["phonenumber"].setValue(DataHandler.phone);
            const phoneNumberControl = this.registerForm.get('phonenumber') || DataHandler.phone;
            if (phoneNumberControl) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone);
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
        } else {
            this.registerForm = this.formBuilder.group({

                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$")]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.pattern(/^[a-zA-Z]{2,}$/)]],
                zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                Validators.minLength(4), Validators.maxLength(6)]],
                // phonenumber: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                // Validators.minLength(14), Validators.maxLength(14), this.forbiddenFirstDigitValidator()]],
                phonenumber: ['', [Validators.maxLength(14), this.nanpPhoneValidator()
                ]],
                email: ['', [Validators.required]],
                acceptTerms: [true, null],
                Termsandcondition: [true, Validators.requiredTrue]

            });
            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            this.registerForm.controls["email"].setValue(DataHandler.email);
            
            const phoneNumberControl = this.registerForm.get('phonenumber') || DataHandler.phone;
            if (phoneNumberControl) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone);
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
        }
        if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '' && DataHandler.zipcode != '') {
            this.initialevent();
        }
        this.registerForm.controls["Termsandcondition"].setValue(true);

        setTimeout(() => {
            this.adobe_sdg_event('page-load', 'initial-popup-load');
        }, 500);
        this.dealercode = DataHandler.dealer;
    }

    get f() { return this.registerForm.controls; }


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


    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            this.adobe_sdg_event('error-display', 'error', 'Invalid form fields', 'form-validation');
            // MerkleHandler.merkleexecutor('apply-credit-invalid');
            return;
        }
        this.eventEmitterService.displayMainContent();
        this.formSubmitted = true;


        DataHandler.firstname = this.registerForm.controls["firstName"].value;
        DataHandler.lastname = this.registerForm.controls["lastName"].value;
        DataHandler.email = this.registerForm.controls["email"].value;
        DataHandler.phone = this.registerForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '');
        DataHandler.zipcode = this.registerForm.controls["zipCode"].value;

        if (this.firstime == 1) {
            ShiftDigitalHandler.shiftdigitalexecutor('apply for credit end');
            ShiftDigitalHandler.shiftdigitalexecutor('close Review Payment option');
            // MerkleHandler.merkleexecutor('apply-credit-end');
            // GoogleAnalyticsHandler.googleAnalyticsExecutor('apply-credit-end');

            if (DataHandler.enableautofi == 'dt') {
                this.ga4Service.submit_to_api('ApplyForCreditFormEndDT', DataHandler.getGlobalVisitorsIds, '', '', '', '', '').subscribe((response) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('ApplyForCreditFormEndDT').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('ApplyForCreditFormEndDT').subscribe((response: any) => { });
            } else if (DataHandler.enableautofi == 'rone') {
                this.ga4Service.submit_to_api('ApplyForCreditFormEndR1', DataHandler.getGlobalVisitorsIds, '', '', '', '', '').subscribe((response) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('ApplyForCreditFormEndR1').subscribe((response: any) => { });
                this.ga4dealerService.fire_asc_events('ApplyForCreditFormEndR1').subscribe((response: any) => { });
            }
            this.adobe_sdg_event('apply-credit-form-submit');
            this.firstime = 2;
        }

        if (DataHandler.leadtrack == 0) {
            this.restService.track_lead().subscribe((response: any) => {
            });
            DataHandler.leadtrack = 1;
        }
        DataHandler.creditflag_set = 1;

        if (DataHandler.form_submitted == 0) {
            this.eventEmitterService.fnApplyCreditDisable();
            DataHandler.currentSubmitType = "explore-finance-options";
            this.restService.private_offers().subscribe((response: any) => {
                this.privateoffer = JSON.parse(JSON.stringify(response));
                if (this.privateoffer != undefined && this.privateoffer != null) {
                    DataHandler.private_Offer_Status = this.privateoffer.status;
                    if (DataHandler.private_Offer_Status == true) {
                        DataHandler.privateofferID = this.privateoffer.privateOffers.programNumber;
                        DataHandler.privateofferamount = this.privateoffer.privateOffers?.amount;
                        DataHandler.certificatecode = this.privateoffer.privateOffers.certificateCode;
                        DataHandler.offerexpire = this.privateoffer.privateOffers.expiryDate;
                        DataHandler.which_private_offer_popup = 2;
                        DataHandler.private_offer_email = this.registerForm.controls["email"].value;
                        this.eventEmitterService.fnSecondPrivateOffer();                      
                        if (DataHandler.open_private_offer_pop == 0 && DataHandler.private_Offer_Status == true) {
                            setTimeout(() => {
                                 const couponCodeDialogRef = this.dialog.open(PrivateOfferMessageDialog, {
                                    panelClass: ['inWidget', 'incentiveAddedDialog-container'],
                                    maxWidth: 100,
                                    disableClose: true,
                                    scrollStrategy: this.overlay.scrollStrategies.noop()
                                    });
                            },1000);
                        }
                        this.eventEmitterService.paymentleaserefresh([]);
                        this.eventEmitterService.paymentfinancerefresh([]);
                        this.eventEmitterService.paymentcashrefresh([]);
                        DataHandler.open_private_offer_pop = 1;
                        //   this.eventEmitterService.paymentfinancerefresh([]);
                        //   this.eventEmitterService.paymentcashrefresh([]);
                    }
                }
            });

            setTimeout(() => {
                if (DataHandler.extraParameter == 'eprice') {
                    DataHandler.currentSubmitType = 'uexp-eprice';
                }
                DataHandler.hint_comments = 'AC-onSubmit-398'
                this.restService.submit_lead_details().subscribe((response: any) => {
                    this.creditdialogRef.close();
                    if (DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] == false) {
                        this.restService.GATrackingData().subscribe((response: any) => {
                            DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] = true;
                        });
                    }
                    DataHandler.form_submitted = 1;
                });
            }, 2000);
        }

        this.restService.get_ca_details(DataHandler.vin, DataHandler.dealer, this.registerForm.value["firstName"], this.registerForm.value["lastName"], this.registerForm.value["phonenumber"], this.registerForm.value["zipCode"], this.registerForm.value["email"], 'Lease').subscribe((response) => {
            var obj = JSON.parse(JSON.stringify(response));
            this.creditdialogRef.close();
            this.adobe_sdg_event('initial-apply-credit-form');
            this.url = obj.result.iframe_url;
            if (obj.result.cc_flag == "rone") {
                //   MerkleHandler.merkleexecutor('apply-credit-routone');
            } else if (obj.result.cc_flag == "dt") {
                //   MerkleHandler.merkleexecutor('apply-credit-dealertrack');
            }

            //As of now hardcoding this since getting credit-application response empty 
           // this.url = "https://uat-suite.dtdrs.dealertrack.com?accountId=782267&dealerId=4102&vin=1C4RJYC60R8941899&msrp=70465&authHashTimestamp=1732690944000&authHash=XHYDHj39WNmcCT3pJx9H6u4IEwnbnb3DlROVlWbx67I%3D&leadReferenceNumber=510000000238735490&lastName=test"
            this.eventEmitterService.populateiframe(this.url);

            // var drsContent = document.getElementById('drs-content') as HTMLElement;
            var creditForm = document.getElementById('applyCreditIframe') as HTMLElement;
            var iframe = document.getElementById('creditframe') as HTMLElement;

            // drsContent.style.display = 'none';
            creditForm.classList.add('showThis');

            DataHandler.applycredit = this.registerForm.value;
            //DataHandler.currentSubmitType = "";
            this.adobe_sdg_event('page-load', 'first-apply-credit-form');
        });
    }


    closeApplyCredit() {
        this.observableService.backButton();
        this.adobe_sdg_event('close-apply-credit-form');
        this.adobe_sdg_event('page-load','vehicle-details');

    }


    timeEnable = -1;

    enabletime(prTrpe: any) {
        if (prTrpe == 1) {
            this.timeEnable = this.timeEnable * -1;
        } else if (prTrpe == 2) {
            this.timeEnable = -1;
        }
    }

    public adobe_sdg_event(event_type: any, event_name: any = '', param: any = '', param1: any = '') {
       // console.log('ApplyCreditDialog-', event_type);
        try {
            const pageLoad = { ...DataHandler.SDGEvents.pageLoad };
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            //pageLoad.page = "apply-for-credit-form";
            pageLoad.site = "dealer";
            pageLoad.zipCode = DataHandler.zipcode;
            pageLoad.make = DataHandler.make;
            pageLoad.model = DataHandler.model;
            pageLoad.year = DataHandler.year;
            pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
            pageLoad.trim = DataHandler.trim;
            pageLoad.vin = DataHandler.vin;
            pageLoad.dealerCode = DataHandler.dealer;

            if (event_name === 'terms-and-conditions' && event_type === "page-load") {
                pageLoad.pageName = "terms-and-conditions";
            }

            if (event_type === "page-load" && event_name === 'first-apply-credit-form') {
                pageLoad.pageType = "apply-for-credit";
                pageLoad.pageName = "apply-for-credit:applicant-contact-info";
            }

            if (event_type === "page-load" && event_name === 'initial-popup-load') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "apply-for-credit-form";
            }

            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            interactionClick.page = "apply-for-credit-form";
            interactionClick.location = "apply-for-credit-form-overlay";

            formStart.formType = "eshop:apply-for-credit-form";
            formStart.formDescription = "lead";
            formStart.displayType = "modal";
            formStart.displayFormat = "modal";

            formSubmit.formType = "eshop:apply-for-credit-form";
            formSubmit.formDescription = "lead";
            formSubmit.displayType = "modal";
            formSubmit.displayFormat = "modal";

            if (event_type == "page-load") {
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return;
            }
            if (event_type == 'apply-credit-form-start') {
                AdobeSDGHandler.eventLogger("form-start", formStart);
                return;
            }
            if (event_type == 'apply-credit-form-submit') {
                AdobeSDGHandler.eventLogger("form-submit", formSubmit);
                return;
            }

            if (event_type == 'error-display') {
                errorDisplay.message = param;
                errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }
            if (event_type === 'page-load' && param === 'vehicle-details') {
                AdobeSDGHandler.eventLogger("page-load", DataHandler.SDGEvents.pageLoad);
                return;
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

            if (event_type == 'close-apply-credit-form') {
                interactionClick.page = "apply-for-credit:applicant-contact-info";
                interactionClick.location = "apply-for-credit";
                interactionClick.description = "close";
            }

            if (event_type == 'initial-apply-credit-form') {
                interactionClick.page = "apply-for-credit-form";
                interactionClick.location = "initial-form";
                interactionClick.description = "go-to-applicant-contact-info";
            }

            AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
        } catch (e) {
            console.log('ApplyCreditDialog-adobe_sdg_event issue', e);
        }
    }

    loadPIInfo(){
        this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
        this.registerForm.controls["lastName"].setValue(DataHandler.lastname );
        this.registerForm.controls["email"].setValue( DataHandler.email);
        this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
        let input = DataHandler.phone ;
         let formatted = input;
        if (input.length > 3) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3)}`;
        }
        if (input.length > 6) {
            formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
        }
        this.registerForm.get('phonenumber')?.setValue(formatted );
    }
}