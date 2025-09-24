import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormGroup, FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DataHandler } from '../common/data-handler';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RestService } from '../services/rest.service';
import { EventEmitterService } from '../event-emitter.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';
import { ObservableLiveData } from "../common/observable-live-data";
import { PrivateOfferMessageDialog } from '../test-drive/test-drive.component';
import { Overlay } from '@angular/cdk/overlay';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { GA4DealerService } from '../services/ga4dealer.service';

declare var paypal: any;
@Component({
    selector: 'app-reserve-now',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
    templateUrl: './reserve-now.component.html',
    styleUrl: './reserve-now.component.scss'
})

export class ReserveNowComponent {
    isMobileScreen: any = false;
    pageName: string = '';
    reserveNowLockedMessage: any;
    heroImage: any;
    make: any;
    model: any;
    year: any;
    reserveAmount: any;
    msrp: any;
    registerForm !: FormGroup;
    isValidFlg: boolean = true;
    submitted = false;
    paypalButtonStatus = false;
    intervalForPageExpire: any;
    intervalPageChecking: any;
    expireTime: any;
    transactionId: any;
    firstname: any;
    lastname: any;
    display_vehicle_name: any;
    dealercode: any;
    fullName: any;
    address_line_1 !: FormGroup;
    admin_area_1: boolean = true;
    admin_area_2 = false;
    country_code = false;
    postal_code: any;
    faqs: any;
    dealerinfo: any;
    printNew: any;

    reservationPrivacyLink: any;
    reservationTermLink: any;
    paypalStart: any = 0;
    paypalStartfirsttime: any = 0;

    faqCloseIndex: any;
    faqOpenIndex: any;
    msrp_disclaimer: any;
    payment_confirmed: boolean = false;
    list_upfit_flag: any;

    privateoffer: any;
    privateofferamount: any;
    certificatecode: any;
    privateofferexpire: any;
    private_Offer_Status: any;
    vehicle_model: any;
    makeurl: any;
    makemodle: any;
    mandatoryphone: any;
    paypalClientId: any;
    reserveCurrency: any;
    formkeyup = false;

    @ViewChild('forPrint') forPrint!: ElementRef;

    @ViewChild('paypal') paypalElement !: ElementRef;

    displayText!: SafeHtml;

    isCollapsed: boolean = true;

    maxLength: number = 100;
    reserveNowButtonText: string = 'Reserve';
    reserveNowButtonStatus: string = 'disable';
    @Output() closeReserveNow = new EventEmitter<void>();

