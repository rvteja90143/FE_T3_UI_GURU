import { Component, OnInit, ElementRef, ChangeDetectorRef, HostListener, AfterViewChecked } from '@angular/core';

import { EventEmitterService } from '../event-emitter.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, ViewportScroller } from '@angular/common';
import { DataHandler } from '../common/data-handler';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { MerkleHandler } from '../common/merkle-handler';
import { RestService } from '../services/rest.service';
import { GA4Service } from '../services/ga4.service';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { GA4DealerService } from '../services/ga4dealer.service';
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { MatDatepicker, MatDatepickerActions, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MaterialModule } from "../material/material.module";
import { MatButtonModule } from '@angular/material/button';
import { ObservableLiveData } from '../common/observable-live-data';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { PrivateOfferMessageDialog } from '../test-drive/test-drive.component';
import { Overlay } from '@angular/cdk/overlay';


@Component({
    selector: 'app-submit-to-dealer-dialog',
    standalone: true,
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, FormsModule, MatDividerModule, MatIconModule, MatDatepickerToggle, MatDatepickerModule, MatDatepicker, ReactiveFormsModule, MaterialModule, MatButtonModule, MatDatepickerActions],
    templateUrl: './submit-to-dealer-dialog.component.html',
    styleUrl: './submit-to-dealer-dialog.component.scss'
})
export class SubmitToDealerDialogComponent implements OnInit, AfterViewChecked {
    registerForm!: FormGroup;
    submitted = false;
    formSubmitted = false;
    firstime = 0;
    dealername: any = '';
    dealeraddress: any = '';
    isValidFlg: boolean = true;
    showdelivery: any;
    disclaimerAge: any;
    submitDealerSuccessFlag: boolean = false;
    privateoffer: any;
    form: any;
    termsandcondition = 0;
    appreciate_text: any;
    heroImage: any;
    model: any;
    year: any;
    showthankyou: boolean = false;
    initialSuccess: boolean = false;
    vehicle_model: any;
    make_url: any;
    mandatoryphone: any;
    dealercode: any;
    customize_accessories: any;
    selected_Accessories = DataHandler.selected_Accessories;
    submitFormImage: any;
    isMobileScreen: boolean | undefined;
    openDialog = false;
    hideDialog = true; //hardcoded it since we did not need acc banner!
    public checkboxState = false;
    vehicle_type!: string;
    is_commnet_box_enable: any;
    isFocused = false;
    initialFormFilled: boolean = false;
    dealermiles:any;
    phoneNumber:any;