    constructor(public dialog: MatDialog, private ga4dealerService: GA4DealerService, private formBuilder: FormBuilder, public reservedialogRef: MatDialogRef<ReserveNowComponent>, private restService: RestService, private eventEmitterService: EventEmitterService,
        private renderer: Renderer2, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private sharedService: SharedService,public overlay:Overlay,
        private observableService: ObservableLiveData) {
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.paypalClientId = DataHandler.paypalClientId;
        this.reserveCurrency = DataHandler.reserveCurrency;
        this.loadPaypalScripts();
        this.heroImage = DataHandler.heroImage;
        this.make = DataHandler.make;
        this.model = DataHandler.model;
        this.year = DataHandler.year;
        this.reserveAmount = DataHandler.reserveAmount;
        this.msrp = DataHandler.base_msrp;
        this.display_vehicle_name = DataHandler.display_vehicle_name;
        this.reservationPrivacyLink = DataHandler.reservationPrivacyLink;
        this.reservationTermLink = DataHandler.reservationTermLink;
        this.msrp_disclaimer = DataHandler.msrp_disclaimer;
        this.list_upfit_flag = DataHandler.list_upfit_flag;
        this.vehicle_model = DataHandler.vehicle_model;
        this.makeurl = DataHandler.make_url;
        this.makemodle = DataHandler.display_vehicle_name;
        this.mandatoryphone = DataHandler.mandatory_phone;
        // this.save_vin_lock_status();
        // this.reservenow_faq();
        this.dealercode = DataHandler.dealer;
        this.displayText = this.sanitizeHTML(`<p>Advance paid towards this order is not a down payment or guarantee toward vehicle
    purchase. It simply indicates interest to proceed with placing the order for a vehicle with chosen preferences, which is then confirmed and finalized by the Dealer. If under any circumstances, the request cannot be serviced, the Dealer may recommend a similar vehicle OR may refund your advance.</p>
    <strong>Opt in:</strong> By providing your email address, you may receive future communications about updates, incentives and special offers from Stellantis, subsidiary or affiliated companies or one of their authorized dealers or representatives.<br>
    Stellantis does not intentionally market to children under 16 years of age.<br>
    By clicking on SUBMIT, you verify that you are over 16 years of age.<br>
    By submitting your mobile phone number, you also acknowledge that Stellantis, its subsidiary or affiliated companies or one of their authorized dealers or representatives may send you commercial text messages.<br>
    Such contact may use automated technology.<br>
    You consent and agree to that type of contact and more generally to the Stellantis online privacy policy when you submit your request.<br>
    Standard text message and data rates may apply. You can opt out at any time.<br>
    You are not required to agree to this as a condition of purchasing any <a href="${this.reservationPrivacyLink}" target="_blank">U.S. PRIVACY STATEMENT</a> property, goods, or services.
    <p>Your reservation is nearly complete. Don't worry, you can finalize your build prior to ordering.</p>`);

        this.eventEmitterService.loadReserveNowPIInfo.subscribe(()=>{
            this.loadPIInfo();
        })

    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
    }

    get displayPara(): SafeHtml {
        const plainText: string = this.removeHtmlTags(this.displayText.toString());
        const truncatedText = this.isCollapsed ? plainText.slice(0, this.maxLength) + '...' : plainText;
        return this.sanitizeHTML(truncatedText);
    }

    // removeHtmlTags(html: string): string {
    //   const tempElement = document.createElement('div');
    //   tempElement.innerHTML = html;
    //   return tempElement.textContent || tempElement.innerText || '';
    // }

    removeHtmlTags(str: string): string {
        return str.replace(/<\/?[^>]+(>|$)/g, "");  // Removes HTML tags
    }

    sanitizeHTML(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
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



    ngOnInit() {
        if (DataHandler.mandatory_phone == 'Y') {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), Validators.pattern(/^[a-zA-Z-.']{2,}$/), this.atLeastOneAlphabet]],
                phonenumber: ['', [Validators.required, Validators.maxLength(14), this.forbiddenFirstDigitValidator(), Validators.pattern(/^\([2-9]\d{2}\) [2-9]\d{2}-\d{4}$/),
                this.exactLengthValidator(10)
                ]],
                email: ['', [Validators.required]],
                acceptTerms: [false, Validators.requiredTrue]
            });
           
            this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
            this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
            this.registerForm.controls["email"].setValue(DataHandler.email);
           
            if (DataHandler.phone) {
                const formattedPhone = this.formatRawPhoneNumber(DataHandler.phone); // Create a utility for formatting raw strings
                this.registerForm.get('phonenumber')?.setValue(formattedPhone, { emitEvent: false });
            }
        } else {
            this.registerForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), this.atLeastOneAlphabet]],
                lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$"), Validators.pattern(/^[a-zA-Z-.']{2,}$/), this.atLeastOneAlphabet]],
                phonenumber: ['', [Validators.required, Validators.maxLength(14), this.forbiddenFirstDigitValidator(), Validators.pattern(/^\([2-9]\d{2}\) [2-9]\d{2}-\d{4}$/),
                this.exactLengthValidator(10)
                ]],
                email: ['', [Validators.required]],
                acceptTerms: [false, Validators.requiredTrue]
            });
        }
            
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
        this.adobe_sdg_event('page-load');
        if(DataHandler.firstname != null   && DataHandler.lastname != null && DataHandler.email != null
            && DataHandler.firstname != ''   && DataHandler.lastname != '' && DataHandler.email != ''
        ){ 
                this.adobe_sdg_event('form-start');
                this.formkeyup = true;
            }
        this.sharedService.setReserveDialogState(true);
        this.eventEmitterService.subsVar = this.eventEmitterService.reserveNowDisable.subscribe((status: string, text: string) => {
            this.reserveNowButtonStatus = status;
            this.reserveNowButtonText = 'Offer Pending';
        });

        this.registerForm.valueChanges.subscribe((changedObj: any) => {
            //console.log(changedObj);
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

    reservenow_faq() {
        this.firstname = DataHandler.firstname;
        this.lastname = DataHandler.lastname;
        this.restService.reservenow_faq().subscribe((response) => {
            var arResponseData = JSON.parse(JSON.stringify(response));
            this.faqs = Object.keys(arResponseData).map(index => {
                let person = arResponseData[index];
                return person;
            });
        });
    }

    loadPaypalScripts() {
        //loading paypal sdk
        // const script = this.renderer.createElement('script');
        // script.type = 'text/javascript';
        // script.src = "https://www.paypal.com/sdk/js?client-id=" + this.paypalClientId + "&currency=" + this.reserveCurrency + "D";
        // this.renderer.appendChild(document.body, script);
        // return script;
        const paypalScript = "https://www.paypal.com/sdk/js?client-id=" + this.paypalClientId + "&currency=" + this.reserveCurrency + "D" + "&disable-funding=paylater";
        this.loadScriptWithRetry(paypalScript)
            .then(() => console.log('Paypal scripts loaded successfully.'))
            .then(() => this.save_vin_lock_status())
            .then(() => this.reservenow_faq())
            .catch((error: any) => console.error('Error loading Paypal scripts:', error));
    }

    loadScriptWithRetry(url: string, maxRetries: number = 3, retryDelay: number = 1000): Promise<void> {
        let retries = 0;

        const load = () => {
            return new Promise<void>((resolve, reject) => {
                const scriptElement = document.createElement('script');
                scriptElement.src = url;

                scriptElement.onload = () => {
                    resolve();
                };

                scriptElement.onerror = () => {
                    if (retries < maxRetries) {
                        retries++;
                        setTimeout(() => {
                            load().then(resolve).catch(reject);
                        }, retryDelay);
                    } else {
                        reject(new Error(`Script load error for URL: ${url} after ${maxRetries} retries`));
                    }
                };

                document.body.appendChild(scriptElement);
            });
        };

        return load();
    }

    initializePapal() {
        paypal.Buttons({
            env: DataHandler.paypalEnvironment,
            style: {
                layout: 'vertical',
                size: 'responsive',
                shape: 'rect',
                color: 'blue',
                fundingicons: false,
                tagline: false
            },
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            },
            createOrder: (data: any, actions: any) => {
                this.ga4dealerService.fire_asc_events('ReserveNowEnd').subscribe((response: any) => {});
                let additionalContext = {
                    type: 'payment',
                    value: data.paymentSource === 'paypal' ? "paypal-window-open" : "paypal-iframe-open"
                };

                let privatedata = {
                    'brand': DataHandler.make,
                    'firstName': DataHandler.encfirstname,
                    'lastName': DataHandler.enclastname,
                    'emailAddress': DataHandler.encemail,
                    'zipCode': DataHandler.zipcode,
                    "programID": "",
                    current_session: DataHandler.currentSession_PrivateOffer
                };
                // https://qa-jeep.eshopdemo.net https://uat.e-shop.jeep.com
                fetch(environment.UsedBackendApi_Url + '/api/privateoffer', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(privatedata)
                }).then((response) => {
                    return response.json();
                }).then((resJson) => {
                    DataHandler.private_Offer_Status = resJson.status;
                    DataHandler.privateofferID = resJson.privateOffers.programNumber;
                    DataHandler.privateofferamount = resJson.privateOffers.amount;
                    DataHandler.certificatecode = resJson.privateOffers.certificateCode;
                    DataHandler.offerexpire = resJson.privateOffers.expiryDate;
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
                    DataHandler.open_private_offer_pop == 1
                    this.eventEmitterService.paymentleaserefresh([]);
                    this.eventEmitterService.paymentfinancerefresh([]);
                    this.eventEmitterService.paymentcashrefresh([]);
                });

                let formData = {
                    dealer_code: DataHandler.dealer,
                    entered_zip_code: DataHandler.zipcode,
                    price: DataHandler.reserveAmount,
                    make: DataHandler.make,
                    model: DataHandler.model,
                    params_vech_type: 'new',
                    year: DataHandler.year,
                    mmyid: DataHandler.oreIdForReservation,
                    email_cache: DataHandler.email,
                    current_session: DataHandler.current_session
                };
                let url: any;
                if (DataHandler.make_url.toLowerCase() === 'alfa') {
                    url = environment.BackendApi_Url_Alfa;
                } else {
                    url = environment.UsedBackendApi_Url;
                }
                return fetch(url + '/api/reservationlead/reserve-order-create', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).then((response) => {
                    return response.json();
                }).then((resJson) => {
                    if (data.paymentSource == 'card') {
                        this.adobe_sdg_event('interaction-click', additionalContext);
                        // MerkleHandler.merkleexecutor('paypal-form-card');
                    } else if (data.paymentSource == 'paypal') {
                        this.adobe_sdg_event('interaction-click', additionalContext);
                        // MerkleHandler.merkleexecutor('paypal-form-paypal');
                    }
                    DataHandler.orderIdForReservation = resJson.data.id;

                    let formData = {
                        pagename: 'inwidget',
                        dealercode: DataHandler.dealer,
                        EnteredZipCode: DataHandler.zipcode,
                        params_make: DataHandler.make,
                        params_modelname: DataHandler.model,
                        params_year: DataHandler.year,
                        params_vechType: 'new',
                        order_id: DataHandler.orderIdForReservation,
                        id: DataHandler.oreIdForReservation,
                        params_drive_type: '',
                        firstName: DataHandler.encfirstname,
                        lastName: DataHandler.enclastname,
                        contact_phone: DataHandler.encphone,
                        contact_email: DataHandler.encemail,
                        tier: 't3',
                        country_code: '',
                        vin: DataHandler.vin,
                        msrp: DataHandler.base_msrp,
                        current_session: DataHandler.current_session
                    };

                    let url: any;
                    if (DataHandler.make_url.toLowerCase() === 'alfa') {
                        url = environment.BackendApi_Url_Alfa;
                    } else {
                        url = environment.UsedBackendApi_Url;
                    }

                    fetch(url + '/api/reservationlead/dealer-lead-data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    return resJson.data.id;
                });
            },
            onApprove: (data: any, actions: any) => {
                let formData = {
                    make: DataHandler.make,
                    model: DataHandler.model,
                    year: DataHandler.year,
                    mmyid: DataHandler.oreIdForReservation,
                    email_cache: DataHandler.email,
                    current_session: DataHandler.current_session
                }; //https://qa-jeep.eshopdemo.net https://uat.e-shop.jeep.com
                let url: any;
                if (DataHandler.make_url.toLowerCase() === 'alfa') {
                    url = environment.BackendApi_Url_Alfa;
                } else {
                    url = environment.UsedBackendApi_Url;
                }
                fetch(url + '/api/reservationlead/reserve-order-get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }).then((response) => {
                    return response.json();
                }).then((resJson) => {
                    DataHandler.paypalPayerData.fullName = resJson.data.purchase_units[0]?.shipping?.name?.full_name;
                    DataHandler.paypalPayerData.address_line_1 = resJson.data.purchase_units[0]?.shipping?.address?.address_line_1;
                    DataHandler.paypalPayerData.admin_area_1 = resJson.data.purchase_units[0]?.shipping?.address?.admin_area_1;
                    DataHandler.paypalPayerData.admin_area_2 = resJson.data.purchase_units[0]?.shipping?.address?.admin_area_2;
                    DataHandler.paypalPayerData.country_code = resJson.data.purchase_units[0]?.shipping?.address?.country_code;
                    DataHandler.paypalPayerData.postal_code = resJson.data.purchase_units[0]?.shipping?.address?.postal_code;
                    DataHandler.paypalPageNAme = '';

                    let leadData = { type: "leadId", value: DataHandler.orderIdForReservation }
                    this.adobe_sdg_event('form-submit', leadData);
                });
            },
            onCancel: (data: any) => {
                // Show a cancel page, or return to cart  
                //console.log(data);
                let errorDetails = {
                    "message": "expected an order id to be passed",
                    "type": "service-availability"
                }
                this.adobe_sdg_event('error-display', errorDetails);
            },
            onError: (err: any) => {
                // Show an error page here, when an error occurs  
                console.log(err);
                DataHandler.paypalPageNAme = 'orderError';
                let errorDetails = {
                    "message": "expected an order id to be passed",
                    "type": "service-availability"
                }
                this.adobe_sdg_event('error-display', errorDetails);
            }

        }
        ).render(this.paypalElement.nativeElement);
    }

    validateInputField(inputField:any){
        
        if (this.registerForm.controls[inputField].errors != null ) {
            let errorDetails = {
                message: 'Invalid form fields',
                type: "form-validation"
            }
            this.adobe_sdg_event('error-display', errorDetails);            
            this.paypalButtonStatus = false;
        }
    } 
    saveReserveForm(event: any, fieldName: string) {
        if (!this.formkeyup) {
            this.adobe_sdg_event('form-start');
            this.formkeyup = true;
        }
        if (fieldName == 'firstName') {
            DataHandler.firstname = event.target.value;
        } else if (fieldName == 'lastName') {
            DataHandler.lastname = event.target.value;
        } else if (fieldName == 'phonenumber') {
            DataHandler.phone = event.target.value.replace('(', '').replace(')', '').replace('-', '');
            ;
        } else if (fieldName == 'email') {
            DataHandler.email = event.target.value;
        }

        DataHandler.encfirstname = this.restService.encrypt(DataHandler.firstname);
        DataHandler.enclastname = this.restService.encrypt(DataHandler.lastname);
        DataHandler.encphone = this.restService.encrypt(DataHandler.phone);
        DataHandler.encemail = this.restService.encrypt(DataHandler.email);


        if (DataHandler.leadtrack == 0) {
            this.restService.track_lead().subscribe((response) => {
            });
            DataHandler.leadtrack = 1;
        }

        if (this.registerForm.valid) {
            this.paypalButtonStatus = true;
 
            this.intervalPageChecking = setInterval(() => {
                this.fullName = DataHandler.paypalPayerData.fullName;
                this.address_line_1 = DataHandler.paypalPayerData.address_line_1;
                this.admin_area_1 = DataHandler.paypalPayerData.admin_area_1;
                this.admin_area_2 = DataHandler.paypalPayerData.admin_area_2;
                this.country_code = DataHandler.paypalPayerData.country_code;
                this.postal_code = DataHandler.paypalPayerData.postal_code;
                this.pageName = DataHandler.paypalPageNAme;


                if (DataHandler.paypalPageNAme != 'orderForm' && !this.payment_confirmed) {
                    this.payment_confirmed = true;
                    this.confirmPayment();
                    this.intrvalClearForCheckingPayment();
                }
            }, 1000);
        }

      /*  if (this.registerForm.invalid) {
            let errorDetails = {
                message: 'Invalid form fields',
                type: "form-validation"
            }
            if (this.paypalStart == 0) {
                this.adobe_sdg_event('error-display', errorDetails);
            }
            this.paypalButtonStatus = false;
        }*/

        if (this.paypalStart == 0) {
            ShiftDigitalHandler.shiftdigitalexecutor('Lead form start');
            // MerkleHandler.merkleexecutor('paypal-form-start');
            this.paypalStart = 1;
        }

    }

    intrvalClearForCheckingPayment() {
        clearInterval(this.intervalPageChecking);
    }

    confirmPayment() {
        this.dealerinfo = DataHandler.dealerinfo;
        this.firstname = DataHandler.firstname;

        this.lastname = DataHandler.lastname;
        this.restService.reservation_order_capture().subscribe((response) => {
            var arResponseData = JSON.parse(JSON.stringify(response));
            arResponseData = JSON.parse(arResponseData);

            if (arResponseData.order_id == null) {
                DataHandler.paypalPageNAme = this.pageName = 'orderNotPlaced';
                let errorDetails = {
                    "message": "order-not-placed",
                    "type": "service-availability"
                }
                this.adobe_sdg_event('error-display', errorDetails);
            }
            if (arResponseData.data.status == "COMPLETED") {
                this.certificatecode = DataHandler.certificatecode;
                this.privateofferexpire = DataHandler.offerexpire;
                this.private_Offer_Status = DataHandler.private_Offer_Status;
                this.privateofferamount = DataHandler.privateofferamount;
                DataHandler.payPalPurchaseUnit = arResponseData.data.purchase_units;
                DataHandler.paypalPageNAme = this.pageName = 'orderSuccess';
                DataHandler.currentSubmitType = "reserve-now";
                 DataHandler.form_submitted = 1;
                DataHandler.paypalPageType = 'inwidget-paypal';
                if (DataHandler.extraParameter == 'eprice') {
                    DataHandler.currentSubmitType = 'uexp-eprice';
                }
                this.restService.submit_lead_details()?.subscribe((response: any) => {
                    DataHandler.paypalPageType = '';
                    if (DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] == false) {
                        this.restService.GATrackingData().subscribe((response) => {
                            DataHandler.googleAnalyticIsSubmitted[DataHandler.vin + '-' + DataHandler.dealer + '-' + DataHandler.dealerzip] = true;
                        });
                    }
                     DataHandler.form_submitted = 1;
                    this.observableService.updateFormSubmitted(1);
                });

                this.transactionId = DataHandler.paypalPayerData.transactionId = arResponseData.data.purchase_units[0].payments.captures[0].id;
                this.eventEmitterService.fnReserveNowDisable('disable', 'Offer Pending');
                if (this.paypalStartfirsttime == 0) {
                    ShiftDigitalHandler.shiftdigitalexecutor('Lead form submit');
                    // MerkleHandler.merkleexecutor('paypal-form-submit', this.transactionId);
                    this.paypalStartfirsttime = 1;
                }

            } else {
                DataHandler.paypalPageNAme = this.pageName = 'orderError';
                let errorDetails = {
                    "message": "order-error",
                    "type": "service-availability"
                }
                this.adobe_sdg_event('error-display', errorDetails)
            }
        }

        );
    }

    get f() {
        return this.registerForm.controls;
    }

    closeReservePage() {
        DataHandler.closeReserve = true;       
         document.getElementById('backBtn')?.click();
    }

    save_vin_lock_status() {
        this.paypalButtonStatus = false;

        this.restService.save_vin_lock_status().subscribe((response) => {
            let arResponseData = JSON.parse(JSON.stringify(response));

            if (arResponseData.action == 'booked') {
                this.reserveNowLockedMessage = 'This vehicle has already been booked.';
                DataHandler.paypalPageNAme = this.pageName = 'orderErrorLock';
                let errorDetails = {
                    "message": "This vehicle has already been booked",
                    "type": "vehicle-unavailable"
                }
                this.adobe_sdg_event('error-display', errorDetails);
                this.reserveNowButtonText = 'Offer Pending';
            }

            else if (arResponseData.action == 'locked') {
                this.reserveNowLockedMessage = 'Thank you! This vehicle is being considered by another customer for reservation. You may try after some time or choose another vehicle.';
                DataHandler.paypalPageNAme = this.pageName = 'orderErrorLock';
                let errorDetails = {
                    message: this.reserveNowLockedMessage,
                    type: "vehicle-unavailable"
                }
                this.adobe_sdg_event('error-display', errorDetails);
                this.reserveNowButtonText = 'Reserve';
            }

            else if (arResponseData.action == 'expired-saved') {
                this.reserveNowLockedMessage = 'Time has expired to book this vehicle';
                DataHandler.paypalPageNAme = this.pageName = 'orderErrorLock';
                let errorDetails = {
                    message: this.reserveNowLockedMessage,
                    type: "session-timeout"
                }
                this.adobe_sdg_event('error-display', errorDetails);
                this.reserveNowButtonText = 'Reserve';
            }

            else if (arResponseData.action == 'continue' || arResponseData.action == 'saved') {
                this.reserveNowLockedMessage = '';
                DataHandler.paypalPageNAme = this.pageName = 'orderForm';
                this.expireTime = arResponseData.minutes ?? 10;
                this.reserveNowButtonText = 'Reserve';

                setTimeout(() => {
                    this.initializePapal();
                }, 1000);

                this.intervalForPageExpire = setInterval(() => {
                    if (DataHandler.paypalPageNAme != 'orderErrorLock' && DataHandler.paypalPageNAme != 'orderSuccess') {
                        this.release_vin_lock();

                        this.dialog.open(TimerDialog, {
                            panelClass: ['inWidget', 'timer-container'],
                            maxWidth: 175,
                            disableClose: true,
                            scrollStrategy: this.overlay.scrollStrategies.noop()
                        });
                        this.adobe_sdg_event("interaction-click", { type: 'time-expiration-popup' });
                        setTimeout(() => {
                            this.reservedialogRef.close();
                        }, 5000);
                    }
                }, 1000 * 60 * this.expireTime); //1000 * 60 * this.expireTime
            }
        });
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
    }

    formatDealerPhone(phone: any) {
        return phone.substring(0, 3) + '-' + phone.substring(3, 6) + '-' + phone.substring(6);
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

    release_vin_lock() {
        if (DataHandler.paypalPageNAme != 'orderErrorLock' && DataHandler.paypalPageNAme != 'orderSuccess') {
            this.restService.release_vin_lock().subscribe((response) => { });
        }
        // MerkleHandler.merkleexecutor('reservenow-close');
        clearInterval(this.intervalForPageExpire);
        this.intrvalClearForCheckingPayment();
        //this.reservedialogRef.close();
    }

    printThisPage() {
        var divContents = this.forPrint.nativeElement.innerHTML;
        this.printNew = window.open('', '', 'height=500, width=500');
        this.printNew.document.write('<html><body>');
        this.printNew.document.write(divContents);
        this.printNew.document.write('</body></html>');
        this.printNew.document.close();
        this.printNew.print();
        // MerkleHandler.merkleexecutor('reserve-print-this-page');
    }

    callFAQheaderOpen(index: any, Ques: any) {
        this.faqOpenIndex = index;
        if (this.faqOpenIndex == this.faqCloseIndex) {
            this.faqCloseIndex = -1;
        }
    }

    callFAQheaderClose(index: any, Ques: any) {
        this.faqCloseIndex = index;
        if (this.faqOpenIndex == this.faqCloseIndex) {
            this.faqOpenIndex = -1;
        }
    }

    faqHeader(Ques: any, index: any) {
        if (this.faqOpenIndex == index) {
            var qs = Ques.substring(Ques.indexOf(".") + 1);
            qs = qs.trim();
            qs = qs.replace(/[?]/g, '');
            // MerkleHandler.merkleexecutor('faq-header-open', '', qs);
        }
        if (this.faqCloseIndex == index) {
            var qs = Ques.substring(Ques.indexOf(".") + 1);
            qs = qs.trim();
            qs = qs.replace(/[?]/g, '');
            // MerkleHandler.merkleexecutor('faq-header-close', '', qs);
        }

    }

    public adobe_sdg_event(event_type: string, additionalContext: Record<string, any> = {}) {
        console.log('ReserveNowComponent-', event_type);
        try {
            switch (event_type) {
                case 'page-load':
                    DataHandler.SDGEvents.pageLoad.pageName = 'reserve-vehicle-form';
                    DataHandler.SDGEvents.pageLoad.pageType = "overlay";
                    DataHandler.SDGEvents.pageLoad.site = 'dealer';
                    DataHandler.SDGEvents.pageLoad.zipCode = DataHandler.zipcode;
                    DataHandler.SDGEvents.pageLoad.dealerCode = DataHandler.dealercode;
                    DataHandler.SDGEvents.pageLoad.condition = DataHandler.actualVehicleType?.toLowerCase(); 
                    DataHandler.SDGEvents.pageLoad.make = DataHandler.make;
                    DataHandler.SDGEvents.pageLoad.model = DataHandler.model;
                    DataHandler.SDGEvents.pageLoad.year = DataHandler.year;
                    DataHandler.SDGEvents.pageLoad.trim = DataHandler.trim;
                    DataHandler.SDGEvents.pageLoad.vin = DataHandler.vin;
                    DataHandler.SDGEvents.interactionClick.page = DataHandler.SDGEvents.pageLoad.pageName;
                    AdobeSDGHandler.eventLogger('page-load', DataHandler.SDGEvents.pageLoad);
                    break;

                case 'interaction-click':
                    let interactionClick = {
                        site: "dealer",
                        type: "tool",
                        page: "reserve-vehicle-form"
                    };

                    if (additionalContext.type === 'payment') {
                        Object.assign(interactionClick, {
                            location: additionalContext.type,
                            description: additionalContext.value,
                        });
                    }


                    if (additionalContext.type === 'termsCondition') {
                        Object.assign(interactionClick, {
                            type: 'nav',
                            location: "terms-and-conditions",
                            description: 'view',
                        });
                    }

                    if (additionalContext.type === 'time-expiration-popup') {
                        Object.assign(interactionClick, {
                            location: 'time-expiration-popup',
                            description: "automatic"
                        });
                    }

                    AdobeSDGHandler.eventLogger('interaction-click', { ...interactionClick });
                    break;

                case "form-start":
                    let details = {
                        "formDescription": "lead",
                        "formType": "eshop:reserve-vehicle-form",
                        "displayType": "modal",
                        "displayFormat": "modal"
                    }                   
                    AdobeSDGHandler.eventLogger('form-start', { ...details });
                    break;

                case "form-submit":
                    let leadDetails = {
                        "formDescription": "lead",
                        "formType": "eshop:reserve-vehicle-form",
                        "displayType": "modal",
                        "displayFormat": "modal",
                        "leadId": additionalContext.value
                    }
                    AdobeSDGHandler.eventLogger('form-submit', { ...leadDetails });
                    break;

                case "error-display":
                    let error = {
                        message: additionalContext.message,
                        type: additionalContext.type
                    }
                    AdobeSDGHandler.eventLogger('error-display', { ...error });
                    break;
                default:
                    console.warn('Unhandled event type:', event_type);
                    break;
            }
        } catch (error) {
            console.error('Error in adobe_sdg_event:', error);
        }
    }

    interactionClick() {
        let details = {
            "type": "termsCondition",
        }
        this.adobe_sdg_event('interaction-click', details)
    }

    ngOnDestroy() {
        this.sharedService.setReserveDialogState(false);
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

@Component({
    selector: 'timer-dialog',
    templateUrl: './timer-dialog.html',
})

export class TimerDialog {
    countDown: any;
    intrvalClearForCheckingRedirection: any;

    constructor(public timerDialogRef: MatDialogRef<ReserveNowComponent>) {
        this.countDown = 5;

        this.intrvalClearForCheckingRedirection = setInterval(() => {
            if (this.countDown <= 0) {
                this.intrvalClearForCheckingPayment();
                this.timerDialogRef.close();
            } else {
                this.countDown = this.countDown - 1;
            }
        }, 1000);
    }

    intrvalClearForCheckingPayment() {
        clearInterval(this.intrvalClearForCheckingRedirection);
    }
}