    constructor(private formBuilder: FormBuilder, private restService: RestService, private eventEmitterService: EventEmitterService, private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, public dialogRef: MatDialogRef<SubmitToDealerDialogComponent>, private readonly viewportScroller: ViewportScroller,
        private cdr: ChangeDetectorRef, private observableService: ObservableLiveData, private elementRef: ElementRef, private dialog: MatDialog,public overlay:Overlay,
        private observableservice: ObservableLiveData) {
        //this.viewportScroller.scrollToPosition([0, 0]);
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.showdelivery = DataHandler.showdelivery;
        this.disclaimerAge = DataHandler.disclaimerAge;
        this.heroImage = DataHandler.heroImage;
        this.is_commnet_box_enable = DataHandler.is_commnet_box_enable

        this.customize_accessories = DataHandler.customize_accessories;
        DataHandler.form = this.form = "second-lead";
        this.appreciate_text = DataHandler.appreciate_text;
        this.model = DataHandler.display_vehicle_name;
        this.year = DataHandler.year;
        this.vehicle_model = DataHandler.vehicle_model;
        this.make_url = DataHandler.make_url;
        this.dealercode = DataHandler.dealer;
        // ShiftDigitalHandler.shiftdigitalexecutor('lead form show');
        this.mandatoryphone = DataHandler.mandatory_phone;
        if (DataHandler.make?.toUpperCase() == 'JEEP' || DataHandler.make?.toUpperCase() == 'WAGONEER') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Bannerjeep.png";
        } else if (DataHandler.make?.toUpperCase() == 'RAM') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Banner_ram.png";
        } else if (DataHandler.make?.toUpperCase() == 'FIAT') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Bannerfiat.png";
        } else if (DataHandler.make?.toUpperCase() == 'DODGE') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Bannerdodge.png";
        } else if (DataHandler.make?.toUpperCase() == 'CHRYSLER') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Bannerchrysler.png";
        } else if (DataHandler.make?.toUpperCase() == 'ALFA ROMEO') {
            this.submitFormImage = "https://d1jougtdqdwy1v.cloudfront.net/images/Banneralfa.png";
        }
        this.restService.initialFormFilled$.subscribe(
            (value) => (this.initialFormFilled = value)
        );
    }

    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event): void {
    }
    onFocus() {
        this.isFocused = true;
    }

    onBlur() {
        this.isFocused = false;
    }
    fntermsandcondition() {
        let additionalContext = {
            type: 'view-terms-and-conditions'
        };
        this.adobe_sdg_event('interaction-click', additionalContext);
        this.termsandcondition = 1;
        additionalContext = {
            type: 'terms-and-conditions'
        };
        this.adobe_sdg_event('page-load', additionalContext);

        setTimeout(() => {
            const element = document.getElementById('terms_condition');
            const elements = document.getElementById('terms_conditions');

            if (element) {
                element.scrollIntoView(true);
                window.scrollTo(0, 0);
            }
            if (elements) {
                elements.scrollIntoView(true);
                window.scrollTo(0, 0);
            }
        }, 0);
   //     this.viewportScroller.scrollToPosition([0, 0]);
        this.cdr.detectChanges();
    }

    public additionalContext!: any;

    closetermsandcondition(source?: string) {
        if (!source && this.termsandcondition == 1 && source !== 'back') {
            this.additionalContext = {
                type: 'terms-and-conditions-overlay-close'
            };
        } else if (this.termsandcondition == 1 && source === 'back') {
            this.additionalContext = {
                type: 'terms-and-conditions-overlay-back'
            };
        } else if (source === 'form-submission-confirmation' && this.submitted && this.registerForm.valid) {
            this.additionalContext = {
                type: 'form-submission-confirmation'
            };
        } else if (source === 'form-submission-confirmation' && !this.submitted && this.openDialog) {
            this.additionalContext = {
                type: 'submit-to-dealer-form-close'
            };
           this.eventEmitterService.loadSDGVehicleDetailsEvent()
        }
        this.termsandcondition = 0;
        if (this.checkboxState === true) {
            this.checkboxState = true;
        } else {
            this.checkboxState = false;
        }
        if (this.additionalContext) {
            this.adobe_sdg_event('interaction-click', this.additionalContext);  
           
        }
        this.cdr.detectChanges();
    }

    closeMainDialog() {
        if (this.termsandcondition === 0 && this.additionalContext?.type === 'form-submission-confirmation') {
          this.eventEmitterService.closeMainDialog();
           // this.eventEmitterService.closeMainDialogSDG();      
           this.eventEmitterService.closeWidgetSDGEvent();
        }
    }

    private isAccessoriesSeparate(): boolean {
        return !(this.make_url === 'ALFA' && this.vehicle_type === 'new');
    }

    redirectAccessooriesTab() {
        this.restService.setClickAccessories(true);
        let additionalContext = {
            type: 'redirect-accessoories-tab'
        };
        // const tabLabels = this.isAccessoriesSeparate() ? ['Accessories'] : ['Protection & Accessories'] || ['Protection'];
        // this.eventEmitterService.changeTabAcc(tabLabels);
        // this.dialogRef.close('Accessories');
        this.adobe_sdg_event('interaction-click', additionalContext);
    }

    redirectDesktopVersion() {
        const tabLabels = this.isAccessoriesSeparate() ? ['Accessories'] : ['Protection'];
        this.eventEmitterService.changeTabAcc(tabLabels);
        this.dialogRef.close('Accessories');
    }

    redirectMobVersion() {
        const tabLabels = this.isAccessoriesSeparate() ? ['Accessories'] : ['Protection & Accessories'];
        DataHandler.accessoriesClick = true;
        this.eventEmitterService.changeTabAcc(tabLabels);
        this.dialogRef.close('Accessories');
    }

    callSubmitForm() {
        this.customize_accessories = 'N';
        this.selected_Accessories > 0;
        this.openDialog = true;
        this.hideDialog = true;
        let additionalContext = {
            type: 'submit-to-dealer-form'
        }
        this.adobe_sdg_event('interaction-click', additionalContext);
        this.adobe_sdg_event('page-load', additionalContext);
        if (this.initialFormFilled) {           
            this.adobe_sdg_event('form-start');
        }
    }

    updateCheckboxState(event: any) {
        this.checkboxState = event.checked;
        if (event.checked) {
            DataHandler.homedeliverycheck_submitform = true;
        }
        else {
            DataHandler.homedeliverycheck_submitform = false;
        }
        this.cdr.detectChanges();
    }

    initialevent() {
        if (this.firstime == 0) {
            ShiftDigitalHandler.shiftdigitalexecutor('submit to dealer start');
            MerkleHandler.merkleexecutor('review-submit-start');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('review-submit-start');
            this.ga4Service.submit_to_api('SubmitToDealerFormStart', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('SubmitToDealerFormStart').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('SubmitToDealerFormStart').subscribe((response: any) => { });
            this.firstime = 1;
            if (!this.initialFormFilled) {
                this.adobe_sdg_event('form-start');
            }
        }
    }

    submitDealerSuccess() {
        var dealerForm = document.getElementById('submitDealer_wrapper') as HTMLElement;
        var dealerSuccess = document.getElementById('submitDealerSuccess') as HTMLElement;
        dealerForm.style.display = 'none';
        dealerSuccess.classList.add('showThis');
    }

    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
        if (event.keyCode != 8) {
            this.validatePhoneNo(event.target);
        }
        this.initialevent();
    }


    firstDigitValidator(control: FormControl) {
        const firstDigit = control.value?.toString().charAt(1);
        if (firstDigit === '0' || firstDigit === '1') {
            return { 'invalidFirstDigit': true };
        }
        return null;
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

    atLeastOneAlphabet(control: any) {
        const regex = /[a-zA-Z]+/; // Regular expression to match alphabet characters
        const valid = regex.test(control.value); // Check if the control value contains at least one alphabet character
        return valid ? null : { atLeastOneAlphabet: true }; // Return null if valid, or the validation error object if invalid
    }

    validateInput(event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value;
        const pattern = /^[a-zA-Z-.']*$/; // Only alphanumeric characters allowed

        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    ngAfterViewChecked() {
       /*  setTimeout(() => {
           const thankYouPopup = document.getElementById('submitDealerSuccess');
            window.scrollTo(0, 0);
            if (thankYouPopup) {
                thankYouPopup.scrollIntoView(true);
            }
        }, 1000);*/
    }
    forbiddenFirstDigitValidator(): ValidatorFn {return (control: AbstractControl): ValidationErrors | null => {
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

    ngOnInit() {
        this.vehicle_type = DataHandler.vehicle_type;
        this.formSubmitted = DataHandler.formSubmitted;
        this.openDialog = true;
        //this.hideDialog = DataHandler.noAccessories ? true : false;
        if (DataHandler.mandatory_phone == 'Y') {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(4), Validators.maxLength(6)]],
                phonenumber: ['', [Validators.required,Validators.maxLength(14), this.forbiddenFirstDigitValidator(), Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                ]],
                email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")]],
                acceptTerms: [true, null],
                Termsandcondition: [true, Validators.requiredTrue],
                IpreferHomeDelivery: [false],
                commentSection: ['', '']
            });

            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            // if (DataHandler.phone != '')
            //     this.registerForm.controls["phonenumber"].setValue('(' + DataHandler.phone.substring(0, 3) + ')' + DataHandler.phone.substring(3, 6) + '-' + DataHandler.phone.substring(6));
            if (DataHandler.phone) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone); // Create a utility for formatting raw strings
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            const phoneNumberControl = this.registerForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
            this.registerForm.controls["email"].setValue(DataHandler.email);
            // this.registerForm.controls["commentSection"].setValue(DataHandler.LatestCommentValue);
        } else {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z-.']*$/), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z-.']*$/), this.atLeastOneAlphabet]],
                zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]*$/),
                Validators.minLength(4), Validators.maxLength(6)]],
                phonenumber: ['', [Validators.maxLength(14), this.forbiddenFirstDigitValidator(), Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                ]],
                email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]],
                acceptTerms: [true, null],
                Termsandcondition: [true, Validators.requiredTrue],
                IpreferHomeDelivery: [false],
                commentSection: ['', '']
            });


            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            // if (DataHandler.phone != '')
            //     this.registerForm.controls["phonenumber"].setValue('(' + DataHandler.phone.substring(0, 3) + ')' + DataHandler.phone.substring(3, 6) + '-' + DataHandler.phone.substring(6));
            if (DataHandler.phone) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone); // Create a utility for formatting raw strings
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
            const phoneNumberControl = this.registerForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.registerForm.controls["zipCode"].setValue(DataHandler.zipcode);
            this.registerForm.controls["email"].setValue(DataHandler.email);
            // this.registerForm.controls["commentSection"].setValue(DataHandler.LatestCommentValue);
        }
        // if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '' && DataHandler.zipcode != '') {
        //     this.initialevent();
        // }
        this.registerForm.controls["Termsandcondition"].setValue(DataHandler.termscondtioncheckbox);
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
     validateZipcode(event :any) {
       const input =Number( event.target.value.replace(/\D/g, ''));
       if(event.target.value.length>1 &&input ==0) {
        this.registerForm.controls["zipCode"].setValue('')
        return ;
       }
    }

    get f() { return this.registerForm.controls; }

    dealerinfo() {
    this.dealername = DataHandler.dealerinfo?.dealerName;
    this.dealermiles = DataHandler.dealerinfo?.dealermiles;
    //this.dealeraddress = DataHandler.dealerinfo?.dealerAddress1;
    //this.dealeraddress = DataHandler.dealerinfo.dealerAddress1+', '+DataHandler.dealerinfo.dealerCity+', '+DataHandler.dealerinfo.dealerState+', '+DataHandler.dealerinfo.dealerZip;
    this.dealeraddress =
  DataHandler.dealerinfo?.dealerAddress1 +
  (DataHandler.dealerinfo?.dealerAddress2 ? ', ' + DataHandler.dealerinfo?.dealerAddress2 : '') +
  ', ' + DataHandler.dealerinfo?.dealerCity +
  ', ' + DataHandler.dealerinfo?.dealerState +
  ', ' + DataHandler.dealerinfo?.dealerZip;
    this.phoneNumber = DataHandler.dealerinfo?.phoneNumber;
    if (this.phoneNumber) {
        const phoneStr = String(this.phoneNumber);
        this.phoneNumber = '(' + phoneStr.substring(0, 3) + ')' + phoneStr.substring(3, 6) + '-' + phoneStr.substring(6);
    }
  }

  submittodealerclick()
{
this.ga4dealerService.fire_asc_events('SubmitToDealerFormEnd').subscribe((response: any) => { });
}

    onSubmit() {
        this.submitted = true;
        this.dealerinfo();
        if (this.registerForm.invalid) {
            let additionalContext = {
                type: 'form-validation'
            }
            this.adobe_sdg_event('error-display', additionalContext);
            MerkleHandler.merkleexecutor('review-submit-invalid');
            return;
        }

        this.formSubmitted = DataHandler.formSubmitted = true;
        this.observableService.setFormSubmitted(true);
        ShiftDigitalHandler.shiftdigitalexecutor('scheduled Delivery form submit');
        if (this.firstime == 1) {
            ShiftDigitalHandler.shiftdigitalexecutor('Initial popup form submit');
            MerkleHandler.merkleexecutor('review-submit-end');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('review-submit-end');
            setTimeout(() => {
                this.ga4Service.submit_to_api('SubmitToDealerFormEnd', DataHandler.getGlobalVisitorsIds, '', '', '', '', '').subscribe((response) => { });
                this.ga4dealerService.submit_to_api_ga4dealer('SubmitToDealerFormEnd').subscribe((response: any) => { });
                //this.ga4dealerService.fire_asc_events('SubmitToDealerFormEnd').subscribe((response: any) => { });
            }, 3000);

            this.firstime = 2;
        }
        DataHandler.submitdealer = this.registerForm.value;
        DataHandler.firstname = this.registerForm.controls["firstName"].value;
        DataHandler.lastname = this.registerForm.controls["lastName"].value;
        DataHandler.email = this.registerForm.controls["email"].value;
        DataHandler.phone = this.registerForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '');
        DataHandler.zipcode = this.registerForm.controls["zipCode"].value;
        // DataHandler.LatestCommentValue = this.registerForm.controls["commentSection"].value;

        if (DataHandler.leadtrack == 0) {
            this.restService.track_lead().subscribe((response) => {
            });
            DataHandler.leadtrack = 1;
        }
        this.eventEmitterService.fnApplyCreditDisable();
        if (DataHandler.form_submitted == 0) {
            var dealerForm = document.getElementById('submitDealer_wrapper') as HTMLElement;
            this.restService.private_offers().subscribe({
                next: (response: any) => {
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
                            this.eventEmitterService.fnSecondPrivateOffer();
                            this.eventEmitterService.paymentleaserefresh([]);
                            this.eventEmitterService.paymentfinancerefresh([]);
                            this.eventEmitterService.paymentcashrefresh([]);
                            DataHandler.open_private_offer_pop = 1;

                        } else {
                            this.initialSuccess = true;
                            this.showthankyou = true;
                            this.submitDealerSuccessFlag = true;
                            const additionalDetails = {
                                type: 'form-submission-confirmation'
                            };
                            setTimeout(()=>{
                                this.adobe_sdg_event('page-load', additionalDetails);
                            },100)
                        }
                    } else {
                        this.initialSuccess = true;
                        this.showthankyou = true;
                        this.submitDealerSuccessFlag = true;
                    }                 
                
                    this.adobe_sdg_event('form-submit');
                    
                },
                error: (error) => {
                    const additionalContext = {
                        type: 'service-availability'
                    };
                    this.adobe_sdg_event('error-display', additionalContext);
                    console.error('adobeDataLayer', error);
                }
            });
            setTimeout(() => {
                DataHandler.form_submitted = 1;
                if (DataHandler.extraParameter == 'eprice') {
                    DataHandler.currentSubmitType = 'uexp-eprice';
                }
                DataHandler.hint_comments = 'submit-delaer-dialog'
                this.restService.submit_lead_details().subscribe((response: any) => {
                    if (DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] == false) {
                        this.restService.GATrackingData().subscribe((response) => {
                            DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] = true;
                        });
                    }
                });
            }, 2000);
        }else if(DataHandler.form_submitted ==1){
                this.initialSuccess = true;
                this.showthankyou = true;
                this.submitDealerSuccessFlag = true;
        }
    }

    public adobe_sdg_event(event_type: string, additionalContext: Record<string, any> = {}) {
       // console.log('SubmitToDealerDialogComponent-', event_type);
        try {
            switch (event_type) {
                case 'page-load':
                    DataHandler.SDGEvents.pageLoad.zipCode = DataHandler.zipcode;
                    DataHandler.SDGEvents.pageLoad.dealerCode = DataHandler.dealercode;
                    DataHandler.SDGEvents.pageLoad.make = DataHandler.make;
                    DataHandler.SDGEvents.pageLoad.condition = DataHandler.actualVehicleType?.toLowerCase();                     
                    DataHandler.SDGEvents.pageLoad.model = DataHandler.model;
                    DataHandler.SDGEvents.pageLoad.year = DataHandler.year;
                    DataHandler.SDGEvents.pageLoad.trim = DataHandler.trim;
                    DataHandler.SDGEvents.pageLoad.vin = DataHandler.vin;
                    DataHandler.SDGEvents.pageLoad.pageType = "overlay";
                    DataHandler.SDGEvents.pageLoad.site = 'dealer';

                    if (additionalContext.type === 'terms-and-conditions') {
                        DataHandler.SDGEvents.pageLoad.pageName = "terms-and-conditions";
                    } else if (additionalContext.type === 'form-submission-confirmation') {
                        DataHandler.SDGEvents.pageLoad.pageName = "form-submission-confirmation";
                    }
                    else if (additionalContext.type === 'submit-to-dealer-form') {
                        DataHandler.SDGEvents.pageLoad.pageName = "submit-to-dealer-form";
                    }
                    DataHandler.SDGEvents.interactionClick.page = DataHandler.SDGEvents.pageLoad.pageName;
                    AdobeSDGHandler.eventLogger('page-load', DataHandler.SDGEvents.pageLoad);
                    break;

                case 'interaction-click':
                    let interactionClick = {
                        "site": "dealer",
                        "type": "nav",
                        "page": "terms-and-conditions",
                    };

                    if (additionalContext.type === 'view-terms-and-conditions') {
                        Object.assign(interactionClick, {
                            page: "submit-to-dealer-form",
                            location: "terms-and-conditions",
                            description: "view",
                        });
                    }

                    if (additionalContext.type === 'terms-and-conditions-overlay-close') {
                        Object.assign(interactionClick, {
                            location: 'terms-and-conditions-overlay',
                            description: 'close',
                        });
                    }

                    if (additionalContext.type === 'terms-and-conditions-overlay-back') {
                        Object.assign(interactionClick, {
                            "location": "terms-and-conditions",
                            "description": "back-to-form"
                        });
                    }
                    if (additionalContext.type === 'form-submission-confirmation') {
                        Object.assign(interactionClick, {
                            "page": "form-submission-confirmation",
                            "location": "confirmation-details",
                            "description": "close"
                        });
                    }
                    if (additionalContext.type === 'submit-to-dealer-form-close') {
                        Object.assign(interactionClick, {
                            "page": "submit-to-dealer-form",
                            "location": "submit-to-dealer-form-overlay",
                            "description": "close"
                        });
                    }

                    if (additionalContext.type === 'redirect-accessoories-tab') {
                        Object.assign(interactionClick, {
                            "page": "add-accessories-before-submit-to-dealer",
                            "location": "overlay",
                            "description": "Accessories"
                        });
                    }

                    if (additionalContext.type === 'submit-to-dealer-form') {
                        Object.assign(interactionClick, {
                            page: "add-accessories-before-submit-to-dealer",
                            location: "overlay",
                            description: "submit-to-dealer-form",
                        });
                    }

                    AdobeSDGHandler.eventLogger('interaction-click', { ...interactionClick });
                    break;

                case 'form-start':
                    let formStart = {
                        "formDescription": "lead",
                        "formType": "eshop:submit-to-dealer-form",
                        "displayType": "modal",
                        "displayFormat": "modal"
                    }
                    AdobeSDGHandler.eventLogger('form-start', { ...formStart });
                    break;

                case 'form-submit':
                    let formSubmit = {
                        "formDescription": "lead",
                        "formType": "eshop:submit-to-dealer-form",
                        "displayType": "modal",
                        "displayFormat": "modal",
                        "hashedEmail": "",
                        "leadId": ""
                    }
                    AdobeSDGHandler.eventLogger('form-submit', { ...formSubmit });
                    break;

                case 'error-display':
                    let errorDisplay = {
                        "message": "Invalid form fields",
                        "type": "form-validation"
                    }
                    if (additionalContext.type === 'service-availability') {
                        Object.assign(errorDisplay, {
                            "message": "Error in API Response",
                            "type": "service-availability"
                        });
                    }
                    AdobeSDGHandler.eventLogger('error-display', { ...errorDisplay });
                    break;

                default:
                    console.warn('Unhandled event type:', event_type);
                    break;
            }
        } catch (error) {
            console.error('Error in adobe_sdg_event:', error);
        }
    }
}
