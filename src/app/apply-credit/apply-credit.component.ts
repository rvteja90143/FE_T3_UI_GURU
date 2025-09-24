import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, LOCALE_ID, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { EventEmitterService } from '../event-emitter.service';
import { RestService } from '../services/rest.service';
import { MatDialog } from '@angular/material/dialog';
// import { fetchAutoAddressSpec } from '../stores/fetch-auto-address/fetch-auto-address-action';
// import { getFetchAutoAddressSpec } from '../stores/fetch-auto-address/fetch-auto-address-selector';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, finalize, of, switchMap, takeUntil, tap, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import * as CryptoJS from 'crypto-js';
import * as FormActions from '../apply-credit/form-store/form-action';
import * as CoappFormActions from '../apply-credit/co-applicant-form-store/co-applicant-form-action';
// import { getVehicleInfoSpec } from '../vehicle-info/vehicle-info-store/vehicle-info-selector';
// import { getLeaseSpec } from '../payment-calculator/three-step-tab/lease/lease-store/lease-selector';
// import { EmploymentPaymentFrequency, applyCreditPayload } from '../common/data-models';
import { LoaderDialogComponent } from './loader-dialog.component';
// import { getPaymentOptionsState } from '../stores/payment-options/payment-options-selector';
import { CommonModule, ViewportScroller, formatNumber } from '@angular/common';
import { DataHandler } from './../common/data-handler';
// import { AdobeAnalyticsHandler } from './../services/adobeanalytics-handler';
// import { getFinanceSpec } from '../payment-calculator/three-step-tab/finance/finance-store/finance-selector';
// import { getAddedAccessories } from '../accessories/accessories-store/accessories-selector';
// import { getChargingSpec } from '../charging/charging-store/charging-selector';
// import { getTradeInData } from '../trade-in/trade-in-store/trade-in-selector';
// import { selectServiceProtectionFinance, selectServiceProtectionLease } from '../service-protection/service-protection-store/service-protection-selector';
import moment from 'moment';
import { getserviceContractFinanceDetailsState } from '../service-protection/service-protection-store/service-protection-selector';
import { EmploymentPaymentFrequency, applyCreditPayload } from '../common/data-models';
import { ConfirmCoApplicantDialogComponent } from './confirm-co-applicant-dialog-component';
import { TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerActions, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { PaymentCalculatorComponent } from '../payment-calculator/payment-calculator.component';
import { getLeaseDetailsState } from '../common/store/lease-details/lease-details-selector';
import { getFinanceDetailsState } from '../common/store/finance-details/finance-details-selector';
import { Overlay } from '@angular/cdk/overlay';
// import { getFinalizeDealInputDetails } from '../finalize-your-deal/finalize-your-deal-store/finalize-your-deal-selector';

export function ageValidator(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const dateValue = moment(control.value);
        const age = moment().diff(dateValue, 'years');

        if (!dateValue.isValid()) {
            return { 'invalidDate': { value: control.value } };
        } else if (age < minAge || age > maxAge) {
            return { 'invalidAge': { value: control.value, minAge, maxAge } };
        }
        return null;
    };
}

export function checkDuplicateSsn(ssnField: string, cassnitinField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!(control instanceof FormGroup)) return null;

        const ssn = control.get(ssnField)?.value;
        const cassnitin = control.get(cassnitinField)?.value;

        if (ssn && cassnitin && ssn === cassnitin) {
            return { needsExclamation: true };
        }
        return null;
    };
}

@Component({
    selector: 'app-apply-credit',
    standalone: true,
    imports: [MaterialModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDatepickerToggle, MatDatepickerModule, MatDatepickerActions, CommonModule, MatSelectModule, PaymentCalculatorComponent],
    templateUrl: './apply-credit.component.html',
    styleUrls: ['./apply-credit.component.scss']
})

export class ApplyCreditComponent implements OnInit, AfterViewInit, OnDestroy {
    public unsubscribe$: Subject<void> = new Subject<void>();
    private timerautoficallback: any = 0;
    public currentApplicationStep: string = 'contact-information';
    public emppreviousaddress_submitted = false;
    public ca_previousaddress_submitted = false;
    public ca_emppreviousaddress_submitted = false;
    public ca_prevEmployestatus_submitted = false;
    // public page = 'contactInfo';
    public page = 'payment_calc';
    public ca_contactinfo_submitted = false;
    public iscreditinfo = false;
    public isco_sourceincome = false;
    public autofiPage = '';
    public iscurrentincomet = false;
    public is_residence = false;
    public page2fn: any;
    public page3fn: any;
    public page4fn: any;
    public autofiStatus!: string;
    public contactinfo_submitted = false;
    public autofiForm!: FormGroup;
    public autofipayload: any = {};
    public primarysstin: any;
    public autofi_co_phone: any;
    personalInfoForm!: FormGroup;
    public employment_statusfn: any;
    public contactFirstname = '';
    public contactLastname = '';
    public contactEmail = '';
    public contactPhone = '';
    public contactZipcode = '';
    public coaplicantContactZipcode = '';
    public isValidFlg = true;
    public addprevaddress: any = 0;
    public is_contactinfo = false;
    public is_coresidencepayment: any;
    public isrelationship = false;
    public enableResidence = false;
    public co_enableResidence = false;
    public payment_submitted = false;
    public is_paymentcalc = false;
    public previousaddress_submitted = false;
    // public minDate!: Date;
    // public maxDate!: Date;
    public currentdate: any;
    public showotherpayment: any;
    public co_showotherpayment: any;
    public enableemployent = false;
    public co_enableemployent = false;
    public phoneFirstChar: any = '';
    public ca_employestatus_submitted = false;
    public co_currentdate: any;
    public Coappliantsstin: any;
    public fn_currentinfo: any;
    public employestatus_submitted = false;
    public residence_relationship: any;
    public enablerelationship = false;
    public co_enableresidence = false;
    public coisCurrentIncomeValid = false;
    public employe_payment_submitted = false;
    public date_form_submitted = false;
    public ca_date_form_submitted = false;
    public vehicle_make: any;
    public isco_employestatus = false;
    public isco_currentincomet = false;
    public autofidisable: any;
    public addcoprevemployment: any = 0;
    public isco_residence = false;
    public addcoprevaddress: any = 0;
    public ca_payment_submitted = false;
    public relationship_submitted = false;
    public isco_contactinfo = false;
    public isCurrentIncomeValid = false;
    public prevEmployestatus_submitted = false;
    public current_income_submitted = false;
    public selectedOption: any;
    public monthly: any;
    public isemployestatus = false;
    public addprevemployment: any = 0;
    public isco_creditinfo = false;
    public address!: string[];
    public obj: any;
    accepted = true;
    showroomTimingFilter: any;
    showautofi: any;
    public input: any;
    public printNew: any;
    public objActivePaymentData: any = {};
    public leaserange: any = null;
    public financetier: any;
    public financerange: any = null;
    public leasetradein: any = null;
    public lease_payload_autofi_taxes_fees: any;
    public finance_payload_autofi_taxes_fees: any;
    public leaseserviceprotection: any;
    public lease_payload_mopar_accessries: any;
    public finance_payload_mopar_accessries: any
    public lease_has_vauto_dlr_disc = false;
    public lease_has_max_digital_dlr_disc = false;
    public conditionalLeaseDataToShow: any;
    public leaseIncentivedata: any;
    public financetradein: any = null;
    public financeserviceprotection: any;
    public finance_has_vauto_dlr_disc = false;
    public finance_has_max_digital_dlr_disc = false;
    public conditionalFinanceDataToShow: any;
    public tradeincondition: any = null;
    public financeincentivedata: any;
    public tradeinvalue: any = null;
    public tradeinpayoff: any;
    public tradeinamount: any;
    public leasemileage: any = null;
    public leasemonthlycost: any = null;
    public leaseterms: any;
    public tradeinmake: any = null;
    public tradeinmodel: any = null;
    public tradeinyear: any = null;
    public tradeinseries: any = null;
    public tradeinmileage: any = null;
    public tradeinstyle: any = null;
    public show = 0;
    public autoFi_af_code: any;
    public msrp: any = null;
    public make: any = null;
    public model: any = null;
    public year: any = null;
    public trim: any = null;
    public financetaxes: any = null;
    public heroImage: string = '';
    public bodyColor: any = 'string';
    public bodyType: any = 'string';
    public oem_model_code: any;
    public lowestType = "lowest_apr";
    public financedafaultterm: any = null;
    public financeapr: any;
    public subventedProgramStatus: any;
    public financedownpayment: any = null;
    public leasedafaultterm: any = null;
    public leasedownpayment: any = null;
    public leaseTaxRate: any;
    public showcallback: any = 0;
    public activeTab: any;
    public formValues$!: Observable<any>;
    public fName!: string;
    public lName!: string;
    public reviewAddr!: string;
    public reviewPhNumber!: string;
    public reviewEmailId!: string;
    public reviewCity!: string;
    public reviewState!: string;
    public reviewZipCode!: string;
    public reviewApt!: string;
    public cafName!: string;
    public calName!: string;
    public careviewAddr!: string;
    public careviewPhNumber!: string;
    public careviewEmailId!: string;
    public careviewCity!: string;
    public careviewState!: string;
    public careviewZipCode!: string;
    public careviewApt!: string;
    public occupationHTML!: string;
    public reviewSSN!: any;
    public reviewSSNEncrypt!: any;
    public reviewBirthdate!: any;
    public careviewSSN!: any;
    public careviewSSNEncrypt!: any;
    public careviewBirthdate!: any;
    public prevCity!: string;
    public prevState!: string;
    public prevStreet!: string;
    public prevStreet2!: string;
    public prevZipcode!: any;
    public creditScore!: number;
    public listingdata: Array<any> = [];
    public incentivedata: Array<any> = [];
    public employeePhone!: any;
    public employeeName!: string;
    public prevEmpJobTitle!: string;
    public prevEName!: string;
    public prevEphone!: string;
    public empJobTitle!: string;
    public institute!: string;
    public militaryJobTitle!: string;
    public otherJobTitle!: string;
    public otherincome: any = {};
    private keyphrase: any = 'd41d8cd98f00b204e9810998ecf85373';
    public offerPreferences: any;
    private infoError!: string;
    public taxRate: any;
    public employerName!: string;
    public prevemployerName!: string;
    public prevEtitle!: string;
    financeTerm: any;
    financeMileage: any;
    financeAprRate: any;
    financeDownpayment: any;
    financeTradein: any;
    financemsrp: any;
    financeDealerDiscount: any;
    financeAdjustedCost: any;
    financeCountryCity: any;
    financeDownPayment: any;
    financedpPercent: any;
    financeTaxes_fees: any;
    financeMonthly_payment: any;
    financeEstNetPrice: any;
    financecustomer_zipcode: any;
    financecustomer_state: any;
    financecredit_score: any;
    financeTotalIncentives: any;
    financeTotalConditionalOffers: any;
    financeTiers: any;
    financeIncentives: any;
    selectedFinanceconditionalOffers: any;
    selectedFinanceEcoProgramId: any;
    financeSandP: any;
    financeTaxRate: any;
    financeTotal_taxes: any = null;
    financeTotal_fee: any = null;
    public leasedetails: any;
    public vauto_list_price: any;
    public max_list_price: any;
    public leasefees: any = null;
    public leaserangearr: any;
    public leaseAmountForDisplay: any;
    public txt!: string;
    public monthlycost: any;
    public tradeinvehicleType!: string;
    public tradeinTrim!: string;
    public tradeinValue!: number;
    public tradeinZip!: number;
    public formInteracted = false;
    public financeDetails: any;
    public isUrlLoaded = false;
    public coApplicantprevemployerName!: string;
    public coApplicantprevEtitle!: string;
    public coApplicantemployerName!: string;
    public coApplicantEtitle!: string;
    public scheduleDeliveryInfo: any;
    public dueAtSigning!: any;
    public dueAtSigningFinVal!: any;
    public data: any;
    spOptioncode!: string;
    spTitle!: string;
    spMiles!: string;
    spTerms!: any;
    spMsrp!: any;
    spMsrppermonth!: any;
    spDesc!: string;
    spImage!: string
    public spDataArray: any[] = [];
    isLoaderVisible$ = new BehaviorSubject<boolean>(false);
    private subscription: Subscription = new Subscription();
    @Input() public vin: any;
    @Input() public dealer_code: any;
    @Input() currentTabIndex!: number;
    readonly tabIndex = 6;
    @ViewChild('forPrint') public forPrint!: ElementRef;
    public coAppliantssn: any;
    public appliantssn: any;
    concatecoAppliantssn: any;
    coapptitle: any;
    iframeurl: any;
    autofiEnable: any;
    minDate = moment().subtract(120, 'years').toDate(); // Optional min date for 120 years ago
    maxDate = moment().subtract(18, 'years').toDate();
    startDate = this.maxDate;
    receivedData: any;

    transform(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    get f() {
        return this.autofiForm.controls;
    }

    get cs_f() {
        return this.autofiForm.controls;
    }

    ngAfterViewInit(): void {
        this.contactInfoSubscription();
        this.creditInfoSubscription();
        this.coAppcreditInfoSubscription();
        this.getVehicleInfoSubscription();
        this.prevResidenceInfoSubscription();
        this.empInfoSubscription();
        this.coAppEmpInfoSubscription();
        this.prevEmpInfoSubscription();
        this.paymentOptionSubscription();
        this.getLeaseDetailsSubscription();
        this.accessoriesSubscription();
        this.financeSubscription();
        this.tradeinSubscription();
        this.coAppCreditInfoFormValuesSubscription();
        this.appCreditInfoFormValuesSubscription();
        this.coappEmpFormValuesSubscription();
        // this.getFinalizeDealSubscription();
        this.autofiForm?.valueChanges.subscribe(() => {
            if ((this.autofiForm.touched || this.autofiForm.dirty) && !this.formInteracted) {
                this.adobe_apply_credit_form_start();
                this.formInteracted = true;
            }
        });
    }

    public getFinalizeDealSubscription() {
        if (DataHandler.testdrive?.location == 'myhome') {
            this.scheduleDeliveryInfo = {
                delivery_date: DataHandler.testdrive?.date,
                delivery_time: DataHandler.testdrive?.time,
                // distance_miles: data?.finalizeDeal_input_details[0]?.distance_miles,
                // delivery_fee: data?.finalizeDeal_input_details[0]?.delivery_fee,
                // vehicle_walk_through: data?.finalizeDeal_input_details[0]?.vehicle_walk_through,
                // delivery_experience: data?.finalizeDeal_input_details[0]?.delivery_experience,
                pickup_location: "Home",
                address: {
                    street: DataHandler.testdrive?.hlhomeAddress,
                    city: DataHandler.testdrive?.hlcity,
                    state: DataHandler.testdrive?.hlstate,
                    zip: DataHandler.testdrive?.hlzipcode
                }
            }
        }
    }

    atLeastOneAlphabet(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const valid = /[a-zA-Z]/.test(control.value);
            return valid ? null : { atLeastOneAlphabet: { value: control.value } };
        };
    }

    stateValidator() {
        return (control: AbstractControl): ValidationErrors | null => {
            const myArray: string[] = [
                'AL',
                'AK',
                'AZ',
                'AR',
                'AA',
                'AE',
                'AP',
                'CA',
                'CO',
                'CT',
                'DE',
                'DC',
                'FL',
                'GA',
                'HI',
                'ID',
                'IL',
                'IN',
                'IA',
                'KS',
                'KY',
                'LA',
                'ME',
                'MD',
                'MA',
                'MI',
                'MN',
                'MS',
                'MO',
                'MT',
                'NE',
                'NV',
                'NH',
                'NJ',
                'NM',
                'NY',
                'NC',
                'ND',
                'OH',
                'OK',
                'OR',
                'PA',
                'RI',
                'SC',
                'SD',
                'TN',
                'TX',
                'UT',
                'VT',
                'VA',
                'WA',
                'WV',
                'WI',
                'WY',
                'AB',
                'BC',
                'MB',
                'NB',
                'NL',
                'NT',
                'NS',
                'NU',
                'ON',
                'PE',
                'QC',
                'SK',
                'YT',
            ];
            const valueToCheck = control.value?.toString().toUpperCase();
            if (!myArray.includes(valueToCheck)) {
                return { invalidState: true };
            } else {
                return null;
            }
        };
    }

    validateInput(event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value;
        const pattern = /^[a-zA-Z-.']*$/;

        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    forbiddenFirstDigitValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const matches = value.match(/^\((\d)/);
            if (matches && (matches[1] === '0' || matches[1] === '1')) {
                return { invalidFirstDigit: true };
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

    private formatSsnitin(ssnControl: AbstractControl): void {
        if (!ssnControl) return;

        ssnControl.valueChanges.subscribe(value => {
            let newVal = value?.replace(/\D/g, '');

            if (newVal?.length === 0) {
                newVal = '';
            } else if (newVal?.length <= 3) {
                newVal = `(${newVal}`;
            } else if (newVal?.length <= 6) {
                newVal = `(${newVal.slice(0, 3)}) ${newVal.slice(3)}`;
            } else if (newVal?.length > 6) {
                newVal = `${newVal.slice(0, 3)}-${newVal.slice(3, 5)}-${newVal.slice(5)}`;
            }

            if (value !== newVal) {
                ssnControl.setValue(newVal, { emitEvent: false });
            }
        });
    }

    validateNumber(event: any) {
        const keyCode = event.keyCode;
        const excludedKeys = [8, 37, 39, 46];
        if (
            !(
                (keyCode >= 48 && keyCode <= 57) ||
                (keyCode >= 96 && keyCode <= 105) ||
                excludedKeys.includes(keyCode)
            )
        ) {
            event.preventDefault();
        }
    }

    constructor(
        public overlay:Overlay,
        private eventEmitterService: EventEmitterService,
        private formBuilder: FormBuilder,
        private restService: RestService,
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private store: Store<any>,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialog,
        @Inject(LOCALE_ID) private locale: string,
        private viewportScroller: ViewportScroller
    ) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        this.minDate = new Date(currentYear - 120, 0, 1);
        this.maxDate = new Date(currentDate.getFullYear() - 18, 11, 31);
        this.eventEmitterService.getActiveTab().subscribe((tabName: any) => {
            this.activeTab = tabName;
            if (tabName === '0') {
                this.activeTab = 'lease'
            }
            else if (tabName === '1') {
                this.activeTab = 'finance'
            }
            else if (tabName === '2') {
                this.activeTab = 'cash'
            }
        });

        this.autofiEnable = DataHandler.enableautofi;
        this.eventEmitterService.dueAtSigning.subscribe((value: any) => {
            if (value !== undefined) {
                this.dueAtSigning = value;
            }
        });

        this.eventEmitterService.dueAtSigningFinVal.subscribe((value: any) => {
            if (value !== undefined) {
                this.dueAtSigningFinVal = value;
            }
        });

        this.contactFirstname = DataHandler.firstname;
        this.contactLastname = DataHandler.lastname;
        this.contactPhone = DataHandler.phone;
        this.contactEmail = DataHandler.email;
        this.contactZipcode = DataHandler.zipcode;

        // this.autofiStatus = 'Auto-Fi - Initiated';
        // this.autofipayload.iscoapplicant = 'no';
        // this.autofiForm = this.formBuilder.group({
        //     firstName: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.pattern("^[a-zA-Z-.']*$"),
        //             this.atLeastOneAlphabet(),
        //         ],
        //     ],
        //     lastName: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.pattern("^[a-zA-Z-.']*$"),
        //             Validators.pattern(/^[a-zA-Z-.']{1,}$/),
        //             this.atLeastOneAlphabet(),
        //         ],
        //     ],
        //     email: ['', [Validators.required]],
        //     phonenumber: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
        //             Validators.minLength(14),
        //             Validators.maxLength(14),
        //             this.forbiddenFirstDigitValidator()
        //         ],
        //     ],
        //     address: [
        //         '',
        //         [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
        //     ],
        //     apt: ['', []],
        //     city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        //     state: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.pattern('^[a-zA-Z ]*$'),
        //             Validators.minLength(2),
        //             Validators.maxLength(2),
        //             this.stateValidator(),
        //         ],
        //     ],
        //     zipcode: [
        //         '',
        //         [
        //             Validators.required,
        //             Validators.pattern(/^[0-9]*$/),
        //             Validators.minLength(4),
        //             Validators.maxLength(5),
        //         ],
        //     ],
        //     materialstatus: ['', Validators.required],
        //     coapplicant: ['', Validators.required],
        // });
        // const phoneNumberControl = this.autofiForm.get('phonenumber');
        // if (phoneNumberControl) {
        //     this.formatPhoneNumber(phoneNumberControl);
        // }

        // this.autofipayload.CoApplicantempResidenceMonth = 1;

        // this.autofiPage = 'primary-identity-and-contact-information';
        // setTimeout(() => {
        //     this.autofiForm.controls['firstName'].setValue(this.contactFirstname);
        //     this.autofiForm.controls['lastName'].setValue(this.contactLastname);
        //     this.autofiForm.controls['email'].setValue(this.contactEmail);
        //     this.autofiForm.controls['zipcode'].setValue(this.contactZipcode);
        //     if (this.contactPhone !== undefined && this.contactPhone !== '') {
        //         this.autofiForm.controls['phonenumber'].setValue(
        //             '(' +
        //             this.contactPhone?.substring(0, 3) +
        //             ')' +
        //             this.contactPhone?.substring(3, 6) +
        //             '-' +
        //             this.contactPhone?.substring(6)
        //         );
        //     }
        //     this.autofiForm.controls['address']?.setValue(this.autofipayload.address);
        //     this.autofiForm.controls['apt']?.setValue(this.autofipayload.apt);
        //     this.autofiForm.controls['city']?.setValue(this.autofipayload.city);
        //     this.autofiForm.controls['state']?.setValue(this.autofipayload.state);
        //     this.autofiForm.controls['materialstatus']?.setValue(this.autofipayload.material_status);
        //     this.autofiForm.controls['coapplicant']?.setValue(this.autofipayload.coapplicant);
        // });

        this.iframeurl = this.transform('');

        if ((this.eventEmitterService.subsVar == undefined) != (this.eventEmitterService.subsVar != undefined)) {
            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeIframeComponentFunction.subscribe((param: string) => {
                    this.iframeurl = this.transform(param);
                });
        }
    }

    empCheckterms(event: any) {
        this.autofipayload.empAcceptTerms = event.checked;
    }

    CoApplicantempCheckterms(event: any) {
        this.autofipayload.CoApplicantempAcceptTerms = event.checked;
    }

    timeEnable = -1;

    enabletime(prTrpe: any) {
        if (prTrpe == 1) {
            this.timeEnable = this.timeEnable * -1;
        } else if (prTrpe == 2) {
            this.timeEnable = -1;
        }
    }

    adobe_apply_credit_continue(value: any, value2: any): any {
        // DataHandler.ic_pagename = "build-your-deal:apply-for-credit";
        // DataHandler.ic_pagetype = "nav";
        // DataHandler.ic_location = "credit-application-" + value;
        // DataHandler.ic_description = value2;
        // AdobeAnalyticsHandler.adobe_analytics_executor('interaction-click');
        this.currentApplicationStep = value2;
    }

    adobe_apply_credit_step_completed(value: any): any {
        // DataHandler.ic_pagename = "build-your-deal:apply-for-credit";
        // DataHandler.ic_pagetype = "nav";
        // DataHandler.ic_location = "credit-application-" + value;
        this.currentApplicationStep = value;
        // DataHandler.ic_description = "step-completed";
        // AdobeAnalyticsHandler.adobe_analytics_executor('interaction-click');
    }

    adobe_apply_credit_form_start(): any {
        // AdobeAnalyticsHandler.adobe_analytics_executor('form-start');
    }

    adobe_apply_credit_form_submit(value: any, value2: any): any {
        var params: any = [];
        params["hashedEmail"] = value;
        params["leadId"] = value2;

        // AdobeAnalyticsHandler.adobe_analytics_executor('form-submit', params);
    }

    adobe_apply_credit_error_display(value: any): any {
        var params: any = [];
        params["message"] = value;
        if (value != undefined && value != null && value != '') {
            // AdobeAnalyticsHandler.adobe_analytics_executor('credit-error-display', params);
        }
    }

    url: any;

    submitApplication() {
        let stepComplete = 'application-summary';
        let nextStepContinue = 'submit-application';
        if (this.autofipayload.coapplicant == 'yes') {
            stepComplete = 'coapp-application-summary';
            nextStepContinue = 'coapp-submit-application';
        }
        this.adobe_apply_credit_step_completed(stepComplete);
        //this.adobe_apply_credit_continue(this.currentApplicationStep, nextStepContinue);

        this.apicall();
    }

    private validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');
        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['phonenumber'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['phonenumber'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
    }

    public howYouPaidForm() {
        this.prevEmployestatus_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.prevEmployestatus_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(FormActions.savePrevEmpInfoFormValues({ prevEmpFormValues: formValues }));
        if (this.autofipayload.grossMothlyIncome === undefined) {
            this.autofipayload.grossMothlyIncome = 0;
        }
        this.autofipayload.financetiers = 'Monthly';
        this.autofiForm = this.formBuilder.group({});
        if (this.showotherpayment == 1) {
            if (this.autofipayload.otherincome === undefined) {
                this.autofipayload.otherincome = [];
            }
            if (this.autofipayload.employementpayment === 'Hourly') {
                this.autofiForm = this.formBuilder.group({
                    Hourly_Wage: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                    Hours_per_week: [
                        '',
                        [Validators.required, Validators.pattern('^[0-9 ]*$')],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Hourly_Wage'].setValue(response.Hourly_Wage);
                        this.autofiForm.controls['Hours_per_week'].setValue(response.Hours_per_week);
                    } else {
                        setTimeout(() => {
                            this.page3fn = 1;
                            this.autofiForm.controls['Hourly_Wage'].setValue(
                                this.autofipayload.Hourly_Wage
                            );
                            this.autofiForm.controls['Hours_per_week'].setValue(
                                this.autofipayload.Hours_per_week
                            );
                        }, 500);
                    }
                });
            } else if (this.autofipayload.employementpayment === 'Weekly') {
                this.autofiForm = this.formBuilder.group({
                    Weekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    this.page3fn = 2;
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Weekly_gross_amount'].setValue(response.Weekly_gross_amount);
                    } else {
                        setTimeout(() => {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    }
                });

            } else if (this.autofipayload.employementpayment === 'Bi-Weekly') {
                this.autofiForm = this.formBuilder.group({
                    Weekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    this.page3fn = 3;
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Weekly_gross_amount'].setValue(response.Weekly_gross_amount);
                    } else {
                        setTimeout(() => {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    }
                });

            } else if (
                this.autofipayload.employementpayment === 'Twice-a-Month'
            ) {
                this.autofiForm = this.formBuilder.group({
                    Weekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    this.page3fn = 4;
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Weekly_gross_amount'].setValue(response.Weekly_gross_amount);
                    } else {
                        setTimeout(() => {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    }
                });

            } else if (this.autofipayload.employementpayment === 'Monthly') {
                this.autofiForm = this.formBuilder.group({
                    Weekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    this.page3fn = 5;
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Weekly_gross_amount'].setValue(response.Weekly_gross_amount);
                    } else {
                        setTimeout(() => {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    }
                });

            } else if (this.autofipayload.employementpayment === 'Annual') {
                this.autofiForm = this.formBuilder.group({
                    Weekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    this.page3fn = 6;
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Weekly_gross_amount'].setValue(response.Weekly_gross_amount);
                    } else {
                        setTimeout(() => {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    }
                });

            } else {
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                this.page3fn = 0;
            }
            this.isemployestatus = true;
        } else if (this.showotherpayment === 0) {
            this.page = 'current_income';
            this.autofiPage = 'primary-current-income-information';
            this.isemployestatus = true;
            if (
                this.autofipayload.otherincome === undefined ||
                this.autofipayload.otherincome.length === 0
            ) {
                let otherIncomeData: any = {};
                otherIncomeData.incomeSource = '';
                otherIncomeData.financetiers = '';
                otherIncomeData.grossIncome = '';
                this.autofipayload.otherincome = [];
                this.autofipayload.otherincome.push(otherIncomeData);
            }
        }
    }

    public coappHowYouPaidForm() {
        this.ca_prevEmployestatus_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_prevEmployestatus_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(CoappFormActions.saveCoappPrevEmpInfoFormValues({ coappPrevEmpFormValues: formValues }));
        if (this.autofipayload.grossMothlyIncome === undefined) {
            this.autofipayload.grossMothlyIncome = 0;
        }
        this.autofipayload.financetiers = 'Monthly';
        this.autofiForm = this.formBuilder.group({});
        if (this.co_showotherpayment === 1) {
            if (this.autofipayload.otherincome === undefined) {
                this.autofipayload.otherincome = [];
            }
            if (this.autofipayload.CoApplicantemployementpayment === 'Hourly') {
                this.autofiForm = this.formBuilder.group({
                    caHourly_Wage: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                    caHours_per_week: [
                        '',
                        [Validators.required, Validators.pattern('^[0-9 ]*$')],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caHourly_Wage'].setValue(response.caHourly_Wage);
                        this.autofiForm.controls['caHours_per_week'].setValue(response.caHours_per_week);
                    }
                });
                setTimeout(() => {
                    this.autofiForm.controls['caHourly_Wage'].setValue(
                        this.autofipayload.CoApplicantHourly_Wage
                    );
                    this.autofiForm.controls['caHours_per_week'].setValue(
                        this.autofipayload.CoApplicantHours_per_week
                    );
                }, 500);
                this.fn_currentinfo = 1;
            } else if (this.autofipayload.CoApplicantemployementpayment === 'Weekly') {
                this.autofiForm = this.formBuilder.group({
                    caWeekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                    }
                });
                setTimeout(() => {
                    this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                        this.autofipayload.CoApplicantWeekly_gross_amount
                    );
                }, 500);
                this.fn_currentinfo = 2;
            } else if (this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly') {
                this.autofiForm = this.formBuilder.group({
                    caWeekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                    }
                });

                setTimeout(() => {
                    this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                        this.autofipayload.CoApplicantWeekly_gross_amount
                    );
                }, 500);
                this.fn_currentinfo = 3;
            } else if (
                this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
            ) {
                this.autofiForm = this.formBuilder.group({
                    caWeekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                    }
                });
                setTimeout(() => {
                    this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                        this.autofipayload.CoApplicantWeekly_gross_amount
                    );
                }, 500);
                this.fn_currentinfo = 4;
            } else if (this.autofipayload.CoApplicantemployementpayment === 'Monthly') {
                this.autofiForm = this.formBuilder.group({
                    caWeekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-informationn';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                    }
                });
                setTimeout(() => {
                    this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                        this.autofipayload.CoApplicantWeekly_gross_amount
                    );
                }, 500);
                this.fn_currentinfo = 5;
            } else if (this.autofipayload.CoApplicantemployementpayment === 'Annual') {
                this.autofiForm = this.formBuilder.group({
                    caWeekly_gross_amount: [
                        null,
                        [
                            Validators.required,
                            Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                        ],
                    ],
                });
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.CoappFormActions.coappHowYouPaidFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                    }
                });
                setTimeout(() => {
                    this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                        this.autofipayload.CoApplicantWeekly_gross_amount
                    );
                }, 500);
                this.fn_currentinfo = 6;
            } else {

                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                this.fn_currentinfo = 0;
            }
            this.isco_employestatus = true;
        } else if (this.co_showotherpayment === 0) {
            this.page = 'coapplicant_current_income';
            this.autofiPage = 'co-applicant-current-income-information';
            this.isco_employestatus = true;
            if (
                this.autofipayload.otherincome === undefined ||
                this.autofipayload.otherincome.length === 0
            ) {
                let otherIncomeData: any = {};
                otherIncomeData.incomeSource = '';
                otherIncomeData.financetiers = '';
                otherIncomeData.grossIncome = '';
                this.autofipayload.otherincome = [];
                this.autofipayload.otherincome.push(otherIncomeData);
            } else {
                this.autofipayload.otherincome.push(this.autofipayload.otherincome);
            }
        }
    }

    public reviewApplicant() {
        this.page = 'review_application';
        this.autofiPage = 'review-summary-information';
        this.ca_date_form_submitted = true;
        this.isco_creditinfo = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_date_form_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(CoappFormActions.saveCoappCreditInfoFormValues({ coappCreditInfoFormValues: formValues }));
        this.autofipayload.CoApplicantdate = this.autofiForm.controls['cadate']?.value;
        this.autofipayload.CoApplicantssnitin = this.autofiForm.controls['cassnitin']?.value;
        this.autofipayload.CoApplicantssnitinencrypt = 'XXX-XX-'.concat(this.autofipayload.CoApplicantssnitin?.substring(7, 12));
        this.adobe_apply_credit_step_completed('coapp-credit-information');
        //this.adobe_apply_credit_continue('coapp-credit-information', 'coapp-review-application');
        if (this.autofiForm.valid) {
            this.autofipayload.ca_date = this.autofiForm.controls['cadate'].value;
            let d = new Date(this.autofipayload.date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            this.currentdate = [month, day, year].join('/');
            this.autofipayload.currentdateAPI = [year, month, day].join('-');
            // this.autofipayload.ssnitin = this.primarysstin = this.autofiForm.controls['ssnitin'].value;
            this.autofipayload.ssnitin = this.primarysstin = this.coAppliantssn;
        }
        this.adobe_apply_credit_step_completed('coapp-review-application');
        //this.adobe_apply_credit_continue('coapp-review-application', 'coapp-application-summary');
    }

    public reviewApplication() {
        this.iscreditinfo = true;
        this.date_form_submitted = true;
        this.viewportScroller.scrollToPosition([0, 0]);
        if (this.autofipayload.coapplicant === 'yes') {
            this.isco_contactinfo = false;
            this.isrelationship = false;
            this.isco_residence = false;
        }
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.iscreditinfo = true;
            this.date_form_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }

        const formValue = this.autofiForm.getRawValue();
        this.store.dispatch(FormActions.saveCreditInfoFormValues({ creditInfoFormValues: formValue }));
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.creditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let response = JSON.parse(JSON.stringify(resp));
                this.autofiForm.controls['date'].setValue(response.date);
                this.autofiForm.controls['ssnitin'].setValue(response.ssnitin);
            }
        });
        this.adobe_apply_credit_step_completed('credit-information');
        //this.adobe_apply_credit_continue('credit-information', 'review-application');
        if (this.autofiForm.valid) {
            this.autofipayload.date = this.autofiForm.controls['date'].value;
            let d = new Date(this.autofipayload.date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            this.currentdate = [month, day, year].join('/');
            this.autofipayload.currentdateAPI = [year, month, day].join('-');
            //this.autofipayload.ssnitin = this.primarysstin = this.autofiForm.controls['ssnitin'].value;
            this.autofipayload.ssnitin = this.primarysstin = this.appliantssn;
        }

        if (this.autofipayload.coapplicant === 'yes') {
            this.autofiForm = this.formBuilder.group({
                cafirstName: [
                    '',
                    [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")],
                ],
                calastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                    ],
                ],
                caemail: ['', [Validators.required]],
                caphonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                caaddress: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                caapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                cacity: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                ],
                castate: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator,
                    ],
                ],
                cazipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                camaterialstatus: ['', [Validators.required]],
            });
            const phoneNumberControl = this.autofiForm.get('caphonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            setTimeout(() => {
                this.autofiForm.controls['cafirstName']?.setValue(
                    this.autofipayload.CoApplicantfirstname
                );
                this.autofiForm.controls['calastName']?.setValue(
                    this.autofipayload.CoApplicantlastname
                );
                this.autofiForm.controls['caemail']?.setValue(
                    this.autofipayload.CoApplicantemail
                );
                this.autofiForm.controls['cazipcode']?.setValue(
                    this.autofipayload.CoApplicantzipcode
                );
                if (
                    this.autofipayload.CoApplicantphone !== undefined &&
                    this.autofipayload.CoApplicantphone !== ''
                ) {
                    this.autofiForm.controls['caphonenumber']?.setValue(
                        '(' +
                        this.autofipayload.CoApplicantphone.substring(0, 3) +
                        ')' +
                        this.autofipayload.CoApplicantphone.substring(3, 6) +
                        '-' +
                        this.autofipayload.CoApplicantphone.substring(6)
                    );
                }
                this.autofiForm.controls['caaddress']?.setValue(
                    this.autofipayload.CoApplicantaddress
                );
                this.autofiForm.controls['caapt']?.setValue(
                    this.autofipayload.CoApplicantapt
                );
                this.autofiForm.controls['cacity']?.setValue(
                    this.autofipayload.CoApplicantcity
                );
                this.autofiForm.controls['castate']?.setValue(
                    this.autofipayload.CoApplicantstate
                );
                this.autofiForm.controls['camaterialstatus']?.setValue(
                    this.autofipayload.CoApplicantamaterial_status
                );
            }, 500);
            this.page = 'coapplicant_contactinfo';
            this.autofiPage = 'co-applicant-identity-and-contact-information';
            this.date_form_submitted = true;
        } else if (this.autofipayload.coapplicant === 'no') {
            // this.autofipayload.iscoapplicant = 'yes';
            this.page = 'review_application';
            this.autofiPage = 'review-summary-information';
            this.ca_date_form_submitted = true;
            this.date_form_submitted = true;
            if (this.autofiForm.invalid) {
                this.adobeAnalyticsErrorInfo();
                this.adobe_apply_credit_error_display(this.infoError);
                this.date_form_submitted = true;
                this.autofiForm.markAllAsTouched();
                return;
            }
            const formValues = this.autofiForm.getRawValue();
            this.store.dispatch(FormActions.saveCreditInfoFormValues({ creditInfoFormValues: formValues }));
            this.adobe_apply_credit_step_completed('review-application');
            //this.adobe_apply_credit_continue('review-application', 'application-summary');
        }
        this.autofipayload.CoApplicantdate = this.autofiForm.controls['cadate']?.value;
        this.autofipayload.CoApplicantssnitin = this.autofiForm.controls['cassnitin']?.value;
        this.autofipayload.CoApplicantssnitinencrypt = 'XXX-XX-'.concat(this.autofipayload.CoApplicantssnitin?.substring(7, 12));
    }

    public summaryForm() {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.isco_creditinfo = true;
        this.page = 'summary';
    }

    public thankYouPage() {
        if (this.page === 'summary') {
            setTimeout(() => {
                this.page = 'final';
            });
        }
    }

    public printSection(): void {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            const doc = iframe.contentWindow?.document;

            if (!doc) {
                console.error('Unable to access iframe document');
                document.body.removeChild(iframe);
                return;
            }

            const sectionElement = document.querySelector('.autofy-terms.section-to-print');
            const sectionHtml = sectionElement?.innerHTML ?? '';

            doc.open();
            doc.write(`<html><body>${sectionHtml}</body></html>`);
            doc.close();

            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };

        iframe.src = 'about:blank';
    }

    handleContinue() {
        // this.iscreditinfo = true;
        if (this.autofipayload.coapplicant === 'no') {
            this.reviewApplication();
        } else {
            this.page = 'coapplicant_contactinfo';
        }
    }

    getVehicleInfoSubscription() {
        // this.store.pipe(select(getVehicleInfoSpec), takeUntil(this.unsubscribe$)).subscribe((resp: any) => {
        //     if (resp !== null && resp !== undefined) { 
        //         let data = JSON.parse(JSON.stringify(resp));
        //         this.bodyType = data.vehicle_info_spec?.body_style;
        //         this.bodyColor = data.vehicle_info_spec?.exterior_color_desc;
        //         this.msrp = data.vehicle_info_spec?.msrp;
        //         this.make = data.vehicle_info_spec?.make;
        //         this.model = data.vehicle_info_spec?.model
        //         this.oem_model_code = 'Challenger';
        //         this.trim = data.vehicle_info_spec?.trim_desc;
        //         this.vin = data.vehicle_info_spec?.vin;
        //         this.year = data.vehicle_info_spec?.year;
        //         setTimeout(() => {
        //             this.heroImage = data.vehicle_info_spec?.thumbnail_url;
        //         }, 100);
        this.autoFi_af_code = '1VYF';
        //     }
        // });
    }

    getSandPSubscription() {
        this.spDataArray = DataHandler.SandPData;
    }

    getSandPSubscriptionFinance() {
        this.spDataArray = DataHandler.SandPDataFinance
    }

    creditInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.creditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let ssnitinencrypt = 'XXX-XX'.concat(resp.ssnitin?.substring(7, 12));
                this.reviewSSNEncrypt = ssnitinencrypt;
                this.reviewSSN = resp.ssnitin;
                this.reviewBirthdate = resp.date;
            }

        });
    }

    coAppcreditInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappCreditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let ssnitinencrypt = 'XXX-XX'.concat(resp.cassnitin?.substring(7, 12));
                this.careviewSSNEncrypt = ssnitinencrypt;
                this.careviewSSN = resp.cassnitin;
                const date = new Date(resp.cadate);
                const formattedDate = `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
                this.careviewBirthdate = formattedDate;
            }
        });
    }

    contactInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.contactFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.fName = resp.firstName;
                this.lName = resp.lastName;
                this.reviewPhNumber = resp.phonenumber;
                this.reviewEmailId = resp.email;
                this.reviewAddr = resp.address;
                this.reviewCity = resp.city;
                this.reviewState = resp.state;
                this.reviewApt = resp.apt;
                this.reviewZipCode = resp.zipcode;
                this.autofiForm.controls['firstName'].setValue(resp.firstName);
                this.autofiForm.controls['lastName'].setValue(resp.lastName);
                this.autofiForm.controls['email'].setValue(resp.email);
                this.autofiForm.controls['phonenumber'].setValue(resp.phonenumber);
                this.autofiForm.controls['address'].setValue(resp.address);
                this.autofiForm.controls['apt'].setValue(resp.apt);
                this.autofiForm.controls['city'].setValue(resp.city);
                this.autofiForm.controls['state'].setValue(resp.state);
                this.autofiForm.controls['zipcode'].setValue(resp.zipcode);
                this.autofiForm.controls['materialstatus'].setValue(resp.materialstatus);
                this.autofiForm.controls['coapplicant'].setValue(resp.coapplicant);
            }
        });
    }

    coAppcontactInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappContactFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.cafName = resp.cafirstName;
                this.calName = resp.calastName;
                this.careviewPhNumber = resp.caphonenumber;
                this.careviewEmailId = resp.caemail;
                this.careviewAddr = resp.caaddress;
                this.careviewCity = resp.cacity;
                this.careviewState = resp.castate;
                this.careviewApt = resp.caapt;
                this.careviewZipCode = resp.cazipcode;
                this.autofiForm.controls['cafirstName'].setValue(resp.cafirstName);
                this.autofiForm.controls['calastName'].setValue(resp.calastName);
                this.autofiForm.controls['caemail'].setValue(resp.caemail);
                this.autofiForm.controls['caphonenumber'].setValue(resp.caphonenumber);
                this.autofiForm.controls['caaddress'].setValue(resp.caaddress);
                this.autofiForm.controls['caapt'].setValue(resp.caapt);
                this.autofiForm.controls['cacity'].setValue(resp.cacity);
                this.autofiForm.controls['castate'].setValue(resp.castate);
                this.autofiForm.controls['cazipcode'].setValue(resp.cazipcode);
                this.autofiForm.controls['camaterialstatus'].setValue(resp.camaterialstatus);
            }
        });
    }

    coAppCreditInfoFormValuesSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappCreditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.coAppliantssn = resp.cassnitin;
                this.concatecoAppliantssn = 'XXX-XX'.concat(resp.cassnitin?.substring(7, 12));
            }
        });
    }

    coappEmpFormValuesSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                if (this.autofipayload.coapplicant_employestatus === 'other') {
                    this.coapptitle = resp.cathirdTitle;
                }
                else {
                    this.coapptitle = resp.catitle;
                }
            }
        });
    }

    appCreditInfoFormValuesSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.creditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.appliantssn = resp.ssnitin;
            }
        });
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    }

    onBlur(event: FocusEvent, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const value = this.autofiForm.get(controlName)?.value || this.otherincome[controlName];
        input.value = this.formatCurrency(value);
    }

    onInput(event: Event, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const parsedValue = this.parseInputValue(input.value);
        if (controlName === 'payment' || controlName === 'Hourly_Wage') {
            this.autofiForm.patchValue({ [controlName]: parsedValue }, { emitEvent: false });
        } else {
            this.otherincome[controlName] = parsedValue;
        }
    }

    onFocus(event: FocusEvent, controlName: string): void {
        const input = event.target as HTMLInputElement;
        const value = this.autofiForm.get(controlName)?.value || this.otherincome[controlName];
        input.value = value ? value.toString() : '';
    }

    private parseInputValue(value: string): number {
        const numericString = value.replace(/[^\d.]/g, '');
        const result = parseFloat(numericString);
        return isNaN(result) ? 0 : result;
    }

    residenceInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.residenceFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                if (this.autofiForm.controls['payment'] !== undefined) {
                    this.autofiForm.controls['payment']?.setValue(resp?.payment);
                }
                this.autofiForm.controls['slider']?.setValue(resp.slider);
            }
        });
    }

    relationshipInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappRelationshipFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.autofipayload.relationshipAPI
            }
        });
    }

    public coappResidenceInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappResidenceFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.autofiForm.controls['capayment']?.setValue(resp.capayment);
                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
            }
        });
    }

    prevResidenceInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.prevResidenceFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.autofiForm.controls['prevaddress']?.setValue(resp.prevaddress);
                this.autofiForm.controls['prevapt']?.setValue(resp.prevapt);
                this.autofiForm.controls['prevcity']?.setValue(resp.prevcity);
                this.autofiForm.controls['prevstate']?.setValue(resp.prevstate);
                this.autofiForm.controls['prevzipcode']?.setValue(resp.prevzipcode);
                this.prevCity = resp.prevcity;
                this.prevState = resp.prevstate;
                this.prevZipcode = resp.prevzipcode;
                this.prevStreet2 = resp.prevapt
                this.prevStreet = resp.prevaddress;
            }
        });
        if (this.autofipayload.prevEmpResidenceMonth === undefined || this.autofipayload.prevEmpResidenceMonth === '' || this.autofipayload.prevEmpResidenceMonth === null) {
            this.autofipayload.prevEmpResidenceMonth = 1;
        }
        if (this.autofipayload.prevEmpResidenceTotalMonth == undefined) {
            this.autofipayload.prevEmpResidenceTotalMonth = 1;
        }
    }

    empInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let response = JSON.parse(JSON.stringify(resp));
                this.autofiForm.controls['title']?.setValue(response.title);
                this.autofiForm.controls['EName']?.setValue(response.EName);
                this.autofiForm.controls['Ephone']?.setValue(response.Ephone);
                this.autofiForm.controls['slider']?.setValue(response.slider);
                this.autofiForm.controls['empAcceptTerms']?.setValue(response.empAcceptTerms);
                this.employeePhone = response.Ephone;
                this.employerName = response.EName;
                this.empJobTitle = response.title;
            }

        });
        if (this.autofipayload.residenceMonth === undefined || this.autofipayload.residenceMonth === '' || this.autofipayload.residenceMonth === null) {
            this.autofipayload.residenceMonth = 1;
        }
        if (this.autofipayload.residenceTotalMonth == undefined) {
            this.autofipayload.residenceTotalMonth = 1;
        }
    }

    coAppEmpInfoSubscription() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let response = JSON.parse(JSON.stringify(resp));
                this.autofiForm.controls['catitle']?.setValue(response.catitle);
                this.autofiForm.controls['caEName']?.setValue(response.caEName);
                this.autofiForm.controls['caEphone']?.setValue(response.caEphone);
                this.autofiForm.controls['caslider']?.setValue(response.caslider);
                this.autofiForm.controls['CoApplicantempAcceptTerms']?.setValue(response.CoApplicantempAcceptTerms);
            }

        });
        if (this.autofipayload.CoApplicantresidenceMonth === undefined || this.autofipayload.CoApplicantresidenceMonth === '' || this.autofipayload.CoApplicantresidenceMonth === null) {
            this.autofipayload.CoApplicantresidenceMonth = 1;
        }
        if (this.autofipayload.CoApplicantresidenceTotalMonth == undefined) {
            this.autofipayload.CoApplicantresidenceTotalMonth = 1;
        }
    }

    prevEmpInfoSubscription() {
        if (this.autofipayload.empResidenceMonth === undefined || this.autofipayload.empResidenceMonth === '' || this.autofipayload.empResidenceMonth === null) {
            this.autofipayload.empResidenceMonth = 1;
        }
        if (this.autofipayload.empResidenceTotalMonth === undefined) {
            this.autofipayload.empResidenceTotalMonth = 1;
        }
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.prevEmpFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.prevEmpJobTitle = resp.prevEitle;
                this.prevEName = resp.prevEName;
                this.prevEphone = resp.prevEphone
                this.autofiForm.controls['prevEitle'].setValue(resp.prevEitle);
                this.autofiForm.controls['prevEName'].setValue(resp.prevEName);
                this.autofiForm.controls['prevEphone'].setValue(resp.prevEphone);
                this.prevemployerName = resp.prevEName;
                this.prevEtitle = resp.prevEitle;
            }
        });
    }

    leftnavigation(data: any) {
        if (data === 'payment_calc') {
            this.page = 'payment_calc';
            this.is_contactinfo = false;
            this.iscurrentincomet = false;
            this.iscreditinfo = false;
            this.isemployestatus = false;
            this.is_residence = false;
            this.isco_contactinfo = false;
            this.isrelationship = false;
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
        } else if (data === 'contactInfo') {
            this.autofiForm = this.formBuilder.group({
                firstName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        this.atLeastOneAlphabet,
                    ],
                ],
                lastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                        this.atLeastOneAlphabet,
                    ],
                ],
                email: ['', [Validators.required]],
                phonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                address: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                apt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
                state: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator,
                    ],
                ],
                zipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                materialstatus: ['', [Validators.required]],
                coapplicant: ['', [Validators.required]],
            });
            const phoneNumberControl = this.autofiForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.autofiPage = 'primary-identity-and-contact-information';
            this.page = 'contactInfo';
            this.autofiPage = 'primary-identity-and-contact-information';
            this.is_contactinfo = false;
            this.iscurrentincomet = false;
            this.iscreditinfo = false;
            this.isemployestatus = false;
            this.is_residence = false;
            this.isco_contactinfo = false;
            this.isrelationship = false;
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            this.contactInfoSubscription();
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'contact-information');
        } else if (data === 'residence') {
            this.iscurrentincomet = false;
            this.iscreditinfo = false;
            this.isemployestatus = false;
            this.is_residence = false;
            this.isrelationship = false;
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            setTimeout(() => {
                if (
                    this.autofipayload.paymenttype !== undefined &&
                    (this.autofipayload.paymenttype === 'I have a Mortgage' ||
                        this.autofipayload.paymenttype === 'I lease or rent')
                ) {
                    this.autofiForm = this.formBuilder.group({
                        payment: [
                            null,
                            [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
                        ],
                        slider: ['', []]
                    });
                    this.page = 'residence';
                    this.autofiPage = 'primary-residence-information';
                    this.page2fn = 1;
                    this.residenceInfoSubscription();
                } else {
                    this.autofiForm = this.formBuilder.group({
                        slider: ['', []],
                    });
                    this.page = 'residence';
                    this.autofiPage = 'primary-residence-information';
                    this.page2fn = 0;
                    this.residenceInfoSubscription();
                }
            }, 500);
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'residence');
        } else if (data === 'employment') {
            this.iscreditinfo = false;
            this.iscurrentincomet = false;
            this.isemployestatus = false;
            this.isco_contactinfo = false;
            this.isrelationship = false;
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            if (this.autofipayload.empResidenceTotalMonth === undefined) {
                this.autofipayload.empResidenceTotalMonth = 1;
            }
            this.autofiForm = this.formBuilder.group({
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    [Validators.requiredTrue],
                ],
            });
            this.page = 'employment';
            this.autofiPage = 'primary-employment-information';
            if (this.autofipayload.employestatus === 'Employed') {
                this.autofipayload.employeetitle = this.autofipayload.employee_title;
                this.autofiForm = this.formBuilder.group({
                    title: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    EName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    Ephone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('Ephone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.page4fn = 1;
                this.empInfoSubscription();
                this.autofipayload.employeetitle = this.autofipayload.employee_title;
            } else if (this.autofipayload.employestatus === 'self-Employed') {
                this.autofiForm = this.formBuilder.group({
                    BName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 2;
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['BName'].setValue(resp.BName);
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                        this.employerName = resp.BName;
                    }
                });
                this.autofipayload.employeetitle = this.autofipayload.employee_bname;
            } else if (this.autofipayload.employestatus === 'UNEmployed') {
                this.autofiForm = this.formBuilder.group({
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                    }

                });
                this.page4fn = 0;
            } else if (this.autofipayload.employestatus === 'student') {
                this.autofiForm = this.formBuilder.group({
                    Institution: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 4;
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['Institution'].setValue(resp.Institution);
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                        this.institute = resp.Institution
                    }

                });

            } else if (this.autofipayload.employestatus === 'military') {
                this.autofiForm = this.formBuilder.group({
                    secondTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 5;
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['secondTitle'].setValue(resp.secondTitle);
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                        this.militaryJobTitle = resp.secondTitle;
                    }

                });
            } else if (this.autofipayload.employestatus === 'retired') {
                this.autofiForm = this.formBuilder.group({
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 0;
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                    }

                });
            } else if (this.autofipayload.employestatus === 'other') {
                this.autofipayload.employeetitle =
                    this.autofipayload.employee_thirdTitle;
                this.autofiForm = this.formBuilder.group({
                    thirdTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    secondename: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 7;
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['thirdTitle'].setValue(resp.thirdTitle);
                        this.autofiForm.controls['secondename'].setValue(resp.secondename);
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                        this.otherJobTitle = resp.thirdTitle;
                    }

                });
            }
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'employment');
        } else if (data === 'current_income') {
            this.iscreditinfo = false;
            this.iscurrentincomet = false;
            this.isco_contactinfo = false;
            this.isrelationship = false;
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            this.autofiForm = this.formBuilder.group({});
            if (this.showotherpayment == 1) {
                if (this.autofipayload.otherincome === undefined) {
                    this.autofipayload.otherincome = [];
                }
                if (this.autofipayload.employementpayment === 'Hourly') {
                    this.autofiForm = this.formBuilder.group({
                        Hourly_Wage: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                        Hours_per_week: [
                            '',
                            [Validators.required, Validators.pattern('^[0-9 ]*$')],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 1;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Hourly_Wage'].setValue(resp.Hourly_Wage);
                            this.autofiForm.controls['Hours_per_week'].setValue(resp.Hours_per_week);
                        }

                    });

                } else if (this.autofipayload.employementpayment === 'Weekly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 2;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }

                    });
                } else if (this.autofipayload.employementpayment === 'Bi-Weekly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 3;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }

                    });
                } else if (this.autofipayload.employementpayment === 'Twice-a-Month') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 4;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }

                    });
                } else if (this.autofipayload.employementpayment === 'Monthly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 5;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }

                    });
                } else if (this.autofipayload.employementpayment === 'Annual') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 6;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }

                    });
                } else {
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 0;
                }
            } else {
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                setTimeout(() => {
                    if (this.showotherpayment == 1) {
                        if (this.autofipayload.otherincome === undefined) {
                            this.autofipayload.otherincome = [];
                        }
                    } else {
                        if (this.autofipayload.otherincome === undefined) {
                            let otherIncomeData: any = {};
                            otherIncomeData.incomeSource = '';
                            otherIncomeData.financetiers = '';
                            otherIncomeData.grossIncome = '';
                            this.autofipayload.otherincome = [];
                            this.autofipayload.otherincome.push(otherIncomeData);
                        }
                    }
                }, 500);
            }
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'current-income');
        } else if (data === 'credit_info') {
            setTimeout(() => {
                this.iscreditinfo = false;
                this.isco_contactinfo = false;
                this.isrelationship = false;
                this.isco_residence = false;
                this.isco_employestatus = false;
                this.isco_currentincomet = false;
                this.isco_creditinfo = false;
                this.autofiForm = this.formBuilder.group({
                    date: ['', [Validators.required, ageValidator(18, 120), this.checkdob]],
                    ssnitin: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern('^[0-9]*$'),
                            Validators.minLength(9),
                            Validators.maxLength(9),
                        ],
                    ],
                });

                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.creditInfoFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['date'].setValue(resp.date);
                        this.autofiForm.controls['ssnitin'].setValue(resp.ssnitin);
                    }

                });
                this.page = 'credit_info';
                this.autofiPage = 'primary-credit-information';
            }, 500);
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'credit-information');
        } else if (data === 'coapplicant_contactinfo') {
            this.autofiForm = this.formBuilder.group({
                cafirstName: [
                    '',
                    [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")],
                ],
                calastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                    ],
                ],
                caemail: ['', [Validators.required]],
                caphonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                caaddress: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                caapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                cacity: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
                castate: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator,
                    ],
                ],
                cazipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                camaterialstatus: ['', [Validators.required]],
            });
            const phoneNumberControl = this.autofiForm.get('caphonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.page = 'coapplicant_contactinfo';
            this.autofiPage = 'co-applicant-identity-and-contact-information';
            this.isco_contactinfo = false;
            this.isco_residence = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            this.isco_employestatus = false;
            this.isrelationship = false;
            this.coAppcontactInfoSubscription();
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-contact-information');
        } else if (data === 'coapplicant_relationship') {
            setTimeout(() => {
                if (
                    this.autofipayload.relationship !== undefined &&
                    this.autofipayload.relationship === 'Other'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        relationship: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                        ],
                    });
                    this.residence_relationship = 1;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappRelationshipFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['relationship'].setValue(
                                resp.relationship
                            );
                        }
                    });
                    this.page = 'coapplicant_relationship';
                    this.autofiPage = 'co-applicant-relationship-information';
                    this.isco_residence = false;
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.isco_employestatus = false;
                    this.isrelationship = false;
                } else {
                    this.page = 'coapplicant_relationship';
                    this.autofiPage = 'co-applicant-relationship-information';
                    this.isco_residence = false;
                    this.iscurrentincomet = false;
                    this.isco_creditinfo = false;
                    this.isco_employestatus = false;
                    this.residence_relationship = 0;
                }
            }, 500);
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-relationship');
        } else if (data === 'coapplicant_residence') {
            this.isco_residence = false;
            this.isco_employestatus = false;
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            this.is_coresidencepayment = 1;
            this.is_residence = false;
            setTimeout(() => {
                if (
                    this.autofipayload.coapplicantpaymenttype !== undefined &&
                    (this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' ||
                        this.autofipayload.coapplicantpaymenttype === 'I lease or rent')
                ) {
                    this.autofiForm = this.formBuilder.group({
                        capayment: [
                            null,
                            this.autofipayload.coapplicantpaymenttype !== undefined &&
                                (this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' || this.autofipayload.coapplicantpaymenttype === 'I lease or rent') ?
                                [Validators.required, Validators.pattern('^[0-9]*$')] : [],
                        ],
                        slider: ['', []]
                    });
                    this.page = 'coapplicant_residence';
                    this.autofiPage = 'co-applicant-residence-information';
                    this.coappResidenceInfoSubscription();
                } else {
                    this.autofiForm = this.formBuilder.group({
                        caslider: ['', []],
                    });
                    this.page = 'coapplicant_residence';
                    this.autofiPage = 'co-applicant-residence-information';
                    this.isco_employestatus = false;
                    this.isco_currentincomet = false;
                    this.is_coresidencepayment = 0;
                    this.coappResidenceInfoSubscription();
                }
            }, 500);
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-residence');
        } else if (data === 'coapplicant_employment') {
            this.isco_currentincomet = false;
            this.isco_creditinfo = false;
            this.isco_employestatus = false;
            if (this.autofipayload.CoApplicantempResidenceTotalMonth === undefined) {
                this.autofipayload.CoApplicantempResidenceTotalMonth = 1;
            }
            this.autofiForm = this.formBuilder.group({
                CoApplicantempAcceptTerms: [
                    this.autofipayload.CoApplicantempAcceptTerms,
                    [Validators.requiredTrue],
                ],
            });
            this.page = 'coapplicant_employment';
            this.autofiPage = 'co-applicant-employment-information';
            if (this.autofipayload.coapplicant_employestatus === 'Employed') {
                this.autofiForm = this.formBuilder.group({
                    catitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    caEName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    caEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('caEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.coAppEmpInfoSubscription();
            } else if (
                this.autofipayload.coapplicant_employestatus === 'self-Employed'
            ) {
                this.autofiForm = this.formBuilder.group({
                    caBName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['caBName'].setValue(resp.caBName);
                        this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                    this.employerName = resp.caBName;
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
                this.autofiForm = this.formBuilder.group({
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'student') {
                this.autofiForm = this.formBuilder.group({
                    caInstitution: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['caInstitution']?.setValue(resp.caInstitution);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'military') {
                this.autofiForm = this.formBuilder.group({
                    casecondTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['casecondTitle']?.setValue(resp.casecondTitle);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
                this.autofiForm = this.formBuilder.group({
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'other') {
                this.autofiForm = this.formBuilder.group({
                    cathirdTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    casecondename: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['cathirdTitle']?.setValue(resp.cathirdTitle);
                        this.autofiForm.controls['casecondename']?.setValue(resp.casecondename);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                    }
                });
            }
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-employment');
        } else if (data === 'coapplicant_current_income') {
            this.isco_creditinfo = false;
            this.isco_currentincomet = false;
            this.autofiForm = this.formBuilder.group({});
            if (this.autofipayload.CoApplicantgrossMothlyIncome === undefined) {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }

            this.autofipayload.financetiers = 'Monthly';
            this.autofiForm = this.formBuilder.group({});
            if (this.co_showotherpayment === 1) {
                if (this.autofipayload.CoApplicantotherincome === undefined) {
                    this.autofipayload.CoApplicantotherincome = [];
                }
                if (this.autofipayload.CoApplicantemployementpayment === 'Hourly') {
                    this.autofiForm = this.formBuilder.group({
                        caHourly_Wage: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                        caHours_per_week: [
                            '',
                            [Validators.required, Validators.pattern('^[0-9 ]*$')],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caHourly_Wage'].setValue(response.caHourly_Wage);
                            this.autofiForm.controls['caHours_per_week'].setValue(response.caHours_per_week);
                        }
                    });
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Weekly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                        }
                    });
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                        }
                    });
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                        }
                    });
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Monthly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                        }
                    });
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Annual'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                        }
                    });
                } else {
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_currentincomet = false;
                    this.isco_creditinfo = false;
                    this.fn_currentinfo = 0;
                }
            } else {
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';

                this.isco_currentincomet = false;
                this.isco_creditinfo = false;
                setTimeout(() => {
                    if (this.co_showotherpayment === 1) {
                        if (this.autofipayload.CoApplicantotherincome === undefined) {
                            this.autofipayload.CoApplicantotherincome = [];
                        }
                    } else if (this.co_showotherpayment === 0) {
                        if (this.autofipayload.CoApplicantotherincome === undefined) {
                            let otherIncomeData: any = {};
                            otherIncomeData.incomeSource = '';
                            otherIncomeData.financetiers = '';
                            otherIncomeData.grossIncome = '';
                            this.autofipayload.CoApplicantotherincome = [];
                            this.autofipayload.CoApplicantotherincome.push(otherIncomeData);
                        }
                    }
                }, 500);
            }
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-current-income');
        } else if (data === 'coapplicant_credit_info') {
            setTimeout(() => {
                this.isco_creditinfo = false;
                this.autofiForm = this.formBuilder.group({
                    cadate: ['', [
                        Validators.required,
                        ageValidator(18, 120),
                        this.checkdob
                    ]],
                    cassnitin: ['', [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.maxLength(9),
                        Validators.minLength(9)
                    ]]
                }, { validators: checkDuplicateSsn(this.autofiForm.get('ssnitin')?.value, this.autofiForm.get('cassnitin')?.value) });
                this.page = 'coapplicant_credit_info';
                this.autofiPage = 'co-applicant-credit-information';
                this.formValues$ = this.store.pipe(select((state: any) => state?.coappForm?.coappCreditInfoFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['cadate'].setValue(resp.cadate);
                        this.autofiForm.controls['cassnitin'].setValue(resp.cassnitin);
                    }

                });
            }, 500);
            this.adobe_apply_credit_continue(this.currentApplicationStep, 'coapp-credit-information');
        }
    }

    restoreFormState() {
        const savedFormState = this.restService.getFormState('autofiForm');
        if (savedFormState) {
            this.autofiForm.patchValue(savedFormState);
        }
    }

    onInputSSN(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        this.autofiForm.controls['ssnitin'].setValue(input.value); // Update form control value
        this.autofiForm.controls['cassnitin'].setValue(input.value);
    }

    onClear() {
        this.store.dispatch(FormActions.clearFormValues());
    }

    public goBack() {
        if (this.page === 'contactInfo') {
            this.page = 'payment_calc';
            DataHandler.autofiPage = 'autoFi-payment-calculator';
            this.is_contactinfo = false;
            this.is_paymentcalc = false;
        } else if (this.page === 'residence') {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.is_contactinfo = false;
            this.autofiForm = this.formBuilder.group({
                firstName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        this.atLeastOneAlphabet,
                    ],
                ],
                lastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                        this.atLeastOneAlphabet,
                    ],
                ],
                email: ['', [Validators.required]],
                phonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                address: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                apt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
                state: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator,
                    ],
                ],
                zipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                materialstatus: ['', [Validators.required]],
                coapplicant: ['', [Validators.required]],
            });
            const phoneNumberControl = this.autofiForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.page = 'contactInfo';
            this.autofiPage = 'primary-identity-and-contact-information';
            this.is_residence = false;
            this.contactinfo_submitted = false;
            this.contactInfoSubscription();
        } else if (this.page === 'prevaddress') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                if (
                    this.autofipayload.paymenttype !== undefined &&
                    (this.autofipayload.paymenttype === 'I have a Mortgage' ||
                        this.autofipayload.paymenttype === 'I lease or rent')
                ) {
                    this.autofiForm = this.formBuilder.group({
                        payment: [
                            null,
                            [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
                        ],
                        slider: ['', []]
                    });
                    this.page = 'residence';
                    this.autofiPage = 'primary-residence-information';
                    this.page2fn = 1;
                    this.residenceInfoSubscription();
                } else {
                    this.autofiForm = this.formBuilder.group({});
                    this.page = 'residence';
                    this.autofiPage = 'primary-residence-information';
                    this.page2fn = 0;
                }
            }, 500);
        } else if (this.page === 'employment') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                if (this.autofipayload.residenceTotalMonth <= 24) {
                    this.addprevaddress = 1;
                    this.autofiForm = this.formBuilder.group({
                        prevaddress: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        prevapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                        prevcity: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                        ],
                        prevstate: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern('^[a-zA-Z 0-9]*$'),
                                Validators.minLength(2),
                                Validators.maxLength(2),
                                this.stateValidator,
                            ],
                        ],
                        prevzipcode: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern('^[0-9]*$'),
                                Validators.minLength(4),
                                Validators.maxLength(5),
                            ],
                        ],
                    });
                    this.page = 'prevaddress';
                    this.autofiPage = 'primary-identity-and-contact-information';
                    this.is_residence = true;
                    this.prevResidenceInfoSubscription();
                } else {
                    if (
                        this.autofipayload.paymenttype !== undefined &&
                        (this.autofipayload.paymenttype === 'I have a Mortgage' ||
                            this.autofipayload.paymenttype === 'I lease or rent')
                    ) {
                        this.autofiForm = this.formBuilder.group({
                            payment: [
                                null,
                                [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]

                            ],
                            slider: ['', []]
                        });
                        this.page = 'residence';
                        this.autofiPage = 'primary-residence-information';
                        this.page2fn = 1;
                        this.residenceInfoSubscription();
                    } else {
                        this.autofiForm = this.formBuilder.group({
                            slider: ['', []],
                        });
                        this.page = 'residence';
                        this.autofiPage = 'primary-residence-information';
                        this.page2fn = 0;
                    }
                }
                this.isemployestatus = false;
            }, 500);
        } else if (this.page === 'prev_employment') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.empResidenceTotalMonth == undefined) {
                this.autofipayload.empResidenceTotalMonth = 1;
            }
            this.autofiForm = this.formBuilder.group({
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    [Validators.requiredTrue],
                ],
            });
            this.page = 'employment';
            this.autofiPage = 'primary-employment-information';
            if (this.autofipayload.employestatus === 'Employed') {
                this.autofiForm = this.formBuilder.group({
                    title: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                    ],
                    EName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    Ephone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('Ephone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.empInfoSubscription();
            } else if (this.autofipayload.employestatus === 'self-Employed') {
                this.autofiForm = this.formBuilder.group({
                    BName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                    ],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['BName'].setValue(response.BName);
                        this.autofiForm.controls['slider']?.setValue(response.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                        this.employerName = resp.BName;
                    }
                });
            } else if (this.autofipayload.employestatus === 'UNEmployed') {
                this.autofiForm = this.formBuilder.group({
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.page4fn = 0;
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    }

                });
            } else if (this.autofipayload.employestatus === 'student') {
                this.autofiForm = this.formBuilder.group({
                    Institution: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['Institution'].setValue(response.Institution);
                        this.autofiForm.controls['slider']?.setValue(response.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    }

                });
            } else if (this.autofipayload.employestatus === 'military') {
                this.autofiForm = this.formBuilder.group({
                    secondTitle: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['secondTitle'].setValue(response.secondTitle);
                        this.autofiForm.controls['slider']?.setValue(response.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    }

                });
            } else if (this.autofipayload.employestatus === 'retired') {
                this.autofiForm = this.formBuilder.group({
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['slider']?.setValue(resp.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                    }
                });
                this.page4fn = 0;
            } else if (this.autofipayload.employestatus === 'other') {
                this.autofiForm = this.formBuilder.group({
                    thirdTitle: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
                    secondename: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['thirdTitle'].setValue(response.thirdTitle);
                        this.autofiForm.controls['secondename'].setValue(response.secondename);
                        this.autofiForm.controls['slider']?.setValue(response.slider);
                        this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    }

                });
            }
        } else if (this.page === 'current_income') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.empResidenceTotalMonth <= 24) {
                this.addprevemployment = 1;
                this.autofiForm = this.formBuilder.group({
                    prevEitle: ['', [Validators.required]],
                    prevEName: ['', [Validators.required]],
                    prevEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('prevEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.page = 'prev_employment';
                this.autofiPage = 'primary-employment-information';
                this.isemployestatus = true;
                this.iscurrentincomet = false;
                this.current_income_submitted = false;
                if (this.autofipayload.prevEmpResidenceTotalMonth === undefined) {
                    this.autofipayload.prevEmpResidenceTotalMonth = 1;
                }
                this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.prevEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['prevEitle'].setValue(response.prevEitle);
                        this.autofiForm.controls['prevEName'].setValue(response.prevEName);
                        this.autofiForm.controls['prevEphone'].setValue(response.prevEphone);
                        this.prevemployerName = resp.prevEName;
                        this.prevEtitle = resp.prevEitle;
                    }
                });
            } else {
                if (this.autofipayload.empResidenceTotalMonth === undefined) {
                    this.autofipayload.empResidenceTotalMonth = 1;
                }
                this.autofiForm = this.formBuilder.group({
                    empAcceptTerms: [
                        this.autofipayload.empAcceptTerms,
                        [Validators.requiredTrue],
                    ],
                });
                if (this.autofipayload.employestatus === 'Employed') {
                    this.autofiForm = this.formBuilder.group({
                        title: ['', [Validators.required]],
                        EName: ['', [Validators.required]],
                        Ephone: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                                Validators.minLength(14),
                                Validators.maxLength(14),
                                this.forbiddenFirstDigitValidator()
                            ],
                        ],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    const phoneNumberControl = this.autofiForm.get('Ephone');
                    if (phoneNumberControl) {
                        this.formatPhoneNumber(phoneNumberControl);
                    }
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['title'].setValue(response.title);
                            this.autofiForm.controls['EName'].setValue(response.EName);
                            this.autofiForm.controls['Ephone']?.setValue(response.Ephone);
                            this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                            this.employerName = response.EName;
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['title'].setValue(
                                    this.autofipayload.employee_title
                                );
                                this.autofiForm.controls['EName'].setValue(
                                    this.autofipayload.employee_ename
                                );
                                if (this.autofipayload.employee_phone !== '')
                                    this.autofiForm.controls['Ephone'].setValue(
                                        '(' +
                                        this.autofipayload.employee_phone.substring(0, 3) +
                                        ')' +
                                        this.autofipayload.employee_phone.substring(3, 6) +
                                        '-' +
                                        this.autofipayload.employee_phone.substring(6)
                                    );
                            }, 500);
                        }
                        this.page4fn = 1;
                    });

                } else if (this.autofipayload.employestatus === 'self-Employed') {
                    this.autofiForm = this.formBuilder.group({
                        BName: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['BName'].setValue(response.BName);
                            this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                            this.employerName = resp.BName;
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['BName'].setValue(
                                    this.autofipayload.employee_bname
                                );
                            }, 500);
                            this.employerName = this.autofipayload.employee_bname;
                        }
                        this.page4fn = 2;
                    });
                } else if (this.autofipayload.employestatus === 'UNEmployed') {
                    this.autofiForm = this.formBuilder.group({
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.page4fn = 0;
                } else if (this.autofipayload.employestatus === 'student') {
                    this.autofiForm = this.formBuilder.group({
                        Institution: ['', [Validators.required]],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['Institution'].setValue(response.Institution);
                            this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['Institution'].setValue(
                                    this.autofipayload.employee_institute
                                );
                            }, 500);
                        }
                        this.page4fn = 4;
                    });
                } else if (this.autofipayload.employestatus === 'military') {
                    this.autofiForm = this.formBuilder.group({
                        secondTitle: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                        ],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['secondTitle'].setValue(response.secondTitle);
                            this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['secondTitle'].setValue(
                                    this.autofipayload.employee_secondTitle
                                );
                            }, 500);
                        }
                        this.page4fn = 5;
                    });
                } else if (this.autofipayload.employestatus === 'retired') {
                    this.autofiForm = this.formBuilder.group({
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.page4fn = 0;
                } else if (this.autofipayload.employestatus === 'other') {
                    this.autofiForm = this.formBuilder.group({
                        thirdTitle: ['', [Validators.required]],
                        secondename: ['', [Validators.required]],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['thirdTitle'].setValue(response.thirdTitle);
                            this.autofiForm.controls['secondename'].setValue(response.secondename);
                            this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['thirdTitle'].setValue(
                                    this.autofipayload.employee_thirdTitle
                                );
                                this.autofiForm.controls['secondename'].setValue(
                                    this.autofipayload.employee_secondEName
                                );
                            }, 500);
                        }
                        this.page4fn = 7;
                    });
                }
                this.page = 'employment';
                this.autofiPage = 'primary-employment-information';
                this.iscurrentincomet = false;
            }
        } else if (this.page === 'credit_info') {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.iscreditinfo = false;
            this.autofiForm = this.formBuilder.group({});
            if (this.showotherpayment == 1) {
                if (this.autofipayload.otherincome === undefined) {
                    this.autofipayload.otherincome = [];
                }
                if (this.autofipayload.employementpayment === 'Hourly') {
                    this.autofiForm = this.formBuilder.group({
                        Hourly_Wage: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                        Hours_per_week: [
                            '',
                            [Validators.required, Validators.pattern('^[0-9 ]*$')],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 1;
                            this.autofiForm.controls['Hourly_Wage'].setValue(resp.Hourly_Wage);
                            this.autofiForm.controls['Hours_per_week'].setValue(resp.Hours_per_week);
                        }
                    });
                } else if (this.autofipayload.employementpayment === 'Weekly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 2;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }
                    });
                } else if (this.autofipayload.employementpayment === 'Bi-Weekly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 3;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }
                    });
                } else if (this.autofipayload.employementpayment === 'Twice-a-Month') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 4;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }
                    });
                } else if (this.autofipayload.employementpayment === 'Monthly') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 5;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }
                    });
                } else if (this.autofipayload.employementpayment === 'Annual') {
                    this.autofiForm = this.formBuilder.group({
                        Weekly_gross_amount: [
                            null,
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.howYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.page3fn = 6;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(resp.Weekly_gross_amount);
                        }
                    });
                } else {
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.page3fn = 0;
                }
            } else {
                this.page = 'current_income';
                this.autofiPage = 'primary-current-income-information';
                setTimeout(() => {
                    if (this.showotherpayment == 1) {
                        if (this.autofipayload.otherincome === undefined) {
                            this.autofipayload.otherincome = [];
                        }
                    } else {
                        if (this.autofipayload.otherincome == undefined) {
                            let otherIncomeData: any = {};
                            otherIncomeData.incomeSource = '';
                            otherIncomeData.financetiers = '';
                            otherIncomeData.grossIncome = '';
                            this.autofipayload.otherincome = [];
                            this.autofipayload.otherincome.push(otherIncomeData);
                        }
                    }
                }, 500);
            }
        } else if (this.page === 'coapplicant_contactinfo') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                this.autofiForm = this.formBuilder.group({
                    date: ['', [Validators.required, ageValidator(18, 120), this.checkdob]],
                    ssnitin: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern('^[0-9]*$'),
                            Validators.minLength(9),
                            Validators.maxLength(9),
                        ],
                    ],
                });
                this.autofiForm.controls['date'].setValue(this.autofipayload.date);
                const ssnControl = this.autofiForm.get('ssnitin');
                if (ssnControl && ssnControl.value) {
                    this.formatSsnitin(ssnControl);
                }
                this.autofiForm.controls['ssnitin'].setValue(
                    this.autofipayload.ssnitin
                );
                this.page = 'credit_info';
                this.autofiPage = 'primary-credit-information';
                this.iscreditinfo = false;
            }, 500);
        } else if (this.page === 'coapplicant_relationship') {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.autofiForm = this.formBuilder.group({
                cafirstName: [
                    '',
                    [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")],
                ],
                calastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                    ],
                ],
                caemail: ['', [Validators.required]],
                caphonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                caaddress: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                caapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                cacity: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
                castate: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator,
                    ],
                ],
                cazipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                camaterialstatus: ['', [Validators.required]],
            });
            const phoneNumberControl = this.autofiForm.get('caphonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.page = 'coapplicant_contactinfo';
            this.autofiPage = 'co-applicant-identity-and-contact-information';
            this.isrelationship = false;
            setTimeout(() => {
                this.autofiForm.controls['cafirstName'].setValue(
                    this.autofipayload.CoApplicantfirstname
                );
                this.autofiForm.controls['calastName'].setValue(
                    this.autofipayload.CoApplicantlastname
                );
                this.autofiForm.controls['caemail'].setValue(
                    this.autofipayload.CoApplicantemail
                );
                this.autofiForm.controls['cazipcode'].setValue(
                    this.autofipayload.CoApplicantzipcode
                );
                this.autofiForm.controls['caaddress'].setValue(
                    this.autofipayload.CoApplicantaddress
                );
                this.autofiForm.controls['caapt'].setValue(
                    this.autofipayload.CoApplicantapt
                );
                this.autofiForm.controls['cacity'].setValue(
                    this.autofipayload.CoApplicantcity
                );
                this.autofiForm.controls['castate'].setValue(
                    this.autofipayload.CoApplicantstate
                );
                this.autofiForm.controls['camaterialstatus'].setValue(
                    this.autofipayload.CoApplicantamaterial_status
                );
                if (
                    this.autofipayload.CoApplicantphone !== undefined &&
                    this.autofipayload.CoApplicantphone !== ''
                )
                    this.autofiForm.controls['caphonenumber'].setValue(
                        '(' +
                        this.autofipayload.CoApplicantphone.substring(0, 3) +
                        ')' +
                        this.autofipayload.CoApplicantphone.substring(3, 6) +
                        '-' +
                        this.autofipayload.CoApplicantphone.substring(6)
                    );
            }, 500);
        } else if (this.page === 'coapplicant_residence') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                if (
                    this.autofipayload.relationship !== undefined &&
                    this.autofipayload.relationship === 'Other'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        relationship: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                        ],
                    });
                    this.residence_relationship = 1;
                    this.autofiForm.controls['relationship'].setValue(
                        this.autofipayload.CoApplicantrelationship
                    );
                    this.page = 'coapplicant_relationship';
                    this.autofiPage = 'co-applicant-relationship-information';
                    this.isco_residence = false;
                } else {
                    this.page = 'coapplicant_relationship';
                    this.autofiPage = 'co-applicant-relationship-information';
                    this.isco_residence = false;
                    this.residence_relationship = 0;
                }
            }, 500);
        } else if (this.page === 'coapplicant_employment') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                if (this.autofipayload.CoApplicantresidenceTotalMonth <= 24) {
                    this.addcoprevaddress = 1;
                    this.autofiForm = this.formBuilder.group({
                        caprevaddress: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        caprevapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                        caprevcity: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                        ],
                        caprevstate: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern('^[a-zA-Z ]*$'),
                                Validators.minLength(2),
                                Validators.maxLength(2),
                                this.stateValidator,
                            ],
                        ],
                        caprevzipcode: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern('^[0-9]*$'),
                                Validators.minLength(4),
                                Validators.maxLength(5),
                            ],
                        ],
                    });
                    this.page = 'coapplicantprevaddress';
                    this.autofiPage = 'co-applicant-residence-information';
                    setTimeout(() => {
                        this.autofiForm.controls['caprevaddress'].setValue(
                            this.autofipayload.CoApplicantprevaddress
                        );
                        this.autofiForm.controls['caprevapt'].setValue(
                            this.autofipayload.CoApplicantprevapt
                        );
                        this.autofiForm.controls['caprevcity'].setValue(
                            this.autofipayload.CoApplicantprevcity
                        );
                        this.autofiForm.controls['caprevstate'].setValue(
                            this.autofipayload.CoApplicantprevstate
                        );
                        this.autofiForm.controls['caprevzipcode'].setValue(
                            this.autofipayload.CoApplicantprevzipcode
                        );
                    }, 500);
                } else {
                    if (
                        this.autofipayload.coapplicantpaymenttype !== undefined &&
                        (this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' ||
                            this.autofipayload.coapplicantpaymenttype === 'I lease or rent')
                    ) {
                        this.autofiForm = this.formBuilder.group({
                            capayment: [
                                '',
                                [Validators.required, Validators.pattern('^[0-9]*$')],
                            ],
                        });
                        this.page = 'coapplicant_residence';
                        this.autofiPage = 'co-applicant-residence-information';
                        this.isco_employestatus = false;
                        this.is_coresidencepayment = 1;
                        this.coappResidenceInfoSubscription();
                    } else {
                        this.autofiForm = this.formBuilder.group({});
                        this.page = 'coapplicant_residence';
                        this.autofiPage = 'co-applicant-residence-information';

                        this.isco_employestatus = false;
                        this.is_coresidencepayment = 0;
                    }
                }
            }, 500);
        } else if (this.page === 'coapplicant_current_income') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.CoApplicantempResidenceTotalMonth <= 24) {
                if (
                    this.autofipayload.CoApplicantprevEmpResidenceTotalMonth === undefined
                ) {
                    this.autofipayload.CoApplicantprevEmpResidenceTotalMonth = 1;
                }

                this.addcoprevemployment = 1;
                this.autofiForm = this.formBuilder.group({
                    caprevEitle: ['', [Validators.required]],
                    caprevEName: ['', [Validators.required]],
                    caprevEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('caprevEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappPrevEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caprevEitle'].setValue(response.caprevEitle);
                        this.autofiForm.controls['caprevEName'].setValue(response.caprevEName);
                        this.autofiForm.controls['caprevEphone'].setValue(response.caprevEphone);
                        this.coApplicantprevemployerName = resp.caprevEName;
                        this.coApplicantprevEtitle = resp.caprevEitle;
                    }
                });
                this.page = 'Coapplicantprev_employment';
                this.autofiPage = 'co-applicant-employment-information';
            } else {
                if (this.autofipayload.CoApplicantempResidenceTotalMonth === undefined) {
                    this.autofipayload.CoApplicantempResidenceTotalMonth = 1;
                }
                this.autofiForm = this.formBuilder.group({
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        [Validators.requiredTrue],
                    ],
                });
                this.page = 'coapplicant_employment';
                this.autofiPage = 'co-applicant-employment-information';
                this.isco_currentincomet = false;
                if (this.autofipayload.coapplicant_employestatus === 'Employed') {
                    this.autofiForm = this.formBuilder.group({
                        catitle: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                        ],
                        caEName: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        caEphone: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                                Validators.minLength(14),
                                Validators.maxLength(14),
                                this.forbiddenFirstDigitValidator()
                            ],
                        ],
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    const phoneNumberControl = this.autofiForm.get('caEphone');
                    if (phoneNumberControl) {
                        this.formatPhoneNumber(phoneNumberControl);
                    }
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['catitle'].setValue(response.catitle);
                            this.autofiForm.controls['caEName'].setValue(response.caEName);
                            this.autofiForm.controls['caEphone'].setValue(response.caEphone);
                            this.coApplicantemployerName = resp.caEName;
                            this.coApplicantEtitle = resp.catitle;
                        }
                    });
                } else if (
                    this.autofipayload.coapplicant_employestatus === 'self-Employed'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caBName: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caBName'].setValue(response.caBName);
                            this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                            this.coApplicantemployerName = resp.caBName;
                        }
                    });
                } else if (
                    this.autofipayload.coapplicant_employestatus === 'UNEmployed'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                } else if (this.autofipayload.coapplicant_employestatus === 'student') {
                    this.autofiForm = this.formBuilder.group({
                        caInstitution: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                        ],
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caInstitution'].setValue(response.caInstitution);
                            this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                            this.coApplicantemployerName = resp.caInstitution;
                        }
                    });
                } else if (this.autofipayload.coapplicant_employestatus === 'military') {
                    this.autofiForm = this.formBuilder.group({
                        casecondTitle: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                        ],
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['casecondTitle'].setValue(response.casecondTitle);
                            this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                            this.coApplicantemployerName = resp.casecondTitle;
                        }
                    });
                } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
                    this.autofiForm = this.formBuilder.group({
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                } else if (this.autofipayload.coapplicant_employestatus === 'other') {
                    this.autofiForm = this.formBuilder.group({
                        cathirdTitle: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                        ],
                        casecondename: [
                            '',
                            [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                        ],
                        CoApplicantempAcceptTerms: [
                            this.autofipayload.CoApplicantempAcceptTerms,
                            Validators.requiredTrue,
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['cathirdTitle'].setValue(response.cathirdTitle);
                            this.autofiForm.controls['casecondename'].setValue(response.casecondename);
                            this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                            this.coApplicantemployerName = resp.casecondename;
                        }
                    });
                }
            }
        } else if (this.page === 'review_application') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.coapplicant === 'yes' && this.contactinfo_submitted) {
                setTimeout(() => {
                    this.autofiForm = this.formBuilder.group({
                        cadate: ['', [
                            Validators.required,
                            ageValidator(18, 120),
                            this.checkdob
                        ]],
                        cassnitin: ['', [
                            Validators.required,
                            Validators.pattern('^[0-9]*$'),
                            Validators.maxLength(9),
                            Validators.minLength(9)
                        ]]
                    }, { validators: checkDuplicateSsn(this.autofiForm.get('ssnitin')?.value, this.autofiForm.get('cassnitin')?.value) });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappCreditInfoFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['cassnitin'].setValue(resp.cassnitin);
                            this.autofiForm.controls['cadate'].setValue(resp.cadate);
                        }
                    });
                    this.page = 'coapplicant_credit_info';
                    this.isco_creditinfo = false;
                    this.autofiPage = 'co-applicant-credit-information';
                }, 500);
            } else if (this.autofipayload.iscoapplicant === 'no') {
                setTimeout(() => {
                    this.autofiForm = this.formBuilder.group({
                        date: ['', [Validators.required, ageValidator(18, 120), this.checkdob]],
                        ssnitin: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern('^[0-9]*$'),
                                Validators.minLength(9),
                                Validators.maxLength(9),
                            ],
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.creditInfoFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            const ssnControl = this.autofiForm.get('ssnitin');
                            if (ssnControl && ssnControl.value) {
                                this.formatSsnitin(ssnControl);
                            }
                            this.autofiForm.controls['ssnitin'].setValue(resp.ssnitin);
                            this.autofiForm.controls['date'].setValue(resp.date);
                        }
                    });
                    this.page = 'credit_info';
                    this.iscreditinfo = false;
                    this.autofiPage = 'co-applicant-credit-information';
                }, 500);
            }
        } else if (this.page === 'coapplicantprevaddress') {
            this.viewportScroller.scrollToPosition([0, 0]);
            setTimeout(() => {
                if (
                    this.autofipayload.coapplicantpaymenttype !== undefined &&
                    (this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' ||
                        this.autofipayload.coapplicantpaymenttype === 'I lease or rent')
                ) {
                    this.autofiForm = this.formBuilder.group({
                        capayment: [
                            '',
                            [Validators.required, Validators.pattern('^[0-9]*$')],
                        ],
                    });
                    this.page = 'coapplicant_residence';
                    this.autofiPage = 'co-applicant-residence-information';
                    this.is_coresidencepayment = 1;
                    this.coappResidenceInfoSubscription();
                } else {
                    this.autofiForm = this.formBuilder.group({});
                    this.page = 'coapplicant_residence';
                    this.autofiPage = 'co-applicant-residence-information';
                    this.is_coresidencepayment = 0;
                }
            }, 500);
        } else if (this.page === 'Coapplicantprev_employment') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.CoApplicantempResidenceTotalMonth === undefined) {
                this.autofipayload.CoApplicantempResidenceTotalMonth = 1;
            }
            this.autofiForm = this.formBuilder.group({
                CoApplicantempAcceptTerms: [
                    this.autofipayload.CoApplicantempAcceptTerms,
                    [Validators.requiredTrue],
                ],
            });
            this.page = 'coapplicant_employment';
            this.autofiPage = 'co-applicant-employment-information';
            if (this.autofipayload.coapplicant_employestatus === 'Employed') {
                this.autofiForm = this.formBuilder.group({
                    catitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                    ],
                    caEName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    caEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('caEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['catitle'].setValue(response.catitle);
                        this.autofiForm.controls['caEName'].setValue(response.caEName);
                        this.autofiForm.controls['caEphone'].setValue(response.caEphone);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                        this.coApplicantemployerName = resp.caEName;
                    }
                });
            } else if (
                this.autofipayload.coapplicant_employestatus === 'self-Employed'
            ) {
                this.autofiForm = this.formBuilder.group({
                    caBName: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caBName'].setValue(response.caBName);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                        this.coApplicantemployerName = resp.caBName;
                    }
                });
                this.employerName = this.autofipayload.CoApplicantemployee_bname;
            } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
                this.autofiForm = this.formBuilder.group({
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'student') {
                this.autofiForm = this.formBuilder.group({
                    caInstitution: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['caInstitution'].setValue(response.caInstitution);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                        this.coApplicantemployerName = resp.caInstitution;
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'military') {
                this.autofiForm = this.formBuilder.group({
                    casecondTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['casecondTitle'].setValue(response.casecondTitle);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                        this.coApplicantemployerName = resp.casecondTitle;
                    }
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
                this.autofiForm = this.formBuilder.group({
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
            } else if (this.autofipayload.coapplicant_employestatus === 'other') {
                this.autofiForm = this.formBuilder.group({
                    cathirdTitle: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                    ],
                    casecondename: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                    ],
                    CoApplicantempAcceptTerms: [
                        this.autofipayload.CoApplicantempAcceptTerms,
                        Validators.requiredTrue,
                    ],
                });
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        let response = JSON.parse(JSON.stringify(resp));
                        this.autofiForm.controls['cathirdTitle'].setValue(response.cathirdTitle);
                        this.autofiForm.controls['casecondename'].setValue(response.casecondename);
                        this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                        this.coApplicantemployerName = resp.casecondename;
                    }
                });
            }
        } else if (this.page === 'coapplicant_credit_info') {
            this.viewportScroller.scrollToPosition([0, 0]);
            if (this.autofipayload.CoApplicantgrossMothlyIncome === undefined) {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }
            this.autofiForm = this.formBuilder.group({});
            if (this.co_showotherpayment === 1) {
                if (this.autofipayload.CoApplicantotherincome === undefined) {
                    this.autofipayload.CoApplicantotherincome = [];
                }
                if (this.autofipayload.CoApplicantemployementpayment === 'Hourly') {
                    this.autofiForm = this.formBuilder.group({
                        caHourly_Wage: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                        caHours_per_week: [
                            '',
                            [Validators.required, Validators.pattern('^[0-9 ]*$')],
                        ],
                    });
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caHourly_Wage'].setValue(response.caHourly_Wage);
                            this.autofiForm.controls['caHours_per_week'].setValue(response.caHours_per_week);
                        }
                    });
                    this.fn_currentinfo = 1;
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Weekly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                            this.autofipayload.CoApplicantWeekly_gross_amount = response.caWeekly_gross_amount
                        }
                    });
                    this.fn_currentinfo = 2;
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                            this.autofipayload.CoApplicantWeekly_gross_amount = response.caWeekly_gross_amount
                        }
                    });
                    this.fn_currentinfo = 3;
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                            this.autofipayload.CoApplicantWeekly_gross_amount = response.caWeekly_gross_amount
                        }
                    });
                    this.fn_currentinfo = 4;
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Monthly'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                            this.autofipayload.CoApplicantWeekly_gross_amount = response.caWeekly_gross_amount
                        }
                    });
                    this.fn_currentinfo = 5;
                } else if (
                    this.autofipayload.CoApplicantemployementpayment === 'Annual'
                ) {
                    this.autofiForm = this.formBuilder.group({
                        caWeekly_gross_amount: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                            ],
                        ],
                    });
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappHowYouPaidFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            let response = JSON.parse(JSON.stringify(resp));
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(response.caWeekly_gross_amount);
                            this.autofipayload.CoApplicantWeekly_gross_amount = response.caWeekly_gross_amount
                        }
                    });
                    this.fn_currentinfo = 6;
                } else {
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.fn_currentinfo = 0;
                }
            } else {
                this.page = 'coapplicant_current_income';
                this.autofiPage = 'co-applicant-current-income-information';
                setTimeout(() => {
                    if (this.showotherpayment === 1) {
                        if (this.autofipayload.CoApplicantotherincome === undefined) {
                            this.autofipayload.CoApplicantotherincome = [];
                        }
                    } else {
                        if (this.autofipayload.CoApplicantotherincome === undefined) {
                            let otherIncomeData: any = {};
                            otherIncomeData.incomeSource = '';
                            otherIncomeData.financetiers = '';
                            otherIncomeData.grossIncome = '';
                            this.autofipayload.CoApplicantotherincome = [];
                            this.autofipayload.CoApplicantotherincome.push(otherIncomeData);
                        }
                    }
                }, 500);
            }
        } else if (this.page === 'summary') {
            this.viewportScroller.scrollToPosition([0, 0]);
            this.page = 'review_application';
            this.autofiPage = 'review-summary-information';
            this.adobe_apply_credit_step_completed('review-application');
            //this.adobe_apply_credit_continue('review-application', 'application-summary');
        }
    }

    public prevAddrForm() {
        this.payment_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display('residence type is required');
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);

        if (this.autofiForm.valid) {
            if (
                this.autofipayload.paymenttype === 'I have a Mortgage' ||
                this.autofipayload.paymenttype === 'I lease or rent'
            ) {

                this.autofipayload.payment =
                    this.autofiForm.controls['payment']?.value;
                if (this.autofiForm.controls['slider']?.value === undefined || this.autofiForm.controls['slider']?.value === '') {
                    this.autofiForm.controls['slider']?.setValue(this.autofipayload.residenceTotalMonth);
                }

            } else {
                this.autofipayload.payment =
                    this.autofiForm.controls['payment']?.value;
                if (this.autofiForm.controls['slider']?.value === undefined || this.autofiForm.controls['slider']?.value === '') {
                    this.autofiForm.controls['slider']?.setValue(this.autofipayload.residenceTotalMonth);
                }
            }
            const formValues = this.autofiForm.getRawValue();
            this.store.dispatch(FormActions.saveResidenceInfoFormValues({ residenceFormValues: formValues }));
            this.adobe_apply_credit_step_completed('residence');
            //this.adobe_apply_credit_continue('residence', 'employment');

            if (this.autofipayload.paymenttype === undefined) {
                this.autofipayload.paymenttypeerror = 0;
            }
            if (this.autofipayload.paymenttype !== undefined) {
                this.autofipayload.paymenttypeerror = 1;
                if (this.autofipayload.residenceTotalMonth <= 24) {
                    this.page = 'prevaddress';
                    this.addprevaddress = 1;
                    this.autofiForm = this.formBuilder.group({
                        prevaddress: [
                            '',
                            [Validators.required, Validators.pattern(/^[a-zA-Z 0-9 ]*$/)],
                        ],
                        prevapt: ['', [Validators.pattern(/^[a-zA-Z 0-9 ]*$/)]],
                        prevcity: [
                            '',
                            [Validators.required, Validators.pattern(/^[a-zA-Z 0-9]*$/)],
                        ],
                        prevstate: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^[a-zA-Z 0-9]*$/),
                                Validators.minLength(2),
                                Validators.maxLength(2),
                                this.stateValidator,
                            ],
                        ],
                        prevzipcode: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^[0-9]*$/),
                                Validators.minLength(4),
                                Validators.maxLength(5),
                            ],
                        ],
                    });
                    this.autofiPage = 'primary-identity-and-contact-information';
                    this.is_residence = true;

                    this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.prevResidenceFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['prevaddress'].setValue(resp.prevaddress);
                            this.autofiForm.controls['prevapt'].setValue(resp.prevapt);
                            this.autofiForm.controls['prevcity'].setValue(resp.prevcity);
                            this.autofiForm.controls['prevstate'].setValue(resp.prevstate);
                            this.autofiForm.controls['prevzipcode'].setValue(resp.prevzipcode);
                        } else {
                            setTimeout(() => {
                                this.autofiForm.controls['prevaddress']?.setValue(
                                    this.autofipayload.prevaddress
                                );
                                this.autofiForm.controls['prevapt']?.setValue(
                                    this.autofipayload.prevapt
                                );
                                this.autofiForm.controls['prevcity']?.setValue(
                                    this.autofipayload.prevcity
                                );
                                this.autofiForm.controls['prevstate']?.setValue(
                                    this.autofipayload.prevstate
                                );
                                this.autofiForm.controls['prevzipcode']?.setValue(
                                    this.autofipayload.prevzipcode
                                );
                            }, 500);
                        }
                    });

                } else {
                    this.page = 'employment';
                    this.page2fn = 1;
                    if (this.autofipayload.empResidenceTotalMonth === undefined) {
                        this.autofipayload.empResidenceTotalMonth = 1;
                    }
                    this.autofiForm = this.formBuilder.group({
                        slider: ['', []],
                        empAcceptTerms: [
                            this.autofipayload.empAcceptTerms,
                            [Validators.requiredTrue],
                        ]
                    });
                    this.autofiPage = 'primary-employment-information';
                    this.is_residence = true;
                    if (this.autofipayload.employestatus === 'Employed') {
                        this.autofiForm = this.formBuilder.group({
                            title: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            EName: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            Ephone: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                                    Validators.minLength(14),
                                    Validators.maxLength(14),
                                    this.forbiddenFirstDigitValidator()
                                ],
                            ],
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        const phoneNumberControl = this.autofiForm.get('caEphone');
                        if (phoneNumberControl) {
                            this.formatPhoneNumber(phoneNumberControl);
                        }
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                let response = JSON.parse(JSON.stringify(resp));
                                this.autofiForm.controls['title'].setValue(response.title);
                                this.autofiForm.controls['EName'].setValue(response.EName);
                                this.autofiForm.controls['Ephone'].setValue(response.Ephone);
                                this.autofiForm.controls['slider']?.setValue(response.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                                this.employerName = response.EName;
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['title'].setValue(
                                        this.autofipayload.employee_title
                                    );
                                    this.autofiForm.controls['EName'].setValue(
                                        this.autofipayload.employee_ename
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.residenceTotalMonth
                                    );
                                    if (this.autofipayload.employee_phone != '')
                                        this.autofiForm.controls['Ephone'].setValue(
                                            '(' +
                                            this.autofipayload.employee_phone.substring(0, 3) +
                                            ')' +
                                            this.autofipayload.employee_phone.substring(3, 6) +
                                            '-' +
                                            this.autofipayload.employee_phone.substring(6)
                                        );
                                }, 500);
                            }
                        });

                        this.page4fn = 1;
                    } else if (this.autofipayload.employestatus === 'self-Employed') {
                        this.autofiForm = this.formBuilder.group({
                            BName: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['BName'].setValue(resp.BName);
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                                this.employerName = resp.BName;
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.residenceTotalMonth
                                    );
                                    this.autofiForm.controls['BName'].setValue(
                                        this.autofipayload.employee_bname
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.empResidenceTotalMonth
                                    );
                                }, 500);
                                this.employerName = this.autofipayload.employee_bname;
                            }

                        });
                        this.page4fn = 2;
                    } else if (this.autofipayload.employestatus === 'UNEmployed') {
                        this.autofiForm = this.formBuilder.group({
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                            }

                        });
                        this.page4fn = 0;
                    } else if (this.autofipayload.employestatus === 'student') {
                        this.autofiForm = this.formBuilder.group({
                            Institution: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['Institution'].setValue(resp.Institution);
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['Institution'].setValue(
                                        this.autofipayload.employee_institute
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.empResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });

                        this.page4fn = 4;
                    } else if (this.autofipayload.employestatus === 'military') {
                        this.autofiForm = this.formBuilder.group({
                            secondTitle: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['secondTitle'].setValue(resp.secondTitle);
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['secondTitle'].setValue(
                                        this.autofipayload.employee_secondTitle
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.empResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });

                        this.page4fn = 5;
                    } else if (this.autofipayload.employestatus === 'retired') {
                        this.autofiForm = this.formBuilder.group({
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.empResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });

                        this.page4fn = 0;
                    } else if (this.autofipayload.employestatus === 'other') {
                        this.autofiForm = this.formBuilder.group({
                            thirdTitle: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                            ],
                            secondename: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                            ],
                            slider: ['', []],
                            empAcceptTerms: [
                                this.autofipayload.empAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['thirdTitle'].setValue(resp.thirdTitle);
                                this.autofiForm.controls['secondename'].setValue(resp.secondename);
                                this.autofiForm.controls['slider']?.setValue(resp.slider);
                                this.autofiForm.controls['empAcceptTerms'].setValue(resp.empAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.page4fn = 7;
                                    this.autofiForm.controls['thirdTitle'].setValue(
                                        this.autofipayload.employee_thirdTitle
                                    );
                                    this.autofiForm.controls['secondename'].setValue(
                                        this.autofipayload.employee_secondEName
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.empResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });

                    }
                }
            }

        }
    }

    public coAppPrevAddrForm() {
        this.ca_payment_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display('residence type is required');
            this.ca_payment_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        if (this.autofiForm.valid) {
            if (
                this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' ||
                this.autofipayload.coapplicantpaymenttype === 'I lease or rent'
            ) {
                this.autofipayload.CoApplicantpayment = this.autofiForm.controls['capayment']?.value;
                if (this.autofiForm.controls['caslider']?.value === undefined || this.autofiForm.controls['caslider']?.value === '') {
                    this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantresidenceTotalMonth);
                }

            }
            else {
                if (this.autofiForm.controls['caslider']?.value === undefined || this.autofiForm.controls['caslider']?.value === '') {
                    this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantresidenceTotalMonth);
                } else if (this.autofiForm.controls['caslider']?.value === 1) {
                    this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantresidenceTotalMonth);
                }
            }
            const formValues = this.autofiForm.getRawValue();
            this.store.dispatch(CoappFormActions.saveCoappResidenceInfoFormValues({ coappResidenceFormValues: formValues }));
            this.adobe_apply_credit_step_completed('coapp-residence');
            //this.adobe_apply_credit_continue('coapp-residence', 'coapp-employment');

            if (this.autofipayload.coapplicantpaymenttype === undefined) {
                this.autofipayload.paymenttypeerror = 0;
            }
            if (this.autofipayload.coapplicantpaymenttype !== undefined) {
                if (this.autofipayload.CoApplicantresidenceTotalMonth <= 24) {
                    this.addcoprevaddress = 1;
                    this.autofiForm = this.formBuilder.group({
                        caprevaddress: [
                            '',
                            [Validators.required, Validators.pattern(/^[a-zA-Z 0-9 ]*$/)],
                        ],
                        caprevapt: ['', [Validators.pattern(/^[a-zA-Z 0-9 ]*$/)]],
                        caprevcity: [
                            '',
                            [Validators.required, Validators.pattern(/^[a-zA-Z 0-9]*$/)],
                        ],
                        caprevstate: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^[a-zA-Z 0-9]*$/),
                                Validators.minLength(2),
                                Validators.maxLength(2),
                                this.stateValidator,
                            ],
                        ],
                        caprevzipcode: [
                            '',
                            [
                                Validators.required,
                                Validators.pattern(/^[0-9]*$/),
                                Validators.minLength(4),
                                Validators.maxLength(5),
                            ],
                        ],
                    });
                    this.page = 'coapplicantprevaddress';
                    this.autofiPage = 'co-applicant-residence-information';

                    this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappPrevResidenceFormValues));
                    this.formValues$.subscribe((resp) => {
                        if (resp !== null && resp !== undefined) {
                            this.autofiForm.controls['caprevaddress'].setValue(resp.caprevaddress);
                            this.autofiForm.controls['caprevapt'].setValue(resp.caprevapt);
                            this.autofiForm.controls['caprevcity'].setValue(resp.caprevcity);
                            this.autofiForm.controls['caprevstate'].setValue(resp.caprevstate);
                            this.autofiForm.controls['caprevzipcode'].setValue(resp.caprevzipcode);
                            this.autofipayload.CoApplicantprevaddress = resp.caprevaddress;
                            this.autofipayload.CoApplicantprevapt = resp.caprevapt;
                            this.autofipayload.CoApplicantprevcity = resp.caprevcity;
                            this.autofipayload.CoApplicantprevstate = resp.caprevstate;
                            this.autofipayload.CoApplicantprevzipcode = resp.caprevzipcode;
                        }
                    });
                    setTimeout(() => {
                        this.autofiForm.controls['caprevaddress']?.setValue(
                            this.autofipayload.CoApplicantprevaddress
                        );
                        this.autofiForm.controls['caprevapt']?.setValue(
                            this.autofipayload.CoApplicantprevapt
                        );
                        this.autofiForm.controls['caprevcity']?.setValue(
                            this.autofipayload.CoApplicantprevcity
                        );
                        this.autofiForm.controls['caprevstate']?.setValue(
                            this.autofipayload.CoApplicantprevstate
                        );
                        this.autofiForm.controls['caprevzipcode']?.setValue(
                            this.autofipayload.CoApplicantprevzipcode
                        );
                    }, 500);
                } else {
                    if (
                        this.autofipayload.CoApplicantempResidenceTotalMonth === undefined
                    ) {
                        this.autofipayload.CoApplicantempResidenceTotalMonth = 1;
                    }
                    this.autofiForm = this.formBuilder.group({
                        CoApplicantempAcceptTerms: [false, [Validators.requiredTrue]],
                    });
                    this.page = 'coapplicant_employment';
                    this.autofiPage = 'co-applicant-employment-information';
                    this.isco_residence = true;
                    if (this.autofipayload.coapplicant_employestatus === 'Employed') {
                        this.autofiForm = this.formBuilder.group({
                            catitle: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            caEName: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            caEphone: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                                    Validators.minLength(14),
                                    Validators.maxLength(14),
                                    this.forbiddenFirstDigitValidator()
                                ],
                            ],
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        const phoneNumberControl = this.autofiForm.get('caEphone');
                        if (phoneNumberControl) {
                            this.formatPhoneNumber(phoneNumberControl);
                        }
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                let response = JSON.parse(JSON.stringify(resp));
                                this.autofiForm.controls['catitle'].setValue(response.catitle);
                                this.autofiForm.controls['caEName'].setValue(response.caEName);
                                this.autofiForm.controls['caEphone'].setValue(response.caEphone);
                                this.autofiForm.controls['caslider']?.setValue(response.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                            }

                        });
                        setTimeout(() => {
                            this.autofiForm.controls['catitle'].setValue(
                                this.autofipayload.CoApplicantemployee_title
                            );
                            this.autofiForm.controls['caEName'].setValue(
                                this.autofipayload.CoApplicantemployee_ename
                            );
                            this.autofiForm.controls['caslider'].setValue(
                                this.autofipayload.residenceTotalMonth
                            );
                            if (this.autofipayload.CoApplicantemployee_phone !== '')
                                this.autofiForm.controls['caEphone'].setValue(
                                    '(' +
                                    this.autofipayload.CoApplicantemployee_phone.substring(0, 3) +
                                    ')' +
                                    this.autofipayload.CoApplicantemployee_phone.substring(3, 6) +
                                    '-' +
                                    this.autofipayload.CoApplicantemployee_phone.substring(6)
                                );
                        }, 500);
                    } else if (this.autofipayload.coapplicant_employestatus === 'self-Employed') {
                        this.autofiForm = this.formBuilder.group({
                            caBName: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['caBName'].setValue(resp.caBName);
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                                this.employerName = resp.caBName;
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['caslider'].setValue(
                                        this.autofipayload.CoApplicantempResidenceTotalMonth
                                    );
                                    this.autofiForm.controls['caBName'].setValue(
                                        this.autofipayload.CoApplicantemployee_bname
                                    );
                                }, 500);
                                this.employerName = this.autofipayload.CoApplicantemployee_bname;
                            }

                        });

                    } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
                        this.autofiForm = this.formBuilder.group({
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                            }

                        });
                    } else if (this.autofipayload.coapplicant_employestatus === 'student') {
                        this.autofiForm = this.formBuilder.group({
                            caInstitution: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['caInstitution'].setValue(resp.caInstitution);
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['caInstitution'].setValue(
                                        this.autofipayload.CoApplicantemployee_institute
                                    );
                                    this.autofiForm.controls['slider'].setValue(
                                        this.autofipayload.CoApplicantempResidenceTotalMonth
                                    );
                                }, 500);
                            }

                        });

                    } else if (this.autofipayload.coapplicant_employestatus === 'military') {
                        this.autofiForm = this.formBuilder.group({
                            casecondTitle: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                            ],
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['casecondTitle'].setValue(resp.casecondTitle);
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['casecondTitle'].setValue(
                                        this.autofipayload.CoApplicantemployee_secondTitle
                                    );
                                    this.autofiForm.controls['caslider'].setValue(
                                        this.autofipayload.CoApplicantempResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });

                    } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
                        this.autofiForm = this.formBuilder.group({
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                            }

                        });
                    } else if (this.autofipayload.coapplicant_employestatus === 'other') {
                        this.autofiForm = this.formBuilder.group({
                            cathirdTitle: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                            ],
                            casecondename: [
                                '',
                                [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                            ],
                            caslider: ['', []],
                            CoApplicantempAcceptTerms: [
                                this.autofipayload.CoApplicantempAcceptTerms,
                                Validators.requiredTrue,
                            ],
                        });
                        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null && resp !== undefined) {
                                this.autofiForm.controls['cathirdTitle'].setValue(resp.cathirdTitle);
                                this.autofiForm.controls['casecondename'].setValue(resp.casecondename);
                                this.autofiForm.controls['caslider']?.setValue(resp.caslider);
                                this.autofiForm.controls['CoApplicantempAcceptTerms'].setValue(resp.CoApplicantempAcceptTerms);
                            } else {
                                setTimeout(() => {
                                    this.autofiForm.controls['cathirdTitle'].setValue(
                                        this.autofipayload.CoApplicantemployee_thirdTitle
                                    );
                                    this.autofiForm.controls['casecondename'].setValue(
                                        this.autofipayload.CoApplicantemployee_secondEName
                                    );
                                    this.autofiForm.controls['caslider'].setValue(
                                        this.autofipayload.CoApplicantempResidenceTotalMonth
                                    );
                                }, 500);
                            }
                        });
                    }
                }
            }
        }
    }

    public employmentForm() {
        this.previousaddress_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.previousaddress_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();

        this.store.dispatch(FormActions.savePrevresidenceInfoFormValues({ prevResidenceFormValues: formValues }));
        this.page = 'employment';
        if (this.autofipayload.empResidenceTotalMonth === undefined) {
            this.autofipayload.empResidenceTotalMonth = 1;
        }
        this.autofiForm = this.formBuilder.group({
            empAcceptTerms: [
                this.autofipayload.empAcceptTerms,
                [Validators.requiredTrue],
            ],
        });
        this.page = 'employment';
        this.autofiPage = 'primary-employment-information';
        this.is_residence = true;
        if (this.autofipayload.employestatus === 'Employed') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                title: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                EName: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                Ephone: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            const phoneNumberControl = this.autofiForm.get('Ephone');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['title'].setValue(response.title);
                    this.autofiForm.controls['EName'].setValue(response.EName);
                    this.autofiForm.controls['Ephone'].setValue(response.Ephone);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    this.employerName = response.EName;
                } else {
                    setTimeout(() => {
                        this.page4fn = 1;
                        this.autofiForm.controls['title'].setValue(
                            this.autofipayload.employee_title
                        );
                        this.autofiForm.controls['EName'].setValue(
                            this.autofipayload.employee_ename
                        );
                        this.autofiForm.controls['slider'].setValue(
                            this.autofipayload.residenceTotalMonth
                        );
                        if (this.autofipayload.employee_phone != '')
                            this.autofiForm.controls['Ephone'].setValue(
                                '(' +
                                this.autofipayload.employee_phone.substring(0, 3) +
                                ')' +
                                this.autofipayload.employee_phone.substring(3, 6) +
                                '-' +
                                this.autofipayload.employee_phone.substring(6)
                            );
                    }, 500);
                }
            });
            this.autofipayload.occupation = this.autofipayload.employee_title;
            this.autofipayload.employer = this.autofipayload.employee_ename;
            this.autofipayload.employerHTML = this.autofipayload.employee_ename;
            this.autofipayload.occupationHTML = this.autofipayload.employee_title;

        } else if (this.autofipayload.employestatus === 'self-Employed') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                BName: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['BName'].setValue(response.BName);
                    this.autofiForm.controls['slider']?.setValue(response.slider);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                    this.employerName = resp.BName;
                } else {
                    setTimeout(() => {
                        this.page4fn = 2;
                        this.autofiForm.controls['BName'].setValue(
                            this.autofipayload.employee_bname
                        );
                        this.autofiForm.controls['slider'].setValue(
                            this.autofipayload.residenceTotalMonth
                        );
                    }, 500);
                    this.employerName = this.autofipayload.employee_bname;
                }
            });
            this.autofipayload.employee_bname = this.autofiForm.controls['BName'].value;
            this.autofipayload.occupation = 'self-Employed';
            this.autofipayload.employer = this.autofipayload.employee_bname;

            this.autofipayload.employerHTML = this.autofipayload.employee_bname;
            this.autofipayload.occupationHTML = 'Self Employed';

        } else if (this.autofipayload.employestatus === 'UNEmployed') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.autofipayload.occupation = 'Unemployed';
            this.autofipayload.employer = 'string';

            this.autofipayload.employerHTML = 'Unemployed';
            this.autofipayload.occupationHTML = 'Unemployed';
        } else if (this.autofipayload.employestatus === 'student') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                Institution: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['Institution'].setValue(response.Institution);
                    this.autofiForm.controls['slider']?.setValue(response.slider);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.page4fn = 4;
                        this.autofiForm.controls['Institution'].setValue(
                            this.autofipayload.employee_institute
                        );
                        this.autofiForm.controls['slider'].setValue(
                            this.autofipayload.empResidenceTotalMonth
                        );
                    }, 500);
                }
            });
            this.autofipayload.employee_institute = this.autofiForm.controls['Institution'].value;
            this.autofipayload.occupation = 'Student';
            this.autofipayload.employer = this.autofipayload.employee_institute;

            this.autofipayload.employerHTML = this.autofipayload.employee_institute;
            this.autofipayload.occupationHTML = 'Student';
        } else if (this.autofipayload.employestatus === 'military') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                secondTitle: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['secondTitle'].setValue(response.secondTitle);
                    this.autofiForm.controls['slider']?.setValue(response.slider);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.page4fn = 5;
                        this.autofiForm.controls['secondTitle'].setValue(
                            this.autofipayload.employee_secondTitle
                        );
                        this.autofiForm.controls['slider'].setValue(
                            this.autofipayload.residenceTotalMonth
                        );
                    }, 500);
                }
            });
            this.autofipayload.employee_secondTitle = this.autofiForm.controls['secondTitle'].value;
            this.autofipayload.occupation = 'Military';
            this.autofipayload.employer = this.autofipayload.employee_secondTitle;

            this.autofipayload.employerHTML = 'Military';
            this.autofipayload.occupationHTML = this.autofipayload.employee_secondTitle;
        } else if (this.autofipayload.employestatus === 'retired') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.autofipayload.occupation = 'Retired';
            this.autofipayload.employer = 'string';
            this.autofipayload.employerHTML = 'Retired';
            this.autofipayload.occupationHTML = 'Retired';
        } else if (this.autofipayload.employestatus === 'other') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                thirdTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                ],
                secondename: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.empFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['thirdTitle'].setValue(response.thirdTitle);
                    this.autofiForm.controls['secondename'].setValue(response.secondename);
                    this.autofiForm.controls['slider']?.setValue(response.slider);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.empAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.page4fn = 7;
                        this.autofiForm.controls['thirdTitle'].setValue(
                            this.autofipayload.employee_thirdTitle
                        );
                        this.autofiForm.controls['secondename'].setValue(
                            this.autofipayload.employee_secondEName
                        );
                        this.autofiForm.controls['slider'].setValue(
                            this.autofipayload.residenceTotalMonth
                        );
                        this.autofiForm.controls['empAcceptTerms'].setValue(
                            this.autofipayload.empAcceptTerms
                        );
                    }, 500);
                }
            });
            this.autofipayload.employee_thirdTitle = this.autofiForm.controls['thirdTitle'].value;
            this.autofipayload.employee_secondEName = this.autofiForm.controls['secondename'].value;
            this.autofipayload.occupation = this.autofipayload.employee_thirdTitle;
            this.autofipayload.employer = this.autofipayload.employee_secondEName;

            this.autofipayload.employerHTML = this.autofipayload.employee_secondEName;
            this.autofipayload.occupationHTML = this.autofipayload.employee_thirdTitle;
        }
    }

    public coApplicantEmploymentForm() {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.isco_residence = true;
        this.ca_previousaddress_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_previousaddress_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(CoappFormActions.saveCoappPrevresidenceInfoFormValues({ coappPrevResidenceFormValues: formValues }));
        this.page = 'coapplicant_employment';
        if (this.autofipayload.CoApplicantempResidenceTotalMonth === undefined) {
            this.autofipayload.CoApplicantempResidenceTotalMonth = 1;
        }
        this.autofiForm = this.formBuilder.group({
            CoApplicantempAcceptTerms: [
                this.autofipayload.CoApplicantempAcceptTerms,
                [Validators.requiredTrue],
            ],
        });
        this.autofiPage = 'coapplicant-employment-information';
        this.is_residence = true;
        if (this.autofipayload.coapplicant_employestatus === 'Employed') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                catitle: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                caEName: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                caEphone: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                CoApplicantempAcceptTerms: [
                    this.autofipayload.CoApplicantempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            const phoneNumberControl = this.autofiForm.get('caEphone');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['title'].setValue(response.catitle);
                    this.autofiForm.controls['EName'].setValue(response.caEName);
                    this.autofiForm.controls['Ephone'].setValue(response.caEphone);
                    this.autofiForm.controls['empAcceptTerms'].setValue(response.CoApplicantempAcceptTerms);
                    this.employerName = response.caEName;
                } else {
                    setTimeout(() => {
                        this.page4fn = 1;
                        this.autofiForm.controls['catitle'].setValue(
                            this.autofipayload.CoApplicantemployee_title
                        );
                        this.autofiForm.controls['caEName'].setValue(
                            this.autofipayload.CoApplicantemployee_ename
                        );
                        this.autofiForm.controls['caslider'].setValue(
                            this.autofipayload.residenceTotalMonth
                        );
                        if (this.autofipayload.CoApplicantemployee_phone != '')
                            this.autofiForm.controls['caEphone'].setValue(
                                '(' +
                                this.autofipayload.CoApplicantemployee_phone.substring(0, 3) +
                                ')' +
                                this.autofipayload.CoApplicantemployee_phone.substring(3, 6) +
                                '-' +
                                this.autofipayload.CoApplicantemployee_phone.substring(6)
                            );
                    }, 500);
                }
            });
            this.autofipayload.CoApplicantoccupation = this.autofipayload.CoApplicantemployee_title;
            this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_ename;
            this.autofipayload.CoApplicantemployerHTML = this.autofipayload.CoApplicantemployee_ename;
            //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_title;
            this.autofipayload.CoApplicantoccupationHTML = 'Employed';
            this.isco_residence = true;

        } else if (this.autofipayload.coapplicant_employestatus === 'self-Employed') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                caBName: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['caBName'].setValue(response.caBName);
                    this.autofiForm.controls['caslider']?.setValue(response.caslider);
                    this.autofiForm.controls['caempAcceptTerms'].setValue(response.caempAcceptTerms);
                    this.employerName = resp.caBName;
                } else {
                    setTimeout(() => {
                        this.page4fn = 2;
                        this.autofiForm.controls['caBName'].setValue(
                            this.autofipayload.CoApplicantBName
                        );
                        this.autofiForm.controls['caslider'].setValue(
                            this.autofipayload.CoApplicantresidenceTotalMonth
                        );
                    }, 500);
                    this.employerName = this.autofipayload.CoApplicantBName;
                }
            });
            this.autofipayload.CoApplicantemployee_bname = this.autofiForm.controls['caBName'].value;
            this.autofipayload.CoApplicantoccupation = 'self-Employed';
            this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_bname;

            this.autofipayload.CoApplicantemployerHTML = this.autofipayload.CoApplicantemployee_bname;
            this.autofipayload.CoApplicantoccupationHTML = 'Self Employed';

        } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.caempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.autofipayload.CoApplicantoccupation = 'Unemployed';
            this.autofipayload.CoApplicantemployer = 'string';

            this.autofipayload.CoApplicantemployerHTML = 'Unemployed';
            this.autofipayload.CoApplicantoccupationHTML = 'Unemployed';
        } else if (this.autofipayload.coapplicant_employestatus === 'student') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                caInstitution: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.caempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['caInstitution'].setValue(response.caInstitution);
                    this.autofiForm.controls['caslider']?.setValue(response.caslider);
                    this.autofiForm.controls['caempAcceptTerms'].setValue(response.caempAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.page4fn = 4;
                        this.autofiForm.controls['caInstitution'].setValue(
                            this.autofipayload.CoApplicantemployee_institute
                        );
                        this.autofiForm.controls['caslider'].setValue(
                            this.autofipayload.CoApplicantresidenceTotalMonth
                        );
                    }, 500);
                }
            });
            this.autofipayload.CoApplicantemployee_institute = this.autofiForm.controls['caInstitution'].value;
            this.autofipayload.CoApplicantoccupation = 'Student';
            this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_institute;

            this.autofipayload.CoApplicantemployee_instituteemployerHTML = this.autofipayload.CoApplicantemployee_institute;
            this.autofipayload.CoApplicantemployee_instituteoccupationHTML = 'Student';
        } else if (this.autofipayload.coapplicant_employestatus === 'military') {
            this.showotherpayment = 1;
            this.autofiForm = this.formBuilder.group({
                casecondTitle: [
                    '',
                    [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)],
                ],
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.caempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['casecondTitle'].setValue(response.casecondTitle);
                    this.autofiForm.controls['caslider']?.setValue(response.caslider);
                    this.autofiForm.controls['caempAcceptTerms'].setValue(response.caempAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.page4fn = 5;
                        this.autofiForm.controls['casecondTitle'].setValue(
                            this.autofipayload.CoApplicantemployee_secondTitle
                        );
                        this.autofiForm.controls['caslider'].setValue(
                            this.autofipayload.CoApplicantresidenceTotalMonth
                        );
                    }, 500);
                }
            });
            this.autofipayload.CoApplicantemployee_secondTitle = this.autofiForm.controls['casecondTitle'].value;
            this.autofipayload.CoApplicantoccupation = 'Military';
            this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_secondTitle;

            this.autofipayload.CoApplicantemployerHTML = 'Military';
            //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_secondTitle;
            this.autofipayload.CoApplicantoccupationHTML = 'Military';
        } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.caempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.autofipayload.CoApplicantoccupation = 'Retired';
            this.autofipayload.CoApplicantemployer = 'string';
            this.autofipayload.CoApplicantemployerHTML = 'Retired';
            this.autofipayload.CoApplicantoccupationHTML = 'Retired';
        } else if (this.autofipayload.coapplicant_employestatus === 'other') {
            this.showotherpayment = 0;
            this.autofiForm = this.formBuilder.group({
                cathirdTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                ],
                casecondename: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                ],
                caslider: ['', []],
                caempAcceptTerms: [
                    this.autofipayload.caempAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappEmpFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['cathirdTitle'].setValue(response.cathirdTitle);
                    this.autofiForm.controls['casecondename'].setValue(response.casecondename);
                    this.autofiForm.controls['caslider']?.setValue(response.caslider);
                    this.autofiForm.controls['caempAcceptTerms'].setValue(response.caempAcceptTerms);
                } else {
                    setTimeout(() => {
                        this.autofiForm.controls['cathirdTitle'].setValue(
                            this.autofipayload.CoApplicantemployee_thirdTitle
                        );
                        this.autofiForm.controls['casecondename'].setValue(
                            this.autofipayload.CoApplicantemployee_secondEName
                        );
                        this.autofiForm.controls['caslider'].setValue(
                            this.autofipayload.CoApplicantresidenceTotalMonth
                        );
                        this.autofiForm.controls['caempAcceptTerms'].setValue(
                            this.autofipayload.caempAcceptTerms
                        );
                    }, 500);
                }
            });
            this.autofipayload.CoApplicantemployee_thirdTitle = this.autofiForm.controls['thirdTitle'].value;
            this.autofipayload.CoApplicantemployee_secondEName = this.autofiForm.controls['secondename'].value;
            this.autofipayload.CoApplicantoccupation = this.autofipayload.employee_thirdTitle;
            this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_secondEName;

            this.autofipayload.CoApplicantemployerHTML = this.autofipayload.CoApplicantemployee_secondEName;
            //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_thirdTitle;
            this.autofipayload.CoApplicantoccupationHTML = 'Other';
        }
    }

    public isEmptyObject(obj: Record<string, any>): boolean {
        if (Object.keys(obj).length === 0) {
            return true;
        }
        for (const key in obj) {
            if (obj[key] !== undefined) {
                return false;
            }
        }
        return true;
    }


    public prevEmploymentForm() {
        this.employestatus_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.employestatus_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        if (this.autofiForm.controls['slider']?.value === undefined || this.autofiForm.controls['slider']?.value === '') {
            this.autofiForm.controls['slider']?.setValue(this.autofipayload.residenceTotalMonth);
        }
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(FormActions.saveEmpInfoFormValues({ empFormValues: formValues }));
        this.adobe_apply_credit_step_completed('employment');
        //this.adobe_apply_credit_continue('employment', 'current-income');

        if (this.autofipayload.employestatus !== undefined) {
            if (this.autofipayload.employestatus === 'Employed') {
                this.showotherpayment = 1;
                this.autofipayload.employee_title =
                    this.autofiForm.controls['title'].value;
                this.autofipayload.employee_ename =
                    this.autofiForm.controls['EName'].value;
                this.autofipayload.employee_phone = this.autofiForm.controls[
                    'Ephone'
                ].value
                    .replace('(', '')
                    .replace(')', '')
                    .replace('-', '');
                this.autofipayload.occupation = this.autofipayload.employee_title;
                this.autofipayload.employer = this.autofipayload.employee_ename;

                this.autofipayload.employerHTML = this.autofipayload.employee_ename;
                this.autofipayload.occupationHTML =
                    this.autofipayload.employee_title;
            } else if (this.autofipayload.employestatus === 'self-Employed') {
                this.showotherpayment = 1;
                this.autofipayload.employee_bname =
                    this.autofiForm.controls['BName'].value;
                this.autofipayload.occupation = 'self-Employed';
                this.autofipayload.employer = this.autofipayload.employee_bname;
                this.employerName = this.autofipayload.employee_bname

                this.autofipayload.employerHTML = this.autofipayload.employee_bname;
                this.autofipayload.occupationHTML = 'Self Employed';
            } else if (this.autofipayload.employestatus === 'UNEmployed') {
                this.showotherpayment = 0;
                this.autofipayload.occupation = 'Unemployed';
                this.autofipayload.employer = 'string';

                this.autofipayload.employerHTML = 'Unemployed';
                this.autofipayload.occupationHTML = 'Unemployed';
            } else if (this.autofipayload.employestatus === 'student') {
                this.showotherpayment = 0;
                this.autofipayload.employee_institute =
                    this.autofiForm.controls['Institution'].value;
                this.autofipayload.occupation = 'Student';
                this.autofipayload.employer = this.autofipayload.employee_institute;
                this.employerName = this.autofiForm.controls['Institution'].value;
                this.autofipayload.employerHTML =
                    this.autofipayload.employee_institute;
                this.autofipayload.occupationHTML = 'Student';
            } else if (this.autofipayload.employestatus === 'military') {
                this.showotherpayment = 1;
                this.autofipayload.employee_secondTitle =
                    this.autofiForm.controls['secondTitle'].value;
                this.autofipayload.occupation = 'Military';
                this.autofipayload.employer =
                    this.autofipayload.employee_secondTitle;
                this.employerName = this.autofipayload.employee_secondTitle;
                this.autofipayload.employerHTML = 'Military';
                this.autofipayload.occupationHTML =
                    this.autofipayload.employee_secondTitle;
            } else if (this.autofipayload.employestatus === 'retired') {
                this.showotherpayment = 0;
                this.autofipayload.occupation = 'Retired';
                this.autofipayload.employer = 'string';
                this.autofipayload.employerHTML = 'Retired';
                this.autofipayload.occupationHTML = 'Retired';
            } else if (this.autofipayload.employestatus === 'other') {
                this.showotherpayment = 0;
                this.autofipayload.employee_thirdTitle =
                    this.autofiForm.controls['thirdTitle'].value;
                this.autofipayload.employee_secondEName =
                    this.autofiForm.controls['secondename'].value;
                this.autofipayload.occupation =
                    this.autofipayload.employee_thirdTitle;
                this.autofipayload.employer =
                    this.autofipayload.employee_secondEName;
                this.employerName = this.autofipayload.employee_secondEName;

                this.autofipayload.employerHTML =
                    this.autofipayload.employee_secondEName;
                this.autofipayload.occupationHTML =
                    this.autofipayload.employee_thirdTitle;
            }
            if (this.autofipayload.empResidenceTotalMonth <= 24) {
                this.addprevemployment = 1;
                this.autofiForm = this.formBuilder.group({
                    prevEitle: ['', [Validators.required]],
                    prevEName: ['', [Validators.required]],
                    prevEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('prevEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.page = 'prev_employment';
                this.autofiPage = 'primary-employment-information';
                this.isemployestatus = true;
                this.prevEmpInfoSubscription();
            } else {
                if (this.autofipayload.grossMothlyIncome === undefined) {
                    this.autofipayload.grossMothlyIncome = 0;
                }
                this.autofipayload.financetiers = 'Monthly';
                this.autofiForm = this.formBuilder.group({});
                if (this.showotherpayment === 1) {
                    if (this.autofipayload.otherincome === undefined) {
                        this.autofipayload.otherincome = [];
                    }
                    if (this.autofipayload.employementpayment === 'Hourly') {
                        this.autofiForm = this.formBuilder.group({
                            Hourly_Wage: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                            Hours_per_week: [
                                '',
                                [Validators.required, Validators.pattern('^[0-9 ]*$')],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 1;
                            this.autofiForm.controls['Hourly_Wage'].setValue(
                                this.autofipayload.Hourly_Wage
                            );
                            this.autofiForm.controls['Hours_per_week'].setValue(
                                this.autofipayload.Hours_per_week
                            );
                        }, 500);
                    } else if (this.autofipayload.employementpayment === 'Weekly') {
                        this.autofiForm = this.formBuilder.group({
                            Weekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 2;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.employementpayment === 'Bi-Weekly') {
                        this.autofiForm = this.formBuilder.group({
                            Weekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 3;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.employementpayment === 'Twice-a-Month') {
                        this.autofiForm = this.formBuilder.group({
                            Weekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 4;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.employementpayment === 'Monthly') {
                        this.autofiForm = this.formBuilder.group({
                            Weekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 5;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.employementpayment === 'Annual') {
                        this.autofiForm = this.formBuilder.group({
                            Weekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        setTimeout(() => {
                            this.page3fn = 6;
                            this.autofiForm.controls['Weekly_gross_amount'].setValue(
                                this.autofipayload.Weekly_gross_amount
                            );
                        }, 500);
                    } else {
                        this.page = 'current_income';
                        this.autofiPage = 'primary-current-income-information';
                        this.page3fn = 0;
                    }
                    this.isemployestatus = true;
                } else if (this.showotherpayment === 0) {
                    this.page = 'current_income';
                    this.autofiPage = 'primary-current-income-information';
                    this.isemployestatus = true;
                    if (
                        this.autofipayload.otherincome === undefined ||
                        this.autofipayload.otherincome.length === 0
                    ) {
                        let otherIncomeData: any = {};
                        otherIncomeData.incomeSource = '';
                        otherIncomeData.financetiers = '';
                        otherIncomeData.grossIncome = '';
                        this.autofipayload.otherincome = [];
                        this.autofipayload.otherincome.push(otherIncomeData);
                    }
                }
            }
        }
    }

    public coAppPrevEmploymentForm() {
        this.ca_employestatus_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_employestatus_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        if (
            this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' ||
            this.autofipayload.coapplicantpaymenttype === 'I lease or rent'
        ) {
            this.autofipayload.CoApplicantpayment = this.autofiForm.controls['capayment']?.value;
            if (this.autofiForm.controls['caslider']?.value === undefined || this.autofiForm.controls['caslider']?.value === '') {
                this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantempResidenceTotalMonth);
            }

        }
        else {
            if (this.autofiForm.controls['caslider']?.value === undefined || this.autofiForm.controls['caslider']?.value === '') {
                this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantempResidenceTotalMonth);
            } else if (this.autofiForm.controls['caslider']?.value === 1) {
                this.autofiForm.controls['caslider']?.setValue(this.autofipayload.CoApplicantempResidenceTotalMonth);
            }
        }
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(CoappFormActions.saveCoappEmpInfoFormValues({ coappEmpFormValues: formValues }));
        this.adobe_apply_credit_step_completed('coapp-employment');
        //this.adobe_apply_credit_continue('coapp-employment', 'coapp-current-income');

        if (this.autofipayload.coapplicant_employestatus !== undefined) {
            if (this.autofipayload.coapplicant_employestatus === 'Employed') {
                this.co_showotherpayment = 1;
                this.autofipayload.CoApplicantemployee_title =
                    this.autofiForm.controls['catitle'].value;
                this.autofipayload.CoApplicantemployee_ename =
                    this.autofiForm.controls['caEName'].value;
                this.autofipayload.CoApplicantemployee_phone = this.autofiForm.controls[
                    'caEphone'
                ].value
                    .replace('(', '')
                    .replace(')', '')
                    .replace('-', '');
                this.autofipayload.CoApplicantoccupation = this.autofipayload.CoApplicantemployee_title;
                this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_ename;

                this.autofipayload.employerHTML = this.autofipayload.employee_ename;
                //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_title;
                this.autofipayload.CoApplicantoccupationHTML = 'Employed'
            } else if (this.autofipayload.coapplicant_employestatus === 'self-Employed') {
                this.co_showotherpayment = 1;
                this.autofipayload.CoApplicantBName =
                    this.autofiForm.controls['caBName'].value;
                this.autofipayload.CoApplicantoccupation = 'self-Employed';
                this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantBName;

                this.autofipayload.CoApplicantemployerHTML = this.autofipayload.CoApplicantBName;
                this.autofipayload.CoApplicantoccupationHTML = 'Self Employed';
            } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
                this.co_showotherpayment = 0;
                this.autofipayload.CoApplicantoccupation = 'Unemployed';
                this.autofipayload.CoApplicantemployer = 'UNEmployed';

                this.autofipayload.CoApplicantemployerHTML = 'Unemployed';
                this.autofipayload.CoApplicantoccupationHTML = 'Unemployed';
            } else if (this.autofipayload.coapplicant_employestatus === 'student') {
                this.co_showotherpayment = 0;
                this.autofipayload.CoApplicantemployee_institute =
                    this.autofiForm.controls['caInstitution'].value;
                this.autofipayload.CoApplicantoccupation = 'Student';
                this.autofipayload.CoApplicantemployer = this.autofipayload.CoApplicantemployee_institute;

                this.autofipayload.CoApplicantemployerHTML =
                    this.autofipayload.CoApplicantemployee_institute;
                this.autofipayload.CoApplicantoccupationHTML = 'Student';
            } else if (this.autofipayload.coapplicant_employestatus === 'military') {
                this.co_showotherpayment = 1;
                this.autofipayload.CoApplicantemployee_secondTitle =
                    this.autofiForm.controls['casecondTitle'].value;
                this.autofipayload.CoApplicantoccupation = 'Military';
                this.autofipayload.CoApplicantemployer =
                    this.autofipayload.CoApplicantemployee_secondTitle;

                this.autofipayload.CoApplicantemployerHTML = 'Military';
                //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_secondTitle;
                this.autofipayload.CoApplicantoccupationHTML = 'Military';
            } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
                this.co_showotherpayment = 0;
                this.autofipayload.CoApplicantoccupation = 'Retired';
                this.autofipayload.CoApplicantemployer = 'Retired';
                this.autofipayload.CoApplicantemployerHTML = 'Retired';
                this.autofipayload.CoApplicantoccupationHTML = 'Retired';
            } else if (this.autofipayload.coapplicant_employestatus === 'other') {
                this.co_showotherpayment = 0;
                this.autofipayload.CoApplicantemployee_thirdTitle =
                    this.autofiForm.controls['cathirdTitle'].value;
                this.autofipayload.CoApplicantemployee_secondEName =
                    this.autofiForm.controls['casecondename'].value;
                this.autofipayload.CoApplicantoccupation =
                    this.autofipayload.CoApplicantemployee_thirdTitle;
                this.autofipayload.CoApplicantemployer =
                    this.autofipayload.CoApplicantemployee_secondEName;

                this.autofipayload.CoApplicantemployerHTML =
                    this.autofipayload.CoApplicantemployee_secondEName;
                //this.autofipayload.CoApplicantoccupationHTML = this.autofipayload.CoApplicantemployee_thirdTitle;
                this.autofipayload.CoApplicantoccupationHTML = 'Other'
            }
            if (this.autofipayload.CoApplicantempResidenceTotalMonth <= 24) {
                if (
                    this.autofipayload.CoApplicantprevEmpResidenceTotalMonth === undefined
                ) {
                    this.autofipayload.CoApplicantprevEmpResidenceTotalMonth = 1;
                }
                this.addcoprevemployment = 1;
                this.autofiForm = this.formBuilder.group({
                    caprevEitle: ['', [Validators.required]],
                    caprevEName: ['', [Validators.required]],
                    caprevEphone: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                });
                const phoneNumberControl = this.autofiForm.get('caprevEphone');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }
                this.page = 'Coapplicantprev_employment';
                this.autofiPage = 'co-applicant-employment-information';
                this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappPrevEmpFormValues));
                this.formValues$.subscribe((resp) => {
                    if (resp !== null && resp !== undefined) {
                        this.autofiForm.controls['caprevEitle'].setValue(resp.caprevEitle);
                        this.autofiForm.controls['caprevEName'].setValue(resp.caprevEName);
                        this.autofiForm.controls['caprevEphone'].setValue(resp.caprevEphone);
                    } else {
                        setTimeout(() => {
                            if (this.autofipayload.CoApplicantprevEmpResidenceTotalMonth === undefined) {
                                this.autofipayload.CoApplicantprevEmpResidenceTotalMonth = 1;
                            }
                            this.autofiForm.controls['caprevEitle']?.setValue(
                                this.autofipayload.CoApplicantprevEitle
                            );
                            this.autofiForm.controls['caprevEName']?.setValue(
                                this.autofipayload.CoApplicantprevEName
                            );
                            if (
                                this.autofipayload.CoApplicantprevEphone !== '' &&
                                this.autofipayload.CoApplicantprevEphone !== undefined
                            ) {
                                this.autofiForm.controls['caprevEphone'].setValue(
                                    '(' +
                                    this.autofipayload.CoApplicantprevEphone?.substring(0, 3) +
                                    ')' +
                                    this.autofipayload.CoApplicantprevEphone?.substring(3, 6) +
                                    '-' +
                                    this.autofipayload.CoApplicantprevEphone?.substring(6)
                                );
                            }
                        }, 500);
                    }
                });
            } else {
                if (this.autofipayload.CoApplicantgrossMothlyIncome === undefined) {
                    this.autofipayload.CoApplicantgrossMothlyIncome = 0;
                }
                this.autofipayload.financetiers = 'Monthly';
                this.autofiForm = this.formBuilder.group({});
                if (this.co_showotherpayment == 1) {
                    if (this.autofipayload.CoApplicantotherincome === undefined) {
                        this.autofipayload.CoApplicantotherincome = [];
                    }
                    this.isco_employestatus = true;
                    if (this.autofipayload.CoApplicantemployementpayment === 'Hourly') {
                        this.autofiForm = this.formBuilder.group({
                            caHourly_Wage: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                            caHours_per_week: [
                                '',
                                [Validators.required, Validators.pattern('^[0-9 ]*$')],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caHourly_Wage'].setValue(
                                this.autofipayload.CoApplicantHourly_Wage
                            );
                            this.autofiForm.controls['caHours_per_week'].setValue(
                                this.autofipayload.CoApplicantHours_per_week
                            );
                        }, 500);
                    } else if (this.autofipayload.CoApplicantemployementpayment === 'Weekly') {
                        this.autofiForm = this.formBuilder.group({
                            caWeekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                                this.autofipayload.CoApplicantWeekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly') {
                        this.autofiForm = this.formBuilder.group({
                            caWeekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                                this.autofipayload.CoApplicantWeekly_gross_amount
                            );
                        }, 500);
                    } else if (
                        this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
                    ) {
                        this.autofiForm = this.formBuilder.group({
                            caWeekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                                this.autofipayload.CoApplicantWeekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.CoApplicantemployementpayment === 'Monthly') {
                        this.autofiForm = this.formBuilder.group({
                            caWeekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                                this.autofipayload.CoApplicantWeekly_gross_amount
                            );
                        }, 500);
                    } else if (this.autofipayload.CoApplicantemployementpayment === 'Annual') {
                        this.autofiForm = this.formBuilder.group({
                            caWeekly_gross_amount: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/),
                                ],
                            ],
                        });
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        setTimeout(() => {
                            this.autofiForm.controls['caWeekly_gross_amount'].setValue(
                                this.autofipayload.CoApplicantWeekly_gross_amount
                            );
                        }, 500);
                    } else {
                        this.page = 'coapplicant_current_income';
                        this.autofiPage = 'co-applicant-current-income-information';
                        this.fn_currentinfo = 0;
                    }
                } else if (this.co_showotherpayment === 0) {
                    this.page = 'coapplicant_current_income';
                    this.autofiPage = 'co-applicant-current-income-information';
                    this.isco_employestatus = true;
                    if (
                        this.autofipayload.CoApplicantotherincome === undefined ||
                        this.autofipayload.CoApplicantotherincome.length === 0
                    ) {
                        let otherIncomeData: any = {};
                        otherIncomeData.incomeSource = '';
                        otherIncomeData.financetiers = '';
                        otherIncomeData.grossIncome = '';
                        this.autofipayload.CoApplicantotherincome = [];
                        this.autofipayload.CoApplicantotherincome.push(otherIncomeData);
                    } else {
                        this.autofipayload.CoApplicantotherincome.push(this.autofipayload.CoApplicantotherincome);
                    }
                }
            }
        }
    }


    public creditInfoForm() {
        this.employe_payment_submitted = true;
        this.current_income_submitted = true;
        this.isCurrentIncomeValid = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.current_income_submitted = true;
            this.employe_payment_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        for (let i = 0; i < this.autofipayload.otherincome.length; i++) {
            if (
                this.autofipayload.otherincome[i].incomeSource === '' ||
                this.autofipayload.otherincome[i].grossIncome === '' ||
                Number(this.autofipayload.otherincome[i].grossIncome) === 0
            ) {
                this.isCurrentIncomeValid = false;
            }
        }

        if (this.isCurrentIncomeValid == false) {
            return;
        }

        if (this.isCurrentIncomeValid) {
            if (
                this.autofipayload.employestatus === 'Employed' ||
                this.autofipayload.employestatus === 'self-Employed' ||
                this.autofipayload.employestatus === 'military'
            ) {
                if (this.autofipayload.employementpayment === 'Hourly') {
                    this.autofipayload.Hourly_Wage =
                        this.autofiForm.controls['Hourly_Wage'].value;
                    this.autofipayload.Hours_per_week =
                        this.autofiForm.controls['Hours_per_week'].value;
                } else if (this.autofipayload.employestatus === 'Weekly') {
                    this.autofipayload.Weekly_gross_amount =
                        this.autofiForm.controls['Weekly_gross_amount'].value;
                } else if (this.autofipayload.employestatus === 'Bi-Weekly') {
                    this.autofipayload.Weekly_gross_amount =
                        this.autofiForm.controls['Weekly_gross_amount'].value;
                } else if (this.autofipayload.employestatus === 'Twice-a-Month') {
                    this.autofipayload.Weekly_gross_amount =
                        this.autofiForm.controls['Weekly_gross_amount'].value;
                } else if (this.autofipayload.employestatus === 'Monthly') {
                    this.autofipayload.Weekly_gross_amount =
                        this.autofiForm.controls['Weekly_gross_amount'].value;
                } else if (this.autofipayload.employestatus === 'Annual') {
                    this.autofipayload.Weekly_gross_amount =
                        this.autofiForm.controls['Weekly_gross_amount'].value;
                }
                if (this.autofipayload.employestatus !== '') {
                    this.viewportScroller.scrollToPosition([0, 0]);
                    this.current_income_submitted = true;
                    this.isCurrentIncomeValid = true;
                    setTimeout(() => {
                        this.autofiForm = this.formBuilder.group({
                            date: ['', [Validators.required, ageValidator(18, 120)]],
                            ssnitin: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern('^[0-9]*$'),
                                    Validators.minLength(9),
                                    Validators.maxLength(9),
                                ],
                            ],
                        });
                        this.page = 'credit_info';
                        this.autofiPage = 'primary-credit-information';
                        this.iscurrentincomet = true;
                        this.formValues$ = this.store.pipe(select((state: any) => state.appForm.creditInfoFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null) {
                                let response = JSON.parse(JSON.stringify(resp));
                                this.autofiForm.controls['date']?.setValue(response.date);
                                this.autofiForm.controls['ssnitin']?.setValue(response.ssnitin);
                            } else {
                                this.autofiForm.controls['date']?.setValue(this.autofipayload.date);
                                this.autofiForm.controls['ssnitin']?.setValue(
                                    this.autofipayload.ssnitin
                                );
                            }
                            this.cdr.detectChanges();
                        });
                    }, 500);

                } else {
                    this.current_income_submitted = true;
                    this.isCurrentIncomeValid = true;
                    setTimeout(() => {
                        this.autofiForm = this.formBuilder.group({
                            date: ['', [Validators.required, ageValidator(18, 120)]],
                            ssnitin: [
                                '',
                                [
                                    Validators.required,
                                    Validators.pattern('^[0-9]*$'),
                                    Validators.minLength(9),
                                    Validators.maxLength(9),
                                ],
                            ],
                        });
                        this.page = 'credit_info';
                        this.autofiPage = 'primary-credit-information';
                        this.iscurrentincomet = true;
                        this.formValues$ = this.store.pipe(select((state: any) => state.appForm.creditInfoFormValues));
                        this.formValues$.subscribe((resp) => {
                            if (resp !== null) {
                                let response = JSON.parse(JSON.stringify(resp));
                                this.autofiForm.controls['date']?.setValue(response.date);
                                this.autofiForm.controls['ssnitin']?.setValue(response.ssnitin);
                            } else {
                                this.autofiForm.controls['date']?.setValue(this.autofipayload.date);
                                this.autofiForm.controls['ssnitin']?.setValue(
                                    this.autofipayload.ssnitin
                                );
                            }
                            this.cdr.detectChanges();
                        });
                    }, 500);
                }
            }
        }

        const formValues = this.autofiForm.getRawValue();
        if (!this.isEmptyObject(formValues)) {
            this.store.dispatch(FormActions.saveHowYouPaidFormValues({ howYouPaidFormValues: formValues }));
        } else {
            this.store.dispatch(FormActions.saveCurrentIncomeFormValues({ currentIncomeFormValues: this.autofipayload.grossMothlyIncome }));
        }
        this.adobe_apply_credit_step_completed('current-income');
        //this.adobe_apply_credit_continue('current-income', 'credit-information');

        setTimeout(() => {
            this.autofiForm = this.formBuilder.group({
                date: ['', [Validators.required, ageValidator(18, 120)]],
                ssnitin: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$'),
                        Validators.minLength(9),
                        Validators.maxLength(9),
                    ],
                ],
            });
            this.page = 'credit_info';
            this.autofiPage = 'primary-credit-information';
            this.iscurrentincomet = true;
            this.formValues$ = this.store.pipe(select((state: any) => state.appForm.creditInfoFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null) {
                    let response = JSON.parse(JSON.stringify(resp));
                    this.autofiForm.controls['date']?.setValue(response.date);
                    this.autofiForm.controls['ssnitin']?.setValue(response.ssnitin);
                } else {
                    this.autofiForm.controls['date']?.setValue(this.autofipayload.date);
                    this.autofiForm.controls['ssnitin']?.setValue(
                        this.autofipayload.ssnitin
                    );
                }
                this.cdr.detectChanges();
            });
        });

        this.autofipayload.date = this.autofiForm.controls['date']?.value;

        this.autofipayload.ssnitin = this.primarysstin = this.autofiForm.controls['ssnitin']?.value;
        //encrypting data
        this.autofipayload.ssnitinencrypt = 'XXX-XX'.concat(
            this.autofipayload.ssnitin?.substring(7, 12)
        );

        this.autofipayload.showdate = this.autofipayload.date;
    }

    public coappCreditInfoForm() {
        this.coisCurrentIncomeValid = true;
        this.isco_currentincomet = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_date_form_submitted = true;
            this.isco_currentincomet = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        for (let i = 0; i < this.autofipayload.CoApplicantotherincome?.length; i++) {
            if (
                this.autofipayload.CoApplicantotherincome[i].incomeSource === '' ||
                this.autofipayload.CoApplicantotherincome[i].grossIncome === '' ||
                Number(this.autofipayload.CoApplicantotherincome[i].grossIncome) === 0
            ) {
                this.coisCurrentIncomeValid = false;
            }
        }

        if (this.coisCurrentIncomeValid == false) {
            return;
        }

        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();
        if (!this.isEmptyObject(formValues)) {
            this.store.dispatch(CoappFormActions.saveCoappHowYouPaidFormValues({ coappHowYouPaidFormValues: formValues }));
        } else {
            this.store.dispatch(CoappFormActions.saveCoappHowYouPaidFormValues({ coappHowYouPaidFormValues: this.autofipayload.CoApplicantgrossMothlyIncome }));
        }
        this.adobe_apply_credit_step_completed('coapp-current-income');
        //this.adobe_apply_credit_continue('coapp-current-income', 'coapp-credit-information');

        this.autofiForm = this.formBuilder.group({
            cadate: ['', [
                Validators.required,
                ageValidator(18, 120),
                this.checkdob
            ]],
            cassnitin: ['', [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.maxLength(9),
                Validators.minLength(9)
            ]]
        }, { validators: checkDuplicateSsn(this.autofiForm.get('ssnitin')?.value, this.autofiForm.get('cassnitin')?.value) });
        this.page = 'coapplicant_credit_info';
        this.autofiPage = 'co-applicant-credit-information';
        this.iscurrentincomet = true;
        this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappCreditInfoFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                let response = JSON.parse(JSON.stringify(resp));
                this.autofiForm.controls['cadate']?.setValue(response.cadate);
                this.autofiForm.controls['cassnitin']?.setValue(response.cassnitin);
            } else {
                this.autofiForm.controls['cadate']?.setValue(this.autofipayload.CoApplicantdate);
                this.autofiForm.controls['cassnitin']?.setValue(
                    this.autofipayload.CoApplicantssnitin
                );
            }
        });

        if (this.autofiForm.valid) {
            this.autofipayload.CoApplicantdate = this.autofiForm.controls['cadate'].value;
            this.autofipayload.CoApplicantssnitin = this.autofiForm.controls['cassnitin'].value;

            //encrypting data
            this.autofipayload.CoApplicantssnitinencrypt = 'XXX-XX'.concat(this.autofipayload.cassnitin?.substring(7, 12));

            this.autofipayload.showdate = this.autofipayload.date;
            if (this.autofipayload.coapplicant == 'no') {
                // this.autofipayload.iscoapplicant = 'yes';
                this.page = 'review_application';
                this.autofiPage = 'review-summary-information';
                this.iscreditinfo = true;
                this.adobe_apply_credit_step_completed('review-application');
                //this.adobe_apply_credit_continue('review-application', 'application-summary');
            }
        }
    }

    public goNextCoapp() {
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.ca_contactinfo_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(CoappFormActions.saveCoappContactInfoFormValues({ coappContactFormValues: formValues }));
        this.adobe_apply_credit_step_completed('coapp-contact-information');
        //this.adobe_apply_credit_continue('coapp-contact-information', 'coapp-residence');
        this.isco_contactinfo = true;

        this.autofipayload.CoApplicantfirstname = this.autofiForm.controls['cafirstName'].value;
        this.autofipayload.CoApplicantlastname = this.autofiForm.controls['calastName'].value;
        this.autofipayload.CoApplicantemail = this.autofiForm.controls['caemail'].value;
        this.autofipayload.CoApplicantphone = this.autofiForm.controls['caphonenumber'].value.replace('(', '').replace(')', '').replace('-', '');
        this.autofipayload.CoApplicantphoneHTML = this.autofiForm.controls['caphonenumber'].value;
        this.autofipayload.CoApplicantaddress = this.autofiForm.controls['caaddress'].value;
        this.autofipayload.CoApplicantapt = this.autofiForm.controls['caapt'].value;
        this.autofipayload.CoApplicantcity = this.autofiForm.controls['cacity'].value;
        this.autofipayload.CoApplicantstate = this.autofiForm.controls['castate'].value;
        this.autofipayload.CoApplicantzipcode = this.autofiForm.controls['cazipcode'].value;
        this.coaplicantContactZipcode = this.autofiForm.controls['cazipcode'].value;
        this.autofipayload.CoApplicantamaterial_status = this.autofiForm.controls['camaterialstatus'].value;

        this.page = 'coapplicant_relationship';
        if (this.autofipayload.CoApplicantresidenceTotalMonth === undefined) {
            this.autofipayload.CoApplicantresidenceTotalMonth = 1;
        }

        if (this.autofipayload.relationship != undefined) {
            this.relationship_submitted = true;

            this.formValues$ = this.store.pipe(select((state: any) => state.coappForm.coappRelationshipFormValues));
            this.formValues$.subscribe((resp) => {
                if (resp !== null && resp !== undefined) {
                    this.autofiForm.controls['relationship'].setValue(resp.coappRelationshipFormValues);
                } else {
                    setTimeout(() => {
                        if (
                            this.autofipayload.relationship !== undefined &&
                            this.autofipayload.relationship === 'Other'
                        ) {
                            this.autofiForm = this.formBuilder.group({
                                relationship: [
                                    '',
                                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                                ],
                            });
                            this.residence_relationship = 1;
                            this.autofiForm.controls['relationship'].setValue(
                                this.autofipayload.CoApplicantrelationship
                            );
                            this.page = 'coapplicant_relationship';
                            this.isco_contactinfo = true;
                        } else {
                            this.page = 'coapplicant_relationship';
                            this.autofiPage = 'co-applicant-relationship-information';
                            this.isco_contactinfo = true;
                            this.residence_relationship = 0;
                        }
                    }, 500);
                }
            });
            this.setNextPageCoappRelation();
        }
        this.cdr.detectChanges();
    }

    private adobeAnalyticsErrorInfo() {
        if (this.contactinfo_submitted && this.f['firstName']?.errors && this.f['firstName']?.errors?.['required']) {
            this.infoError = 'first name is required'
        } else if (this.contactinfo_submitted && this.f['lastName']?.errors && this.f['lastName']?.errors?.['required']) {
            this.infoError = 'last name is required'
        } else if (this.contactinfo_submitted && this.f['email']?.errors && this.f['email']?.errors?.['required']) {
            this.infoError = 'email is required';
        } else if (this.contactinfo_submitted && this.f['phonenumber']?.errors && this.f['phonenumber']?.errors?.['required']) {
            this.infoError = 'phone number is required';
        } else if ((this.contactinfo_submitted && this.f['address']?.errors && this.f['address']?.errors?.['required']) ||
            (this.emppreviousaddress_submitted && this.f['empprevaddress']?.errors && this.f['empprevaddress']?.errors?.['required'])) {
            this.infoError = 'enter a valid Address';
        } else if (this.contactinfo_submitted && this.f['city']?.errors && this.f['city']?.errors?.['required']) {
            this.infoError = 'city is required';
        } else if (this.contactinfo_submitted && this.f['state']?.errors && this.f['state']?.errors?.['state']) {
            this.infoError = 'state is required';
        } else if (this.contactinfo_submitted && this.f['zipcode']?.errors && this.f['zipcode']?.errors?.['required']) {
            this.infoError = 'ZIP Code is required';
        } else if (this.contactinfo_submitted && this.f['materialstatus']?.errors?.['required']) {
            this.infoError = 'please select marital status';
        } else if (this.contactinfo_submitted && this.f['coapplicant']?.errors && this.f['coapplicant'].errors?.['required']) {
            this.infoError = 'coapplicant is required';
        } else if (this.f['payment']?.errors && this.f['payment']?.errors?.['required']) {
            this.infoError = 'payment amount is required';
        } else if ((this.previousaddress_submitted && this.f['prevaddress']?.errors && this.f['prevaddress']?.errors?.['required']) ||
            (this.ca_previousaddress_submitted && this.f['caprevaddress']?.errors && this.f['caprevaddress']?.errors?.['required'])) {
            this.infoError = 'address is required';
        } else if ((this.previousaddress_submitted && this.f['prevcity']?.errors && this.f['prevcity']?.errors?.['required']) ||
            (this.ca_previousaddress_submitted && this.f['caprevcity']?.errors && this.f['caprevcity']?.errors?.['required'])) {
            this.infoError = 'city is required';
        } else if ((this.previousaddress_submitted && this.f['prevstate']?.errors && this.f['prevstate']?.errors?.['required']) ||
            (this.ca_previousaddress_submitted && this.f['caprevstate']?.errors && this.f['caprevstate']?.errors?.['required'])) {
            this.infoError = 'state is required';
        } else if ((this.previousaddress_submitted && this.f['prevzipcode']?.errors && this.f['prevzipcode']?.errors?.['required']) ||
            (this.ca_previousaddress_submitted && this.f['caprevzipcode']?.errors && this.f['caprevzipcode']?.errors?.['required'])) {
            this.infoError = 'zipcode required';
        } else if ((this.employestatus_submitted && this.f['Institution']?.errors && this.f['Institution'].errors?.['required']) ||
            (this.ca_employestatus_submitted && this.f['caInstitution']?.errors && this.f['caInstitution'].errors?.['required'])) {
            this.infoError = 'institution is required';
        } else if ((this.employestatus_submitted && this.f['secondTitle']?.errors && this.f['secondTitle'].errors?.['required']) ||
            (this.employestatus_submitted && this.f['thirdTitle']?.errors && this.f['thirdTitle']?.errors?.['required']) ||
            (this.prevEmployestatus_submitted && this.f['prevEitle']?.errors && this.f['prevEitle']?.errors?.['required']) ||
            (this.ca_prevEmployestatus_submitted && this.f['caprevEitle']?.errors && this.f['caprevEitle']?.errors?.['required']) ||
            (this.ca_employestatus_submitted && this.f['catitle']?.errors && this.f['catitle']?.errors?.['required']) ||
            (this.ca_employestatus_submitted && this.f['casecondTitle']?.errors && this.f['casecondTitle']?.errors?.['required'] ||
                (this.ca_employestatus_submitted && this.f['cathirdTitle']?.errors && this.f['cathirdTitle']?.errors?.['required']))) {
            this.infoError = 'title is required';
        } else if (this.employestatus_submitted && this.f['secondename']?.errors && this.f['secondename']?.errors?.['required'] ||
            (this.prevEmployestatus_submitted && this.f['prevEName']?.errors && this.f['prevEName']?.errors?.['required']) ||
            (this.ca_prevEmployestatus_submitted && this.f['caprevEName'].errors && this.f['caprevEName'].errors?.['required']) ||
            (this.ca_employestatus_submitted && this.f['caEName']?.errors && this.f['caEName']?.errors?.['required']) ||
            (this.ca_employestatus_submitted && this.f['casecondename']?.errors && this.f['casecondename']?.errors?.['required'])) {
            this.infoError = 'employer name is required';
        } else if (this.employestatus_submitted && this.f['empAcceptTerms']?.errors && this.f['empAcceptTerms']?.errors?.['required']) {
            this.infoError = 'please confirm that this vehicle is not for business use';
        } else if ((this.prevEmployestatus_submitted && this.f['prevEphone']?.errors && this.f['prevEphone']?.errors?.['required']) ||
            (this.ca_prevEmployestatus_submitted && this.f['caprevEphone']?.errors && this.f['caprevEphone']?.errors?.['required'])) {
            this.infoError = 'employer phone number is required';
        } else if (this.ca_employestatus_submitted && this.f['caBName']?.errors && this.f['caBName']?.errors?.['required']) {
            this.infoError = 'business name is required';
        } else if ((this.employe_payment_submitted && this.f['Hourly_Wage']?.errors && this.f['Hourly_Wage']?.errors?.['required']) ||
            (this.f['caHourly_Wage']?.errors && this.f['caHourly_Wage'].errors?.['required'])) {
            this.infoError = 'hourly wage is required';
        } else if ((this.employe_payment_submitted && this.f['Hours_per_week']?.errors && this.f['Hours_per_week'].errors?.['required']) ||
            (this.f['caHours_per_week']?.errors && this.f['caHours_per_week'].errors?.['required'])) {
            this.infoError = 'hours per week is required';
        } else if ((this.employe_payment_submitted && this.f['Weekly_gross_amount']?.errors && this.f['Weekly_gross_amount'].errors?.['required']) ||
            (this.f['caWeekly_gross_amount']?.errors && this.f['caWeekly_gross_amount'].errors?.['required'])) {
            this.infoError = 'gross amount is required';
        } else if ((this.date_form_submitted && this.f['date']?.errors && this.f['date'].errors?.['required']) ||
            (this.ca_date_form_submitted && this.f['date']?.errors && this.f['date']?.errors?.['required'])) {
            this.infoError = 'invalid date';
        } else if ((this.date_form_submitted && this.f['ssnitin']?.errors && this.f['ssnitin']?.errors?.['required']) ||
            (this.ca_date_form_submitted && this.f['ssnitin']?.errors && this.f['ssnitin'].errors?.['required'])) {
            this.infoError = 'ssn or itin is required';
        }
    }

    public goPayment() {
        this.is_paymentcalc = true;
        if (this.page == 'payment_calc') {
            this.autofiStatus = 'Auto-Fi - Initiated';
            this.autofipayload.iscoapplicant = 'no';
            this.autofiForm = this.formBuilder.group({
                firstName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        this.atLeastOneAlphabet(),
                    ],
                ],
                lastName: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern("^[a-zA-Z-.']*$"),
                        Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                        this.atLeastOneAlphabet(),
                    ],
                ],
                email: ['', [Validators.required]],
                phonenumber: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                address: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                apt: ['', []],
                city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
                state: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern('^[a-zA-Z ]*$'),
                        Validators.minLength(2),
                        Validators.maxLength(2),
                        this.stateValidator(),
                    ],
                ],
                zipcode: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^[0-9]*$/),
                        Validators.minLength(4),
                        Validators.maxLength(5),
                    ],
                ],
                materialstatus: ['', Validators.required],
                coapplicant: ['', Validators.required],
            });
            const phoneNumberControl = this.autofiForm.get('phonenumber');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }

            this.autofipayload.CoApplicantempResidenceMonth = 1;

            this.autofiPage = 'primary-identity-and-contact-information';
            this.page = 'contactInfo';
            setTimeout(() => {
                this.autofiForm.controls['firstName'].setValue(this.contactFirstname);
                this.autofiForm.controls['lastName'].setValue(this.contactLastname);
                this.autofiForm.controls['email'].setValue(this.contactEmail);
                this.autofiForm.controls['zipcode'].setValue(this.contactZipcode);
                if (this.contactPhone !== undefined && this.contactPhone !== '') {
                    this.autofiForm.controls['phonenumber'].setValue(
                        '(' +
                        this.contactPhone?.substring(0, 3) +
                        ')' +
                        this.contactPhone?.substring(3, 6) +
                        '-' +
                        this.contactPhone?.substring(6)
                    );
                }
                this.autofiForm.controls['address']?.setValue(this.autofipayload.address);
                this.autofiForm.controls['apt']?.setValue(this.autofipayload.apt);
                this.autofiForm.controls['city']?.setValue(this.autofipayload.city);
                this.autofiForm.controls['state']?.setValue(this.autofipayload.state);
                this.autofiForm.controls['materialstatus']?.setValue(this.autofipayload.material_status);
                this.autofiForm.controls['coapplicant']?.setValue(this.autofipayload.coapplicant);
            });
        }
    }

    public goNext() {
        this.contactinfo_submitted = true;
        if (this.autofiForm.invalid) {
            this.adobeAnalyticsErrorInfo();
            this.adobe_apply_credit_error_display(this.infoError);
            this.contactinfo_submitted = true;
            this.autofiForm.markAllAsTouched();
            return;
        }
        this.viewportScroller.scrollToPosition([0, 0]);
        this.autofipayload.firstname = this.autofiForm.controls['firstName'].value;
        this.autofipayload.lastname = this.autofiForm.controls['lastName'].value;
        this.autofipayload.email = this.autofiForm.controls['email'].value;
        this.autofipayload.phone = this.autofiForm.controls['phonenumber'].value;
        this.autofipayload.address = this.autofiForm.controls['address'].value;
        this.autofipayload.apt = this.autofiForm.controls['apt'].value;
        this.autofipayload.city = this.autofiForm.controls['city'].value;
        this.autofipayload.state = this.autofiForm.controls['state'].value;
        this.autofipayload.zipcode = this.autofiForm.controls['zipcode'].value;
        this.contactZipcode = this.autofiForm.controls['zipcode'].value;
        this.autofipayload.material_status = this.autofiForm.controls['materialstatus'].value;
        this.autofipayload.coapplicant = this.autofiForm.controls['coapplicant'].value;

        const formValues = this.autofiForm.getRawValue();
        this.store.dispatch(FormActions.saveContactInfoFormValues({ contactFormValues: formValues }));
        this.adobe_apply_credit_step_completed('contact-information');
        //this.adobe_apply_credit_continue('contact-information', 'residence');
        this.is_contactinfo = true;
        // if (this.autofipayload.displaypayment === 'Owned' || this.autofipayload.displaypayment === 'Family') {
        //     this.autofiForm = this.formBuilder.group({
        //         slider: ['', []]
        //     });
        // } else {
        //     this.autofiForm = this.formBuilder.group({
        //         payment: ['',
        //             [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
        //         slider: ['', []]
        //     });
        // }
        this.autofiForm.reset();
        setTimeout(() => {
            if (
                this.autofipayload.paymenttype !== undefined &&
                (this.autofipayload.paymenttype === 'I have a Mortgage' ||
                    this.autofipayload.paymenttype === 'I lease or rent')
            ) {
                this.autofiForm = this.formBuilder.group({
                    payment: [
                        null,
                        [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')],
                    ],
                    slider: ['', []]
                });
                this.page2fn = 1;
            } else {
                this.autofiForm = this.formBuilder.group({
                    slider: ['', []]
                });
                this.page2fn = 0;
            }
        }, 500);
        this.residenceInfoSubscription();
        this.setNextPage();
    }

    private setNextPage() {
        this.page = 'residence';
        this.payment_submitted = true;
    }

    private setNextPageCoappRelation() {
        this.page = 'coapplicant_relationship';
        this.ca_payment_submitted = true;
    }

    public setNextPageCoAppResidence() {
        if (this.autofiForm.controls['relationship']?.value !== undefined) {
            this.autofipayload.CoApplicantrelationship = this.autofipayload.relationship;
            this.store.dispatch(CoappFormActions.saveCoappRelationshipInfoFormValues({ coappRelationshipFormValues: this.autofipayload.CoApplicantrelationship }));
        }
        this.adobe_apply_credit_step_completed('coapp-relationship');
        this.viewportScroller.scrollToPosition([0, 0]);
        this.page = 'coapplicant_residence';
        this.isrelationship = true;
        if (this.autofipayload.CoApplicantresidenceMonth === undefined || this.autofipayload.CoApplicantresidenceMonth === '' || this.autofipayload.CoApplicantresidenceMonth === null) {
            this.autofipayload.CoApplicantresidenceMonth = 1;
        }
        if (this.autofipayload.CoApplicantresidenceTotalMonth === undefined) {
            this.autofipayload.CoApplicantresidenceTotalMonth = 1;
        }
        this.coappResidenceInfoSubscription();
    }

    public emp_previous_address() {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.emppreviousaddress_submitted = true;
        if (this.autofiForm.valid) {
        }

        this.autofipayload.empprevaddress =
            this.autofiForm.controls['empprevaddress'].value;
        this.autofipayload.empprevapt =
            this.autofiForm.controls['empprevapt'].value;
        this.autofipayload.empprevcity =
            this.autofiForm.controls['empprevcity'].value;
        this.autofipayload.empprevstate =
            this.autofiForm.controls['empprevstate'].value;
        this.autofipayload.empprevzipcode =
            this.autofiForm.controls['empprevzipcode'].value;
    }

    public co_applicantemp_previous_address() {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.ca_emppreviousaddress_submitted = true;
        if (this.autofiForm.valid) {
        }

        this.autofipayload.coapplicantempprevaddress =
            this.autofiForm.controls['caempprevaddress'].value;
        this.autofipayload.coapplicantempprevapt =
            this.autofiForm.controls['caempprevapt'].value;
        this.autofipayload.coapplicantempprevcity =
            this.autofiForm.controls['caempprevcity'].value;
        this.autofipayload.coapplicantempprevstate =
            this.autofiForm.controls['caempprevstate'].value;
        this.autofipayload.coapplicantempprevzipcode =
            this.autofiForm.controls['caempprevzipcode'].value;
    }

    public recidentinfovalidation(data: any) {
        this.autofipayload.paymenttype = data;
        this.enableResidence = true;
        if (data === 'I have a Mortgage') {
            this.autofipayload.paymenttypeAPI = 'BUYING';
            this.autofipayload.displaypayment = 'Mortgaged';
        } else if (data === 'I lease or rent') {
            this.autofipayload.paymenttypeAPI = 'RENT';
            this.autofipayload.displaypayment = 'Rented';
        } else if (data === 'I own my home weight') {
            this.autofipayload.paymenttypeAPI = 'OWN';
            this.autofipayload.displaypayment = 'Owned';
        } else if (data === 'I live with family') {
            this.autofipayload.paymenttypeAPI = 'RELATIVES';
            this.autofipayload.displaypayment = 'Family';
        }

        if (data === 'I have a Mortgage' || data === 'I lease or rent') {
            this.autofiForm = this.formBuilder.group({
                payment: [null,
                    [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
                slider: ['', []],
            });
            this.page2fn = 1;
            if (this.autofipayload.payment !== undefined) {
                this.autofiForm.controls['payment'].setValue(
                    this.autofipayload.payment
                );
                this.autofiForm.controls['slider'].setValue(
                    this.autofipayload.residenceTotalMonth
                );
            }
        } else {
            this.autofiForm = this.formBuilder.group({
                slider: ['', []],
            });
            this.page2fn = 0;
        }
    }

    public ca_recidentinfovalidation(data: any) {
        this.autofipayload.coapplicantpaymenttype = data;
        this.co_enableresidence = true;
        if (data === 'I have a Mortgage') {
            this.autofipayload.CoApplicantpaymenttypeAPI = 'BUYING';
            this.autofipayload.displayCoApplicantpaymenttype = 'Mortgaged';
        } else if (data === 'I lease or rent') {
            this.autofipayload.CoApplicantpaymenttypeAPI = 'RENT';
            this.autofipayload.displayCoApplicantpaymenttype = 'Rented';
        } else if (data === 'I own my home weight') {
            this.autofipayload.CoApplicantpaymenttypeAPI = 'OWN';
            this.autofipayload.displayCoApplicantpaymenttype = 'Owned';
        } else if (data === 'I live with family') {
            this.autofipayload.CoApplicantpaymenttypeAPI = 'RELATIVES ';
            this.autofipayload.displayCoApplicantpaymenttype = 'Family';
        }
        if (data === 'I have a Mortgage' || data === 'I lease or rent') {
            this.autofiForm = this.formBuilder.group({
                capayment: [null, this.autofipayload.coapplicantpaymenttype !== undefined &&
                    (this.autofipayload.coapplicantpaymenttype === 'I have a Mortgage' || this.autofipayload.coapplicantpaymenttype === 'I lease or rent') ?
                    [Validators.required, Validators.pattern('^[0-9]*$')] : []],
                caslider: ['', []],
            });
            this.is_coresidencepayment = 1;
            if (this.autofipayload.coapplicantpaymenttype !== undefined) {
                this.autofiForm.controls['capayment'].setValue(
                    this.autofipayload.CoApplicantpayment
                );
                this.autofiForm.controls['caslider'].setValue(this.autofipayload.CoApplicantresidenceTotalMonth);
            }
        } else {
            this.autofiForm = this.formBuilder.group({
                caslider: ['', []],
            });
            this.autofiForm.controls['caslider'].setValue(this.autofipayload.CoApplicantresidenceTotalMonth)
            this.is_coresidencepayment = 0;
        }
    }

    public ca_relationshipvalidation(data: any) {
        this.autofipayload.relationship = data;
        if (data === 'Spouse') {
            this.autofipayload.relationshipAPI = 'SPOUSE';
        } else if (data === 'Parent') {
            this.autofipayload.relationshipAPI = ' PARENT';
        } else if (data === 'Resides With') {
            this.autofipayload.relationshipAPI = ' RESIDESWITH';
        }
        this.enablerelationship = true;
        if (data === 'Other') {
            this.autofipayload.relationshipAPI = 'OTHER';
            this.autofiForm = this.formBuilder.group({
                relationship: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z]*$')],
                ],
            });
            this.residence_relationship = 1;
            if (this.autofipayload.relationship !== undefined) {
                this.autofiForm.controls['relationship'].setValue(
                    this.autofipayload.CoApplicantrelationship
                );
            }
            let formValues = this.autofiForm.getRawValue();
            this.store.dispatch(CoappFormActions.saveCoappRelationshipInfoFormValues({ coappRelationshipFormValues: formValues }))
        } else {
            this.autofiForm = this.formBuilder.group({});
            this.residence_relationship = 0;
        }
    }

    public coapplicant_residenceupdateValue(event: any) {
        if (event.target.value < 24) {
            this.page2fn = 3;
        }
    }

    public residencechangeValue(event: any) {
        this.autofipayload.residenceTotalMonth = event.target.value;
        this.autofipayload.residenceYear = Math.floor(
            this.autofipayload.residenceTotalMonth / 12
        );
        this.autofipayload.residenceMonth =
            this.autofipayload.residenceTotalMonth % 12;
        this.autofipayload.residenceTotalMonthAPI = Math.round(
            this.autofipayload.residenceTotalMonth
        );
    }

    public coapplicant_residencechangeValue(event: any) {
        this.autofipayload.CoApplicantresidenceTotalMonth = event.target.value;
        this.autofipayload.CoApplicantresidenceYear = Math.floor(
            this.autofipayload.CoApplicantresidenceTotalMonth / 12
        );
        this.autofipayload.CoApplicantresidenceMonth =
            this.autofipayload.CoApplicantresidenceTotalMonth % 12;
        this.autofipayload.CoApplicantresidenceTotalMonthAPI = Math.round(
            this.autofipayload.CoApplicantresidenceTotalMonth
        );
    }

    public coapplicant_employement_residenceupdateValue(event: any) {
        if (event.target.value <= 24) {
            this.page3fn = 10;
        }
    }

    public shifttradeinstart: any = 0;
    vehicle = '';
    mileage = '';
    zip = '';
    condition = '';
    options = '';
    tradein = '';
    tradein_adj = '';
    kbbyear = '';
    kbbmake = '';
    kbbmodel = '';
    kbbseries = '';
    kbbstyle = '';
    kbbmileage = '';
    kbbzip = '';
    kbbcondition = '';
    kbboptions = '';
    kbbprice = '';
    kbbtradein_value = '';
    kbbremainingvalue = '';
    public tradeinzip = null;
    public tradeinadjvalue: any = null;
    public tradeinoptions: any = null;

    public employement_residencechangeValue(event: any) {
        this.autofipayload.empResidenceTotalMonth = event.target.value;
        this.autofipayload.empResidenceYear = Math.floor(
            this.autofipayload.empResidenceTotalMonth / 12
        );
        this.autofipayload.empResidenceMonth =
            this.autofipayload.empResidenceTotalMonth % 12;
        this.autofipayload.empResidenceTotalMonthAPI = Math.round(
            this.autofipayload.empResidenceTotalMonth
        );
    }

    public prevEmployement_residencechangeValue(event: any) {
        this.autofipayload.prevEmpResidenceTotalMonth = event.target.value;
        this.autofipayload.prevEmpResidenceYear = Math.floor(
            this.autofipayload.prevEmpResidenceTotalMonth / 12
        );
        this.autofipayload.prevEmpResidenceMonth =
            this.autofipayload.prevEmpResidenceTotalMonth % 12;
        this.autofipayload.prevEmpResidenceTotalMonthAPI = Math.round(
            this.autofipayload.prevEmpResidenceTotalMonth
        );
    }

    public coapplicant_employement_prevEmployement_residencechangeValue(event: any) {
        this.autofipayload.CoApplicantprevEmpResidenceTotalMonth =
            event.target.value;
        this.autofipayload.CoApplicantprevEmpResidenceYear = Math.floor(
            this.autofipayload.CoApplicantprevEmpResidenceTotalMonth / 12
        );
        this.autofipayload.CoApplicantprevEmpResidenceMonth =
            this.autofipayload.CoApplicantprevEmpResidenceTotalMonth % 12;
    }

    public coapplicant_employement_residencechangeValue(event: any) {
        this.autofipayload.CoApplicantempResidenceTotalMonth = event.target.value;
        this.autofipayload.CoApplicantempResidenceYear = Math.floor(
            this.autofipayload.CoApplicantempResidenceTotalMonth / 12
        );
        this.autofipayload.CoApplicantempResidenceMonth =
            this.autofipayload.CoApplicantempResidenceTotalMonth % 12;
        this.autofipayload.CoApplicantempResidenceTotalMonthAPI = Math.round(
            this.autofipayload.CoApplicantempResidenceTotalMonth
        );
    }

    public employement_status() {
        this.employestatus_submitted = true;
        if (this.autofiForm.valid) {
            this.accepted = true;
        }
    }

    public employement_status_validation(data: any) {
        this.autofipayload.grossMothlyIncome = 0;
        this.autofipayload.employestatus = data;
        this.showotherpayment = 1;
        this.enableemployent = true;
        if (this.autofipayload.employestatus === 'Employed') {
            this.autofipayload.employestatusAPI = 'EMPLOYED';
            this.autofiForm = this.formBuilder.group({
                title: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                EName: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                Ephone: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            const phoneNumberControl = this.autofiForm.get('Ephone');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.page4fn = 1;
            this.autofipayload.otherincome = [];
        } else if (this.autofipayload.employestatus === 'self-Employed') {
            this.autofipayload.employestatusAPI = 'SELF_EMPLOYED';
            this.autofiForm = this.formBuilder.group({
                BName: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.page4fn = 2;
            this.autofipayload.otherincome = [];
        } else if (this.autofipayload.employestatus === 'UNEmployed') {
            this.autofipayload.employestatusAPI = 'UNEMPLOYED';
            this.autofiForm = this.formBuilder.group({
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.page4fn = 0;
            let otherIncomeData: any = {};
            otherIncomeData.incomeSource = '';
            otherIncomeData.financetiers = '';
            otherIncomeData.grossIncome = '';
            this.autofipayload.otherincome = [];
            this.autofipayload.otherincome.push(otherIncomeData);
        } else if (this.autofipayload.employestatus === 'student') {
            this.autofipayload.employestatusAPI = 'STUDENT';
            this.autofiForm = this.formBuilder.group({
                Institution: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.page4fn = 4;
            let otherIncomeData: any = {};
            otherIncomeData.incomeSource = '';
            otherIncomeData.financetiers = '';
            otherIncomeData.grossIncome = '';
            this.autofipayload.otherincome = [];
            this.autofipayload.otherincome.push(otherIncomeData);
        } else if (this.autofipayload.employestatus === 'military') {
            this.autofipayload.employestatusAPI = 'MILITARY';
            this.autofiForm = this.formBuilder.group({
                secondTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
                empSlider: ['', []],
            });
            this.page4fn = 5;
            this.autofipayload.otherincome = [];
        } else if (this.autofipayload.employestatus === 'retired') {
            this.autofipayload.employestatusAPI = 'RETIRED';
            this.autofiForm = this.formBuilder.group({
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.page4fn = 0;
            let otherIncomeData: any = {};
            otherIncomeData.incomeSource = '';
            otherIncomeData.financetiers = '';
            otherIncomeData.grossIncome = '';
            this.autofipayload.otherincome = [];
            this.autofipayload.otherincome.push(otherIncomeData);
        } else if (this.autofipayload.employestatus === 'other') {
            this.autofipayload.employestatusAPI = 'OTHER';
            this.autofiForm = this.formBuilder.group({
                thirdTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                secondename: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                slider: ['', []],
                empAcceptTerms: [
                    this.autofipayload.empAcceptTerms,
                    Validators.requiredTrue,
                ],
            });
            this.page4fn = 7;
            let otherIncomeData: any = {};
            otherIncomeData.incomeSource = '';
            otherIncomeData.financetiers = '';
            otherIncomeData.grossIncome = '';
            this.autofipayload.otherincome = [];
            this.autofipayload.otherincome.push(otherIncomeData);
        }
    }

    public coapplicant_employement_status_validation(data: any) {
        this.autofipayload.CoApplicantgrossMothlyIncome = 0;
        this.autofipayload.coapplicant_employestatus = data;
        this.co_showotherpayment = 1;
        this.co_enableemployent = true;
        if (this.autofipayload.coapplicant_employestatus === 'Employed') {
            this.autofiForm = this.formBuilder.group({
                catitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                caEName: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                caEphone: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                        Validators.minLength(14),
                        Validators.maxLength(14),
                        this.forbiddenFirstDigitValidator()
                    ],
                ],
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            const phoneNumberControl = this.autofiForm.get('caEphone');
            if (phoneNumberControl) {
                this.formatPhoneNumber(phoneNumberControl);
            }
            this.employment_statusfn = 1;
            setTimeout(() => {
                this.autofiForm.controls['catitle'].setValue(
                    this.autofipayload.CoApplicantemployee_title
                );
                this.autofiForm.controls['caEName'].setValue(
                    this.autofipayload.CoApplicantemployee_ename
                );
                this.autofiForm.controls['caEphone'].setValue(
                    this.autofipayload.CoApplicantemployee_phone
                );
            }, 500);
        } else if (
            this.autofipayload.coapplicant_employestatus === 'self-Employed'
        ) {
            this.autofiForm = this.formBuilder.group({
                caBName: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            this.employment_statusfn = 2;
            setTimeout(() => {
                this.autofiForm.controls['caBName'].setValue(
                    this.autofipayload.CoApplicantemployee_bname
                );
            }, 500);
            this.employerName = this.autofipayload.CoApplicantemployee_bname;
        } else if (this.autofipayload.coapplicant_employestatus === 'UNEmployed') {
            this.autofiForm = this.formBuilder.group({
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            this.employment_statusfn = 0;
        } else if (this.autofipayload.coapplicant_employestatus === 'student') {
            this.autofiForm = this.formBuilder.group({
                caInstitution: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                ],
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            this.employment_statusfn = 4;
            setTimeout(() => {
                this.autofiForm.controls['caInstitution'].setValue(
                    this.autofipayload.CoApplicantemployee_institute
                );
            }, 500);
        } else if (this.autofipayload.coapplicant_employestatus === 'military') {
            this.autofiForm = this.formBuilder.group({
                casecondTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
                empSlider: ['', []],
            });
            this.employment_statusfn = 5;
            setTimeout(() => {
                this.autofiForm.controls['casecondTitle'].setValue(
                    this.autofipayload.CoApplicantemployee_secondTitle
                );
            }, 500);
        } else if (this.autofipayload.coapplicant_employestatus === 'retired') {
            this.autofiForm = this.formBuilder.group({
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            this.employment_statusfn = 0;
        } else if (this.autofipayload.coapplicant_employestatus === 'other') {
            this.autofiForm = this.formBuilder.group({
                cathirdTitle: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                casecondename: [
                    '',
                    [Validators.required, Validators.pattern('^[a-zA-Z 0-9]*$')],
                ],
                CoApplicantempAcceptTerms: [false, Validators.requiredTrue],
            });
            this.employment_statusfn = 7;
            setTimeout(() => {
                this.autofiForm.controls['cathirdTitle'].setValue(
                    this.autofipayload.CoApplicantemployee_thirdTitle
                );
                this.autofiForm.controls['casecondename'].setValue(
                    this.autofipayload.CoApplicantemployee_secondEName
                );
            }, 500);
        }
    }

    public coapplicant_employement_status() {
        this.autofipayload.coaplicantemployee_title =
            this.autofiForm.controls['catitle'].value;
        this.autofipayload.coaplicantemployee_ename =
            this.autofiForm.controls['caEName'].value;
        this.autofipayload.coaplicantemployee_phone =
            this.autofiForm.controls['caEphone'].value;
        this.autofipayload.coaplicantemployee_bname =
            this.autofiForm.controls['caBName'].value;
        this.autofipayload.coaplicantemployee_institute =
            this.autofiForm.controls['caInstitution'].value;
        this.autofipayload.coaplicantemployee_thirdTitle =
            this.autofiForm.controls['cathirdTitle'].value;
        this.autofipayload.coaplicantemployee_secondTitle =
            this.autofiForm.controls['casecondTitle'].value;
        this.autofipayload.coaplicantemployee_secondEName =
            this.autofiForm.controls['casecondename'].value;
        this.ca_employestatus_submitted = true;
    }

    public add_employement_status_otherincome() {
        this.viewportScroller.scrollToPosition([0, 0]);
        if (this.autofipayload.otherincome === undefined) {
            this.autofipayload.otherincome = [];
        }
        let otherIncomeData: any = {};
        otherIncomeData.incomeSource = '';
        otherIncomeData.financetiers = '';
        otherIncomeData.grossIncome = '';
        this.autofipayload.otherincome.push(otherIncomeData);
    }

    public co_emp_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode !== 8) {
            this.co_emp_validatePhoneNo(event.target);
        }
    }

    public co_emp_validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['caEphone'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['caEphone'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
    }

    public coapplicant_add_employement_status_otherincome() {
        this.viewportScroller.scrollToPosition([0, 0]);
        if (this.autofipayload.CoApplicantotherincome === undefined) {
            this.autofipayload.CoApplicantotherincome = [];
        }
        let CoApplicantotherincome: any = {};
        CoApplicantotherincome.incomeSource = '';
        CoApplicantotherincome.financetiers = '';
        CoApplicantotherincome.grossIncome = '';
        this.autofipayload.CoApplicantotherincome.push(CoApplicantotherincome);
    }

    public remove_employement_status_otherincome(index: any) {
        this.autofipayload.otherincome.splice(index, 1);

        if (
            this.autofipayload.employestatus === 'UNEmployed' ||
            this.autofipayload.employestatus === 'student' ||
            this.autofipayload.employestatus === 'retired' ||
            this.autofipayload.employestatus === 'other'
        ) {
            this.fnIcomeCalculation('', -1, '', '');
        }
        if (
            this.autofipayload.employestatus === 'Employed' ||
            this.autofipayload.employestatus === 'self-Employed' ||
            this.autofipayload.employestatus === 'military'
        ) {
            this.fnGrossIncomeCalculation('', '');
        }
    }

    public coapplicant_remove_employement_status_otherincome(index: any) {
        this.autofipayload.CoApplicantotherincome.splice(index, 1);

        if (
            this.autofipayload.coapplicant_employestatus === 'UNEmployed' ||
            this.autofipayload.coapplicant_employestatus === 'student' ||
            this.autofipayload.coapplicant_employestatus === 'retired' ||
            this.autofipayload.coapplicant_employestatus === 'other'
        ) {
            this.coapplicant_fnIcomeCalculation('', -1, '', '');
        }
        if (
            this.autofipayload.coapplicant_employestatus === 'Employed' ||
            this.autofipayload.coapplicant_employestatus === 'self-Employed' ||
            this.autofipayload.coapplicant_employestatus === 'military'
        ) {
            this.coapplicant_fnGrossIncomeCalculation('', '');
        }
    }

    public remove_all_employement_status_otherincome() {
        let adddata: any = {};
        adddata.financetiers = '';
        this.autofipayload.otherincome.splice(adddata);
    }

    public employe_payment_status() {
        this.employe_payment_submitted = true;
        if (this.autofiForm.valid) {
        }
    }

    public employe_payment_status_validation(data: any) {
        this.autofipayload.employementpayment = data;
        if (this.autofipayload.employementpayment === 'Hourly') {
            this.autofipayload.employementpaymentAPI = 'HOURLY';
            this.autofiForm = this.formBuilder.group({
                Hourly_Wage: [
                    null,
                    [Validators.required, Validators.pattern('^[0-9 ]*$')],
                ],
                Hours_per_week: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9 ]*$')],
                ],
            });
            this.page3fn = 1;
            setTimeout(() => {
                this.autofiForm.controls['Hourly_Wage'].setValue('');
                this.autofiForm.controls['Hours_per_week'].setValue('');
            }, 500);
        } else if (this.autofipayload.employementpayment === 'Weekly') {
            this.autofipayload.employementpaymentAPI = 'WEEKLY';
            this.autofiForm = this.formBuilder.group({
                Weekly_gross_amount: [
                    null,
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.page3fn = 2;
            setTimeout(() => {
                this.autofiForm.controls['Weekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.employementpayment === 'Bi-Weekly') {
            this.autofipayload.employementpaymentAPI = 'BI_WEEKLY';
            this.autofiForm = this.formBuilder.group({
                Weekly_gross_amount: [
                    null,
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.page3fn = 3;

            setTimeout(() => {
                this.autofiForm.controls['Weekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.employementpayment === 'Twice-a-Month') {
            this.autofipayload.employementpaymentAPI = 'TWICE_A_MONTH';
            this.autofiForm = this.formBuilder.group({
                Weekly_gross_amount: [
                    null,
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.page3fn = 4;

            setTimeout(() => {
                this.autofiForm.controls['Weekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.employementpayment === 'Monthly') {
            this.autofipayload.employementpaymentAPI = 'MONTHLY';
            this.autofiForm = this.formBuilder.group({
                Weekly_gross_amount: [
                    null,
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.page3fn = 5;

            setTimeout(() => {
                this.autofiForm.controls['Weekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.employementpayment === 'Annual') {
            this.autofipayload.employementpaymentAPI = 'ANNUAL';
            this.autofiForm = this.formBuilder.group({
                Weekly_gross_amount: [
                    null,
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.page3fn = 6;

            setTimeout(() => {
                this.autofiForm.controls['Weekly_gross_amount'].setValue('');
            }, 500);
        } else {
            this.autofiForm = this.formBuilder.group({});
            this.page3fn = 0;
        }
        if (this.autofipayload.grossMothlyIncome === undefined) {
            this.autofipayload.grossMothlyIncome = 0;
        }
        this.autofipayload.Weekly_gross_amount = 0;
        this.autofipayload.Hours_per_week = 0;
        this.autofipayload.Hourly_Wage = 0;
        this.fnGrossIncomeCalculation('', '');
    }

    public coapplicant_employe_payment_status_validation(data: any) {
        this.autofipayload.CoApplicantemployementpayment = data;
        if (this.autofipayload.CoApplicantemployementpayment === 'Hourly') {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'HOURLY';
            this.autofiForm = this.formBuilder.group({
                caHourly_Wage: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9 ]*$')],
                ],
                caHours_per_week: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9 ]*$')],
                ],
            });
            this.fn_currentinfo = 1;
            setTimeout(() => {
                this.autofiForm.controls['caHourly_Wage'].setValue('');
                this.autofiForm.controls['caHours_per_week'].setValue('');
            }, 500);
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Weekly') {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'WEEKLY';
            this.autofiForm = this.formBuilder.group({
                caWeekly_gross_amount: [
                    '',
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.fn_currentinfo = 2;
            setTimeout(() => {
                this.autofiForm.controls['caWeekly_gross_amount'].setValue('');
            }, 500);
        } else if (
            this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly'
        ) {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'BI_WEEKLY';
            this.autofiForm = this.formBuilder.group({
                caWeekly_gross_amount: [
                    '',
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.fn_currentinfo = 3;

            setTimeout(() => {
                this.autofiForm.controls['caWeekly_gross_amount'].setValue('');
            }, 500);
        } else if (
            this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
        ) {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'TWICE_A_MONTH';
            this.autofiForm = this.formBuilder.group({
                caWeekly_gross_amount: [
                    '',
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.fn_currentinfo = 4;

            setTimeout(() => {
                this.autofiForm.controls['caWeekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Monthly') {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'MONTHLY';
            this.autofiForm = this.formBuilder.group({
                caWeekly_gross_amount: [
                    '',
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.fn_currentinfo = 5;

            setTimeout(() => {
                this.autofiForm.controls['caWeekly_gross_amount'].setValue('');
            }, 500);
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Annual') {
            this.autofipayload.CoApplicantemployementpaymentAPI = 'ANNUAL';
            this.autofiForm = this.formBuilder.group({
                caWeekly_gross_amount: [
                    '',
                    [Validators.required, Validators.pattern(/^-?[0-9]+([.][0-9]*)?$/)],
                ],
            });
            this.fn_currentinfo = 6;

            setTimeout(() => {
                this.autofiForm.controls['caWeekly_gross_amount'].setValue('');
            }, 500);
        } else {
            this.autofiForm = this.formBuilder.group({});
            this.fn_currentinfo = 0;
        }
        if (this.autofipayload.CoApplicantgrossMothlyIncome === undefined) {
            this.autofipayload.CoApplicantgrossMothlyIncome = 0;
        }
        this.autofipayload.CoApplicantWeekly_gross_amount = 0;
        this.autofipayload.CoApplicantHours_per_week = 0;
        this.autofipayload.CoApplicantHourly_Wage = 0;
        this.coapplicant_fnGrossIncomeCalculation('', '');
    }

    public date_snn_itin() {
        this.autofipayload.date = this.autofiForm.controls['date'].value;
        this.autofipayload.ssnitin = this.primarysstin =
            this.autofiForm.controls['ssnitin'].value;
        this.autofiForm = this.formBuilder.group({
            date: ['', [Validators.required, ageValidator(18, 120), this.checkdob]],
            ssnitin: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9),
            Validators.maxLength(9),]],
        });

        this.autofiForm.controls['date'].setValue(this.autofipayload.date);
        this.autofiForm.controls['ssnitin'].setValue(this.autofipayload.ssnitin);

        this.date_form_submitted = true;
        if (this.autofiForm.valid) {
            if (this.autofipayload.coapplicant == 'yes') {
                this.page = 'coapplicant_contactinfo';
                this.autofiPage =
                    'co-applicant-identity-and-contact-information';
                this.autofiForm = this.formBuilder.group({
                    cafirstName: [
                        '',
                        [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")],
                    ],
                    calastName: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern("^[a-zA-Z-.']*$"),
                            Validators.pattern(/^[a-zA-Z-.']{1,}$/),
                        ],
                    ],
                    caemail: ['', [Validators.required]],
                    caphonenumber: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
                            Validators.minLength(14),
                            Validators.maxLength(14),
                            this.forbiddenFirstDigitValidator()
                        ],
                    ],
                    caaddress: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
                    ],
                    caapt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
                    cacity: [
                        '',
                        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')],
                    ],
                    castate: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern('^[a-zA-Z ]*$'),
                            Validators.minLength(2),
                            Validators.maxLength(2),
                            this.stateValidator,
                        ],
                    ],
                    cazipcode: [
                        '',
                        [
                            Validators.required,
                            Validators.pattern('^[0-9]*$'),
                            Validators.minLength(4),
                            Validators.maxLength(5),
                        ],
                    ],
                    camaterialstatus: ['', [Validators.required]],
                });
                const phoneNumberControl = this.autofiForm.get('caphonenumber');
                if (phoneNumberControl) {
                    this.formatPhoneNumber(phoneNumberControl);
                }

                this.autofiForm.controls['cafirstName'].setValue(
                    this.autofipayload.coaplicantfirstname
                );
                this.autofiForm.controls['calastName'].setValue(
                    this.autofipayload.coaplicantlastname
                );
                this.autofiForm.controls['caemail'].setValue(
                    this.autofipayload.coaplicantemail
                );
                this.autofiForm.controls['cazipcode'].setValue(
                    this.autofipayload.coaplicantzipcode
                );
                if (
                    this.autofipayload.CoApplicantphone != undefined &&
                    this.autofipayload.CoApplicantphone != ''
                ) {
                    this.autofiForm.controls['caphonenumber'].setValue(
                        '(' +
                        this.autofipayload.CoApplicantphone.substring(0, 3) +
                        ')' +
                        this.autofipayload.CoApplicantphone.substring(3, 6) +
                        '-' +
                        this.autofipayload.CoApplicantphone.substring(6)
                    );
                }
                this.autofiForm.controls['caaddress'].setValue(
                    this.autofipayload.coaplicantaddress
                );
                this.autofiForm.controls['caapt'].setValue(
                    this.autofipayload.coaplicantapt
                );
                this.autofiForm.controls['cacity'].setValue(
                    this.autofipayload.coaplicantcity
                );
                this.autofiForm.controls['castate'].setValue(
                    this.autofipayload.coaplicantstate
                );
                this.autofiForm.controls['camaterialstatus'].setValue(
                    this.autofipayload.coaplicantmaterial_status
                );
            } else {
            }
        }
    }

    public coapplicant_date_snn_itin() {
        this.ca_date_form_submitted = true;
        if (this.autofiForm.valid) {
        }
        this.autofipayload.date = this.autofiForm.controls['cadate'].value;
        this.autofipayload.ssnitin = this.Coappliantsstin =
            this.autofiForm.controls['cassnitin'].value;
        this.ca_date_form_submitted = true;
        this.autofiForm = this.formBuilder.group({
            cadate: ['', [
                Validators.required,
                ageValidator(18, 120),
                this.checkdob
            ]],
            cassnitin: ['', [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.maxLength(9),
                Validators.minLength(9)
            ]]
        }, { validators: checkDuplicateSsn(this.autofiForm.get('ssnitin')?.value, this.autofiForm.get('cassnitin')?.value) });

        this.autofiForm.controls['cadate'].setValue(
            this.autofipayload.coapplicantdate
        );
        this.autofiForm.controls['cassnitin'].setValue(
            this.autofipayload.coapplicantssnitin
        );
    }

    public checkdob(input: FormControl) {
        const birthDate = new Date(input.value);
        const timeDiff = Math.abs(Date.now() - birthDate.getTime());
        const age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);

        if (age < 18 || age > 120) {
            return { 'invalidAge': true };
        }
        return null;
    }

    public date_snn_itin_validation() {
        this.autofiForm = this.formBuilder.group({});
    }

    public populateaddress(obj: any) {
       const input = obj.target.value;
        if (input.length < 4) {
            return;
        }

        this.restService.getAddress(obj.target.value).subscribe((response) => {
            let obj = JSON.parse(JSON.stringify(response));
            this.address = obj.result.formatted_address;
        });

    }

    public selectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['address'].setValue(addr);
        this.autofiForm.controls['city'].setValue(str[str.length - 3].trim());
        this.autofiForm.controls['state'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['zipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public fnGrossIncomeCalculation(eventOrValue: Event | string, name: string) {
        let value: string;
        if (typeof eventOrValue === 'string') {
            value = eventOrValue;
        } else {
            const target = eventOrValue.target as HTMLInputElement;
            value = target.value;
        }
        const numericValue = Number(value);
        if (['Weekly_gross_amount', 'Hours_per_week', 'Hourly_Wage'].includes(name)) {
            this.autofipayload[name] = numericValue;
        }
        this.autofipayload.totalAmountPaid = 0;
        switch (this.autofipayload.employementpayment) {
            case 'Hourly':
                this.autofipayload.totalAmountPaid = this.autofipayload.Hourly_Wage * this.autofipayload.Hours_per_week * 4.33;
                break;
            case 'Weekly':
            case 'Bi-Weekly':
            case 'Twice-a-Month':
            case 'Monthly':
            case 'Annual':
                const multiplier: { [key in EmploymentPaymentFrequency]: number } = {
                    'Weekly': 4.33,
                    'Bi-Weekly': 2.17,
                    'Twice-a-Month': 2,
                    'Monthly': 1,
                    'Annual': 1 / 12
                };
                const paymentFrequency = this.autofipayload.employementpayment as EmploymentPaymentFrequency;
                const paymentMultiplier = multiplier[paymentFrequency] || 0;
                this.autofipayload.totalAmountPaid = (this.autofipayload.Weekly_gross_amount || 0) * paymentMultiplier;
                break;
        }

        this.autofipayload.grossMothlyIncome = Math.round(this.autofipayload.totalAmountPaid);
        this.autofipayload.grossMonthlyIncomewithoutroundoff = this.autofipayload.totalAmountPaid;
        this.autofipayload.firstgrossMothlyIncome = this.autofipayload.grossMothlyIncome;

        this.fnIcomeCalculation('', -1, '', '');
    }


    public coapplicant_fnGrossIncomeCalculation(event: any, name: any) {
        if (this.autofipayload.CoApplicantWeekly_gross_amount === undefined) {
            this.autofipayload.CoApplicantWeekly_gross_amount = 0;
        }
        if (this.autofipayload.CoApplicantHours_per_week === undefined) {
            this.autofipayload.CoApplicantHours_per_week = 0;
        }
        if (this.autofipayload.CoApplicantHourly_Wage === undefined) {
            this.autofipayload.CoApplicantHourly_Wage = 0;
        }
        if (name === 'caWeekly_gross_amount') {
            this.autofipayload.CoApplicantWeekly_gross_amount = Number(
                event.target.value
            );
        } else if (name === 'caHours_per_week') {
            this.autofipayload.CoApplicantHours_per_week = Number(event.target.value);
        } else if (name === 'caHourly_Wage') {
            this.autofipayload.CoApplicantHourly_Wage = Number(event.target.value);
        }
        this.autofipayload.CoApplicanttotalAmountPaid = 0;
        if (this.autofipayload.CoApplicantemployementpayment == 'Hourly') {
            if (
                this.autofipayload.CoApplicantHours_per_week === '' ||
                this.autofipayload.CoApplicantHourly_Wage === ''
            ) {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantHourly_Wage *
                this.autofipayload.CoApplicantHours_per_week *
                4.33;
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Weekly') {
            if (this.autofipayload.CoApplicantWeekly_gross_amount === '') {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantWeekly_gross_amount * 4.33;
        } else if (
            this.autofipayload.CoApplicantemployementpayment === 'Bi-Weekly'
        ) {
            if (this.autofipayload.CoApplicantWeekly_gross_amount === '') {
                this.autofipayload.grossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantWeekly_gross_amount * 2.17;
        } else if (
            this.autofipayload.CoApplicantemployementpayment === 'Twice-a-Month'
        ) {
            if (this.autofipayload.CoApplicantWeekly_gross_amount === '') {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantWeekly_gross_amount * 2;
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Monthly') {
            if (this.autofipayload.CoApplicantWeekly_gross_amount === '') {
                this.autofipayload.grossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantWeekly_gross_amount * 1;
        } else if (this.autofipayload.CoApplicantemployementpayment === 'Annual') {
            if (this.autofipayload.CoApplicantWeekly_gross_amount === '') {
                this.autofipayload.CoApplicantgrossMothlyIncome = 0;
            }
            this.autofipayload.CoApplicanttotalAmountPaid =
                this.autofipayload.CoApplicantWeekly_gross_amount / 12;
        }

        this.autofipayload.CoApplicantgrossMothlyIncome = Math.round(
            this.autofipayload.CoApplicanttotalAmountPaid
        );
        this.autofipayload.CoApplicantFirstgrossMothlyIncome =
            this.autofipayload.CoApplicantgrossMothlyIncome;
        this.coapplicant_fnIcomeCalculation('', -1, '', '');
    }

    public fnIcomeCalculation(event: any, i: any, name: any, data: any) {
        if (name === 'financetiers') {
            this.autofipayload.otherincome[i].financetiers = event.value;
        } else if (name === 'incomeSource') {
            this.autofipayload.otherincome[i].incomeSource = event.target.value;
        } else if (name === 'grossIncome') {
            if (this.autofipayload.otherincome[i].financetiers === '') {
                this.autofipayload.otherincome[i].financetiers = 'Monthly';
            }
            this.autofipayload.otherincome[i].grossIncome = event.target.value;
        }
        if (i >= 0) {
            if (this.autofipayload.otherincome[i].financetiers === 'Monthly') {
                if (this.autofipayload.otherincome[i].grossIncome === '') {
                    this.autofipayload.grossMothlyIncome = 0;
                }
                this.autofipayload.otherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.otherincome[i].grossIncome) * 1;
            } else if (this.autofipayload.otherincome[i].financetiers === 'Weekly') {
                if (this.autofipayload.otherincome[i].grossIncome === '') {
                    this.autofipayload.grossMothlyIncome = 0;
                }
                this.autofipayload.otherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.otherincome[i].grossIncome) * 4.33;
            } else if (
                this.autofipayload.otherincome[i].financetiers === 'Bi-Weekly'
            ) {
                if (this.autofipayload.otherincome[i].grossIncome === '') {
                    this.autofipayload.grossMothlyIncome = 0;
                }
                this.autofipayload.otherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.otherincome[i].grossIncome) * 2.17;
            } else if (this.autofipayload.otherincome[i].financetiers === 'Annual') {
                if (this.autofipayload.otherincome[i].grossIncome === '') {
                    this.autofipayload.grossMothlyIncome = 0;
                }
                this.autofipayload.otherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.otherincome[i].grossIncome) / 12;
            }
        }

        this.autofipayload.grossMothlyIncome = 0;
        if (this.autofipayload.firstgrossMothlyIncome > 1) {
            this.autofipayload.grossMothlyIncome =
                this.autofipayload.firstgrossMothlyIncome;
        }
        if (this.autofipayload.totalAmountPaid === undefined) {
            this.autofipayload.totalAmountPaid = 0;
        }
        for (let j in this.autofipayload.otherincome) {
            if (this.autofipayload.otherincome[j].grossMothlyIncome !== undefined) {
                this.autofipayload.grossMothlyIncome =
                    this.autofipayload.totalAmountPaid +
                    Number(this.autofipayload.otherincome[j].grossMothlyIncome);
            }
        }
        this.autofipayload.grossMothlyIncome = Math.round(
            this.autofipayload.grossMothlyIncome
        );
    }

    public coapplicant_fnIcomeCalculation(event: any, i: any, name: any, data: any) {
        if (name === 'financetiers') {
            this.autofipayload.CoApplicantotherincome[i].financetiers = event.value;
        } else if (name == 'incomeSource') {
            this.autofipayload.CoApplicantotherincome[i].incomeSource =
                event.target.value;
        } else if (name === 'grossIncome') {
            if (this.autofipayload.CoApplicantotherincome[i].financetiers === '') {
                this.autofipayload.CoApplicantotherincome[i].financetiers = 'Monthly';
            }
            this.autofipayload.CoApplicantotherincome[i].grossIncome =
                event.target.value;
        }
        if (i >= 0) {
            if (
                this.autofipayload.CoApplicantotherincome[i].financetiers === 'Monthly'
            ) {
                if (this.autofipayload.CoApplicantotherincome[i].grossIncome === '') {
                    this.autofipayload.CoApplicantgrossMothlyIncome = 0;
                }
                this.autofipayload.CoApplicantotherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.CoApplicantotherincome[i].grossIncome) * 1;
            } else if (
                this.autofipayload.CoApplicantotherincome[i].financetiers === 'Weekly'
            ) {
                if (this.autofipayload.CoApplicantotherincome[i].grossIncome === '') {
                    this.autofipayload.CoApplicantgrossMothlyIncome = 0;
                }
                this.autofipayload.CoApplicantotherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.CoApplicantotherincome[i].grossIncome) *
                    4.33;
            } else if (
                this.autofipayload.CoApplicantotherincome[i].financetiers === 'Bi-Weekly'
            ) {
                if (this.autofipayload.CoApplicantotherincome[i].grossIncome === '') {
                    this.autofipayload.CoApplicantgrossMothlyIncome = 0;
                }
                this.autofipayload.CoApplicantotherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.CoApplicantotherincome[i].grossIncome) *
                    2.17;
            } else if (
                this.autofipayload.CoApplicantotherincome[i].financetiers == 'Annual'
            ) {
                if (this.autofipayload.CoApplicantotherincome[i].grossIncome === '') {
                    this.autofipayload.CoApplicantgrossMothlyIncome = 0;
                }
                this.autofipayload.CoApplicantotherincome[i].grossMothlyIncome =
                    Number(this.autofipayload.CoApplicantotherincome[i].grossIncome) / 12;
            }
        }
        this.autofipayload.CoApplicantgrossMothlyIncome = 0;
        if (this.autofipayload.CoApplicantFirstgrossMothlyIncome > 1) {
            this.autofipayload.CoApplicantgrossMothlyIncome =
                this.autofipayload.CoApplicantFirstgrossMothlyIncome;
        }
        if (this.autofipayload.CoApplicanttotalAmountPaid == undefined) {
            this.autofipayload.CoApplicanttotalAmountPaid = 0;
        }
        for (let j in this.autofipayload.CoApplicantotherincome) {
            if (
                this.autofipayload.CoApplicantotherincome[j].grossMothlyIncome !=
                undefined
            ) {
                this.autofipayload.CoApplicantgrossMothlyIncome =
                    this.autofipayload.CoApplicanttotalAmountPaid +
                    Number(
                        this.autofipayload.CoApplicantotherincome[j].grossMothlyIncome
                    );
            }
        }
        this.autofipayload.CoApplicantgrossMothlyIncome = Math.round(
            this.autofipayload.CoApplicantgrossMothlyIncome
        );
    }

    public coapplicant_selectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['caaddress'].setValue(addr);
        this.autofiForm.controls['cacity'].setValue(str[str.length - 3].trim());
        this.autofiForm.controls['castate'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['cazipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public prevselectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['prevaddress'].setValue(addr);
        this.autofiForm.controls['prevcity'].setValue(str[str.length - 3].trim());
        this.autofiForm.controls['prevstate'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['prevzipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public coapplicant_prevselectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['caprevaddress'].setValue(addr);
        this.autofiForm.controls['caprevcity'].setValue(str[str.length - 3].trim());
        this.autofiForm.controls['caprevstate'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['caprevzipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public emp_prevselectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['empprevaddress'].setValue(addr);
        this.autofiForm.controls['empprevcity'].setValue(
            str[str.length - 3].trim()
        );
        this.autofiForm.controls['empprevstate'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['empprevzipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public coapplicant_emp_prevselectaddress(obj: any) {
        let str = obj.target.innerHTML.split(',');
        let newstrarr = [];
        let addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }

        addr = newstrarr.join(',');

        this.autofiForm.controls['caempprevaddress'].setValue(addr);
        this.autofiForm.controls['caempprevcity'].setValue(
            str[str.length - 3].trim()
        );
        this.autofiForm.controls['caempprevstate'].setValue(
            str[str.length - 2].trim().split(' ')[0]
        );
        this.autofiForm.controls['caempprevzipcode'].setValue(
            str[str.length - 2].trim().split(' ')[1]
        );

        this.address = [];
    }

    public keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode !== 8) {
            this.validatePhoneNo(event.target);
        }
    }

    public emp_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode !== 8) {
            this.emp_validatePhoneNo(event.target);
        }
    }

    public prevemp_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode !== 8) {
            this.prevemp_validatePhoneNo(event.target);
        }
    }

    public prevemp_validatePhoneNo(field: any) {
        let phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['prevEphone'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['prevEphone'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
        this.autofipayload.prevEphone = this.autofiForm.controls['prevEphone'].value;
    }

    public co_prevemp_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode != 8) {
            this.co_prevemp_validatePhoneNo(event.target);
        }
    }

    public co_prevemp_validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['caprevEphone'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['caprevEphone'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
    }

    public emp_validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['Ephone'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['Ephone'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
    }

    public snn_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode !== 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar === '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode !== 8) {
            this.snn_validate(event.target);
        }
    }

    public snn_validate(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length === 0 || phoneNumDigits.length === 8;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['ssnitin'].setValue(
                phoneNumDigits.substring(0, 3) +
                '-' +
                phoneNumDigits.substring(3, 5) +
                '-' +
                phoneNumDigits.substring(4)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['ssnitin'].setValue(
                phoneNumDigits.substring(0, 3) + '-' + phoneNumDigits.substring(3)
            );
        }
    }

    public cosnn_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode != 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar == '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode != 8) {
            this.snn_validate(event.target);
        }
    }

    public cosnn_validate(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length == 0 || phoneNumDigits.length == 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['cassnitin'].setValue(
                phoneNumDigits.substring(0, 3) +
                '-' +
                phoneNumDigits.substring(3, 5) +
                '-' +
                phoneNumDigits.substring(5)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['cassnitin'].setValue(
                phoneNumDigits.substring(0, 3) + '-' + phoneNumDigits.substring(3)
            );
        }
    }

    public keyPressdate(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode != 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar == '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode != 8) {
            this.validatedate(event.target);
        }
    }

    public validatedate(field: any) {
        var ssnitinDigits = field.value.replace(/\D/g, '');
        this.isValidFlg = ssnitinDigits.length == 0 || ssnitinDigits.length == 9;
        if (ssnitinDigits.length >= 6) {
            this.autofiForm.controls['ssnitin'].setValue(
                ssnitinDigits.substring(0, 3) +
                '-' +
                ssnitinDigits.substring(3, 5) +
                '-' +
                ssnitinDigits.substring(5)
            );
        } else if (ssnitinDigits.length >= 3) {
            this.autofiForm.controls['ssnitin'].setValue(
                +ssnitinDigits.substring(0, 3) + '-' + ssnitinDigits.substring(3)
            );
        }
    }

    public fnCheckCoapplicant(event: any) {
        if (event.value === 'yes') {
            this.dialog.open(ConfirmCoApplicantDialogComponent, {
                panelClass: ['inWidget', 'inWidget-main', 'maritalConfirmation'],
            });
        }
    }

    public sameAsPrimary() {
        this.formValues$ = this.store.pipe(select((state: any) => state?.appForm?.contactFormValues));
        this.formValues$.subscribe((resp) => {
            if (resp !== null && resp !== undefined) {
                this.autofiForm.controls['caaddress'].setValue(resp.address);
                this.autofiForm.controls['caapt'].setValue(resp.apt);
                this.autofiForm.controls['cacity'].setValue(resp.city);
                this.autofiForm.controls['castate'].setValue(resp.state);
                this.autofiForm.controls['cazipcode'].setValue(resp.zipcode);
            }
        });
        this.cdr.detectChanges();
    }

    public coapplicant_keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.target);
        this.phoneFirstChar = event.currentTarget?.value.toString().charAt(1);
        if (
            (event.keyCode != 8 && !pattern.test(inputChar)) ||
            this.phoneFirstChar == '0'
        ) {
            event.preventDefault();
        }
        if (event.keyCode != 8) {
            this.coaplicant_validatePhoneNo(event.target);
        }
    }

    displayDate: any;
    cadisplayDate: any;
    public dateChange(event: any): boolean {
        const enteredDate = moment(event.value);
        const age = moment().diff(enteredDate, 'years', false);

        if (age < 18) {
            this.autofipayload.currentdateerror = 1;
            this.autofipayload.currentdateerrorText = 'Age must be above 18 years';
        } else if (age > 119) {
            this.autofipayload.currentdateerror = 2;
            this.autofipayload.currentdateerrorText = 'Please enter a valid DOB (age must be less than 120 years)';
        } else {
            this.autofiForm.get('date')?.setValue(event.value);
            this.displayDate = enteredDate.format('YYYY/MM/DD');
        }

        return this.autofipayload.currentdateerror === 0;
    }

    public coapplicant_dateChange(event: any): boolean {
        const enteredDate = moment(event.value);
        const age = moment().diff(enteredDate, 'years', false);

        if (age < 18) {
            this.autofipayload.co_currentdateerror = 1;
            this.autofipayload.co_currentdateerrorText = 'Age must be above 18 years';
        } else if (age > 119) {
            this.autofipayload.co_currentdateerror = 2;
            this.autofipayload.co_currentdateerrorText = 'Please enter a valid DOB (age must be less than 120 years)';
        } else {
            this.autofiForm.get('cadate')?.setValue(event.value);
            this.cadisplayDate = enteredDate.format('YYYY/MM/DD');
        }
        var d = new Date(event.value),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        this.autofipayload.co_currentdateAPI = [year, month, day].join('-');
        return this.autofipayload.co_currentdateerror === 0;
    }

    public coaplicant_validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');

        this.isValidFlg = phoneNumDigits.length == 0 || phoneNumDigits.length == 10;

        if (phoneNumDigits.length >= 6) {
            this.autofiForm.controls['caphonenumber'].setValue(
                '(' +
                phoneNumDigits.substring(0, 3) +
                ')' +
                phoneNumDigits.substring(3, 6) +
                '-' +
                phoneNumDigits.substring(6)
            );
        } else if (phoneNumDigits.length >= 3) {
            this.autofiForm.controls['caphonenumber'].setValue(
                '(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3)
            );
        }
    }

    public validatefloat(event: any) {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', '.', 'Decimal'];
        const isNumberKey = event.key >= '0' && event.key <= '9';

        if (allowedKeys.includes(event.key) || isNumberKey) {
            if (event.key === '.' && event.target.value.includes('.')) {
                event.preventDefault();
            }
        } else {
            event.preventDefault();
        }
    }


    close() {
        this.showautofi = 0;
    }

    public encrypt(input: any): any {
        let keyObj = CryptoJS.enc.Utf8.parse(this.keyphrase);
        let encryptedtext = encodeURIComponent(
            CryptoJS.AES.encrypt(input, keyObj, {
                iv: CryptoJS.enc.Hex.parse(this.keyphrase),
            }).toString()
        );
        return encryptedtext;
    }

    public form_submitted = 0;

    public paymentOptionSubscription() {
        // this.store
        //     .pipe(select(getPaymentOptionsState), takeUntil(this.unsubscribe$))
        //     .subscribe((data: any) => {
        //         if (data !== undefined) {
        //             let obj = JSON.parse(JSON.stringify(data));
        //             this.leaserange = obj.paymentOption?.lease?.data;
        //             this.financerange = obj.paymentOption?.finance?.data;

        //             this.leaserange = this.leaserange;
        //             this.financerange = this.financerange;
        //         }
        //     });
    }

    accessoriesInfo: any;
    public accessoriesSubscription() {
        this.accessoriesInfo = DataHandler.accessoriesInfo;
    }

    public financeSubscription() {
        this.store.pipe(select(getFinanceDetailsState), takeUntil(this.unsubscribe$)).subscribe((data: any) => {
            if (data !== null && data !== undefined) {
                let obj = JSON.parse(JSON.stringify(data));
                if (obj?.financeDetails !== null && obj?.financeDetails !== undefined) {
                    this.financeTerm = obj?.financeDetails?.request?.terms;
                    this.financeAprRate = obj?.financeDetails?.request?.apr_rate ? obj?.financeDetails?.request?.apr_rate : 0;
                    this.financeMileage = obj?.financeDetails?.request?.mileage;
                    this.financeEstNetPrice = obj?.financeDetails?.request?.vin_details?.internetPrice;
                    this.financeDealerDiscount = obj?.financeDetails?.payload_calculation?.discount_amount;
                    this.financeAdjustedCost = obj?.financeDetails?.payload_calculation?.adjusted_cost;
                    this.financeSandP = obj?.financeDetails?.payload_service_protection?.total_sp;
                    this.financeMonthly_payment = obj?.financeDetails?.payload_calculation?.monthly_payment;
                    this.financeCountryCity = obj?.financeDetails?.request?.customer_county_city;
                    this.financecredit_score = obj?.financeDetails?.request?.credit_score
                    const tradeValue = obj?.financeDetails?.request?.trade_value ?? 0;
                    this.financeTradein = tradeValue;
                    this.financemsrp = obj?.financeDetails?.request?.msrp;
                    this.financeTotal_taxes = obj?.financeDetails?.payload_taxes?.feedetails?.total ? obj?.financeDetails?.payload_taxes?.feedetails?.total : '';
                    this.financeTotal_fee = obj?.financeDetails?.total_fee ? obj?.financeDetails?.total_fee : '';
                    this.financeTaxRate = obj?.financeDetails?.payload_taxes?.tax_rate,
                        this.financecustomer_zipcode = obj?.financeDetails?.request?.customer_zipcode;
                    this.financecustomer_state = obj?.financeDetails?.request?.customer_state;
                    this.financeTotalIncentives = obj?.financeDetails?.payload_calculation?.incentives;
                    this.financeTotalConditionalOffers = obj?.financeDetails?.payload_calculation?.conditional_offers;
                    this.financeTiers = obj?.financeDetails?.request?.tiers;
                    this.financedafaultterm = obj?.financeDetails?.payload_calculation?.default_term;
                    this.finance_payload_autofi_taxes_fees = obj?.financeDetails?.payload_autofi_taxes_fees?.fee_list;
                    const incentiveOffers = obj?.financeDetails?.payload_incentives?.allmanmoney;
                    if (incentiveOffers && typeof incentiveOffers === 'object' && Object.keys(incentiveOffers).length > 0) {
                        this.financeIncentives = Object.values(incentiveOffers).map((offer: any) => ({
                            programName: offer.programName,
                            amount: offer.amount.toString()
                        }));
                    }

                    this.financeDownPayment = obj?.financeDetails?.payload_calculation?.monthly_payment

                    this.financedpPercent = parseFloat(obj?.financeDetails?.payload_calculation?.dp_percentage);
                    this.financedpPercent = (obj?.financeDetails?.payload_calculation?.dp_percentage);
                    if (this.financedpPercent == 0 || this.financedpPercent == 0.00) {
                        this.financedpPercent = 10;
                    }
                    this.financeDownPayment = (this.financemsrp * this.financedpPercent) / 100;
                    this.financeTaxes_fees = obj?.financeDetails?.total_taxs_and_fees;

                    const incentiveOffersIds = obj?.financeDetails?.payload_incentives?.selected_allmanmoney;
                    if (incentiveOffersIds && typeof incentiveOffersIds === 'object' && Object.keys(incentiveOffers).length > 0) {
                        let selectedFinanceincentiveIds = (Object.keys(incentiveOffersIds)).map(Number);
                        if (this.selectedFinanceEcoProgramId?.length > 0) {
                            this.selectedFinanceEcoProgramId.push(...selectedFinanceincentiveIds);
                        } else {
                            this.selectedFinanceEcoProgramId = selectedFinanceincentiveIds;
                        }
                    }

                    let conditionalOffers = obj?.financeDetails?.payload_incentives?.selected_conditional_offer;
                    if (conditionalOffers && typeof conditionalOffers === 'object' && !Array.isArray(conditionalOffers)) {
                        conditionalOffers = [conditionalOffers];
                    }
                    this.selectedFinanceconditionalOffers = conditionalOffers?.map((offer: any) => {
                        const key = Object.keys(offer)[0];
                        return {
                            programName: offer[key].programName,
                            amount: offer[key].amount
                        };
                    });

                    const conditionalOffersGroupIds = obj?.financeDetails?.payload_incentives?.selected_conditional_offer;
                    if (conditionalOffersGroupIds && typeof conditionalOffersGroupIds === 'object') {
                        let selectedFinanceCondOfferIds = (Object.keys(conditionalOffersGroupIds)).map(Number);
                        if (this.selectedFinanceEcoProgramId?.length > 0) {
                            this.selectedFinanceEcoProgramId.push(...selectedFinanceCondOfferIds);
                        } else {
                            this.selectedFinanceEcoProgramId = selectedFinanceCondOfferIds;
                        }
                    }
                }
            }
        });
    }


    public check_enabled_lease(programId: number, type: number): number {
        let temp;
        if (type === 1)
            temp =
                this.leasedetails?.leaseDetails?.payload_incentives
                    .selected_allmanmoney;
        else if (type === 2)
            temp =
                this.leasedetails?.leaseDetails?.payload_incentives
                    .selected_conditional_offer;

        for (let i in temp) {
            let program: number = temp[i].programId;
            if (program == programId) {
                return 1;
            }
        }

        if (
            this.leasedetails?.leaseDetails?.payload_incentives.selected_allmanmoney
                .length === 0 &&
            type === 1
        )
            return -1;

        return 0;
    }

    public check_noneligible_lease(programId: number, type: number): number {
        let temp;
        if (type == 1)
            temp =
                this.leasedetails?.leaseDetails?.payload_allmanmoney_stackability
                    ?.noneligible;
        else
            temp =
                this.leasedetails?.leaseDetails?.payload_stackability_incentives
                    ?.noneligible;

        for (let i in temp) {
            var program: number = temp[i];
            if (programId === 9999999999) {
                return 0;
            }
            if (program === programId) {
                return 1;
            }
        }
        return 0;
    }

    public tradeinSubscription() {
        this.tradeinmake = DataHandler.tradeinmake;
        this.tradeinmodel = DataHandler.tradeinmodel;
        this.tradeinyear = DataHandler.tradeinyear;
        this.tradeinstyle = DataHandler.tradeinstyle;
        this.tradeinzip = DataHandler.tradeinzip;
        this.tradeinmileage = DataHandler.tradeinmileage;
        this.tradeincondition = DataHandler.tradeincondition;
        this.tradeinValue = DataHandler.tradeinvalue;
    }

    public getLeaseDetailsSubscription() {
        this.store
            .pipe(select(getLeaseDetailsState), takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {
                if (data !== null && data !== undefined) {
                    this.leasedetails = data.leaseDetails;
                    this.financeTerm = this.leasedetails?.request?.terms;
                    this.financeAprRate = this.leasedetails?.apr_rate ? this.leasedetails?.leaseInfoResp?.apr_rate : 0;
                    this.financeMileage = this.leasedetails?.request?.mileage;
                    this.financeEstNetPrice = this.leasedetails?.request?.vin_details?.internetPrice;
                    this.financeDealerDiscount = this.leasedetails?.payload_calculation?.discount_amount;
                    this.financeAdjustedCost = this.leasedetails?.payload_calculation?.adjusted_cost;
                    this.financeSandP = this.leasedetails?.payload_service_protection?.total_sp;
                    this.financeMonthly_payment = this.leasedetails?.payload_calculation?.monthly_payment;
                    this.financeCountryCity = this.leasedetails?.request?.customer_county_city;
                    this.financecredit_score = this.leasedetails?.request?.credit_score
                    const tradeValue = this.leasedetails?.request?.trade_value ?? 0;
                    this.financeTradein = tradeValue;
                    this.financemsrp = this.leasedetails?.request?.msrp;
                    this.financeTotal_taxes = this.leasedetails?.total_tax ? this.leasedetails?.total_tax : '';
                    this.financeTotal_fee = this.leasedetails?.total_fee ? this.leasedetails?.total_fee : '';
                    this.financeTaxRate = this.leasedetails?.payload_taxes?.tax_rate,
                        this.financecustomer_zipcode = this.leasedetails?.request?.customer_zipcode;
                    this.financecustomer_state = this.leasedetails?.request?.customer_state;
                    this.financeTotalIncentives = this.leasedetails?.payload_calculation?.incentives;
                    this.financeTotalConditionalOffers = this.leasedetails?.payload_calculation?.conditional_offers;
                    this.financeTiers = this.leasedetails?.request?.tiers;
                    this.financedafaultterm = this.leasedetails?.payload_calculation?.default_term;
                    const incentiveOffers = this.leasedetails?.payload_incentives?.allmanmoney;
                    this.leasedafaultterm = this.leasedetails?.request?.terms;
                    this.leasemileage = this.leasedetails?.request?.mileage;
                    if (incentiveOffers && typeof incentiveOffers === 'object' && Object.keys(incentiveOffers).length > 0) {
                        this.financeIncentives = Object.values(incentiveOffers).map((offer: any) => ({
                            programName: offer.programName,
                            amount: offer.amount.toString()
                        }));
                    }

                    this.financeDownPayment = this.leasedetails?.payload_calculation?.down_value

                    this.financedpPercent = parseFloat(this.leasedetails?.payload_calculation?.dp_percentage);
                    this.financedpPercent = (this.leasedetails?.payload_calculation?.dp_percentage);
                    if (this.financedpPercent == 0 || this.financedpPercent == 0.00) {
                        this.financedpPercent = 10;
                    }
                    this.financeTaxes_fees = this.leasedetails?.total_taxs_and_fees;

                    const incentiveOffersIds = this.leasedetails?.payload_incentives?.selected_allmanmoney;
                    if (incentiveOffersIds && typeof incentiveOffersIds === 'object' && Object.keys(incentiveOffers).length > 0) {
                        let selectedFinanceincentiveIds = (Object.keys(incentiveOffersIds)).map(Number);
                        if (this.selectedFinanceEcoProgramId?.length > 0) {
                            this.selectedFinanceEcoProgramId.push(...selectedFinanceincentiveIds);
                        } else {
                            this.selectedFinanceEcoProgramId = selectedFinanceincentiveIds;
                        }
                    }

                    let conditionalOffers = this.leasedetails?.payload_incentives?.selected_conditional_offer;
                    if (conditionalOffers && typeof conditionalOffers === 'object' && !Array.isArray(conditionalOffers)) {
                        conditionalOffers = [conditionalOffers];
                    }
                    this.selectedFinanceconditionalOffers = conditionalOffers?.map((offer: any) => {
                        const key = Object.keys(offer)[0];
                        return {
                            programName: offer[key].programName,
                            amount: offer[key].amount
                        };
                    });

                    const conditionalOffersGroupIds = this.leasedetails?.payload_incentives?.selected_conditional_offer;
                    if (conditionalOffersGroupIds && typeof conditionalOffersGroupIds === 'object') {
                        let selectedFinanceCondOfferIds = (Object.keys(conditionalOffersGroupIds)).map(Number);
                        if (this.selectedFinanceEcoProgramId?.length > 0) {
                            this.selectedFinanceEcoProgramId.push(...selectedFinanceCondOfferIds);
                        } else {
                            this.selectedFinanceEcoProgramId = selectedFinanceCondOfferIds;
                        }
                    }
                    this.financemsrp = this.leasedetails.request?.msrp;
                    this.oem_model_code =
                        this.leasedetails.request?.vin_details?.oem_model_code;

                    let arMonthlyPayment =
                        this.leasedetails?.payload_calculation?.monthly_payment.split(
                            '-'
                        );
                    this.leasedownpayment = 0;

                    if (arMonthlyPayment !== undefined) {
                        this.leasemonthlycost = Number(
                            arMonthlyPayment[0].toString().replaceAll(',', '')
                        );
                        this.leasedownpayment = Math.floor(Number(arMonthlyPayment[1]));
                    }

                    this.lease_has_vauto_dlr_disc = false;
                    if (
                        this.leasedetails?.has_vauto_dlr_disc ||
                        (this.vauto_list_price !== undefined &&
                            this.vauto_list_price !== '')
                    ) {
                        this.lease_has_vauto_dlr_disc = this.lease_has_vauto_dlr_disc =
                            true;
                    }

                    this.max_list_price = this.leasedetails?.max_list_price;
                    this.lease_has_max_digital_dlr_disc = false;
                    if (this.max_list_price !== undefined && this.max_list_price !== '') {
                        this.lease_has_max_digital_dlr_disc =
                            this.lease_has_max_digital_dlr_disc = true;
                    }
                    this.leaseserviceprotection =
                        this.leasedetails.payload_service_protection?.service_protection_list;

                    if (
                        this.leasedetails?.payload_service_protection
                            ?.service_protection_list !== ''
                    ) {
                        this.leaseserviceprotection =
                            this.leasedetails?.payload_service_protection?.service_protection_list;
                    } else {
                        this.leaseserviceprotection = [];
                    }

                    this.leaseserviceprotection = this.leaseserviceprotection;
                    this.lease_payload_autofi_taxes_fees =
                        this.leasedetails.payload_autofi_taxes_fees?.fee_list;
                    this.leasefees =
                        this.leasedetails?.payload_autofi_taxes_fees?.fee_total;
                    this.leaseTaxRate =
                        this.leasedetails?.payload_autofi_taxes_fees?.tax_rate;
                }
                this.lease_payload_mopar_accessries =
                    this.leasedetails.payload_mopar_accessries?.accessories;
                for (
                    let i = 0;
                    i <
                    this.leasedetails.payload_calculation
                        ?.available_tiers_options.length;
                    i++
                ) {
                    if (i === 0) {
                        this.txt = 'Excellent';
                    } else if (i === 1) {
                        this.txt = 'Very Good';
                    } else if (i === 2) {
                        this.txt = 'Good';
                    } else if (i === 3) {
                        this.txt = 'Fair';
                    } else if (i === 4) {
                        continue;
                    }
                    if (
                        this.leaserange !== undefined
                    ) {
                        this.leaserangearr?.push({
                            code: this.leaserange[i]?.code,
                            low: this.leaserange[i]?.ficoLow,
                            high: this.leaserange[i]?.ficoHigh,
                            txtdisp: this.txt,
                        });
                    }
                }


                if (
                    this.leasedetails.payload_calculation?.trade_value ===
                    null
                ) {
                    this.leasetradein = '0';
                    this.financetradein = '0';
                } else {
                    this.leasetradein = formatNumber(
                        this.leasedetails.payload_calculation?.trade_value,
                        this.locale,
                        '1.0-0'
                    );
                }
                this.listingdata =
                    this.leasedetails?.payload_incentives?.allmanmoney;
                let arMonthlyPayment =
                    this.leasedetails.payload_calculation?.monthly_payment.split(
                        '-'
                    );


                if (arMonthlyPayment !== undefined) {
                    this.leaseAmountForDisplay = this.monthlycost = Number(
                        arMonthlyPayment[0].toString().replaceAll(',', '')
                    );
                    this.leasedownpayment = Math.floor(Number(arMonthlyPayment[1]));
                }

                // section to extract the select inventory bonus cash file
                this.listingdata =
                    this.leasedetails.payload_incentives?.incentivesbonuscashlist;
                for (let i in this.listingdata) {
                    this.incentivedata.push({
                        programId: this.listingdata[i].program_id,
                        programName: this.listingdata[i].name,
                        programRules: this.listingdata[i].disclaimer,
                        amount: this.listingdata[i].discount,
                        checked: -1,
                        programNumber: this.listingdata[i].programNumber,
                    });
                }
                this.leaseIncentivedata = this.incentivedata;
                this.listingdata =
                    this.leasedetails.payload_incentives?.conditional_offers_group;
                let arRebetProgramID = [];
                let vRebetProgramID =
                    this.leasedetails.request?.vRebetProgramID;
                if (vRebetProgramID !== undefined && vRebetProgramID !== '') {
                    arRebetProgramID = vRebetProgramID.split(',');
                }

                this.leasetradein = this.leasetradein.trim();
            });
    }

    checkObjectAndReturn(obj: any): any {
        const { vin, ...rest } = obj;

        const areAllOtherPropsNull = Object.values(rest).every(value => value === null || value === undefined);

        if (areAllOtherPropsNull) {
            return {};
        } else {
            return obj;
        }
    }

    public apicall() {
        if (this.activeTab === 'lease') {
            this.getSandPSubscription();
        } else {
            this.getSandPSubscriptionFinance();
        }
        this.autofipayload.url = '';
        this.autofipayload.message = '';
        this.autofipayload.code = 0;
        let grossIncome = 0;
        let arOtherIncomeForAPI: any = [];
        if (
            this.autofipayload.employestatus === 'Employed' ||
            this.autofipayload.employestatus === 'self-Employed' ||
            this.autofipayload.employestatus === 'military'
        ) {
            grossIncome = this.autofipayload.totalAmountPaid;
        } else {
            grossIncome = 0;
        }
        for (let i = 0; i < this.autofipayload.otherincome.length; i++) {
            let arOtherIncome: any = {};
            let otherGrossIncome = 0;
            if (this.autofipayload.otherincome[i].financetiers === 'Monthly') {
                otherGrossIncome =
                    parseFloat(this.autofipayload.otherincome[i].grossIncome) * 1;
            } else if (this.autofipayload.otherincome[i].financetiers === 'Weekly') {
                otherGrossIncome =
                    parseFloat(this.autofipayload.otherincome[i].grossIncome) * 4.33;
            } else if (
                this.autofipayload.otherincome[i].financetiers === 'Bi-Weekly'
            ) {
                otherGrossIncome =
                    parseFloat(this.autofipayload.otherincome[i].grossIncome) * 2.17;
            } else if (this.autofipayload.otherincome[i].financetiers === 'Annual') {
                otherGrossIncome =
                    parseFloat(this.autofipayload.otherincome[i].grossIncome) / 12;
            }
            arOtherIncome.amount = Math.round(otherGrossIncome);
            arOtherIncome.source = this.autofipayload.otherincome[i].incomeSource;
            arOtherIncomeForAPI.push(arOtherIncome);
        }

        let fees: any = [];
        let amount = 0.0;
        let arProducts: any = [];
        let arRebates: any = [];
        let creditScore = 300;
        let financetier = 'EXCELLENT';
        if (this.activeTab === 'lease') {
            this.financeDetails = {
                msrp: this.financemsrp?.toString(),
                transaction_type: this.activeTab,
                term: this.financeTerm?.toString(),
                mileage: this.financeMileage,
                apr_rate: this.financeAprRate?.toString(),
                downpayment: this.financeDownPayment?.toString(),
                tradein: this.financeTradein?.toString(),
                total_incentives: this.financeTotalIncentives?.toString(),
                total_conditional_offer: this.financeTotalConditionalOffers?.toString(),
                service_protection: this.financeSandP,
                dealer_discount: this.financeDealerDiscount?.toString(),
                taxes_fees: parseFloat(this.financeTaxes_fees?.toString()),
                monthly_payment: this.financeMonthly_payment?.toString().split('-')[0],
                adjusted_cost: this.financeAdjustedCost?.replaceAll(',', '').toString(),
                est_net_price: this.financeEstNetPrice?.toString(),
                customer_zipcode: this.financecustomer_zipcode?.toString(),
                customer_state: this.financecustomer_state,
                customer_county_city: this.financeCountryCity,
                credit_score: this.financecredit_score?.toString(),
                tiers: this.financeTiers?.toString(),
                incentives: this.financeIncentives,
                conditional_offer: this.selectedFinanceconditionalOffers,
                total_taxes: this.financeTotal_taxes,
                total_fee: this.financeTotal_fee,
                taxRate: parseFloat(this.financeTaxRate),
                due_at_signing: this.dueAtSigning
            }
            for (let i = 0; i < this.leaserange?.length; i++) {
                if (this.financetier === this.financerange[i].code) {
                    creditScore = this.leaserange[i].ficoLow;
                }
            }
            amount = parseFloat(this.leasetradein);

            for (
                let i = 0;
                i < this.lease_payload_autofi_taxes_fees?.length;
                i++
            ) {
                let arFees: any = {};
                arFees.amount = Number(
                    this.lease_payload_autofi_taxes_fees[i].Amount
                );
                if (this.lease_payload_autofi_taxes_fees[i].is_tax === 1) {
                    arFees.code = 'TITLE_REG';
                } else {
                    if (
                        this.lease_payload_autofi_taxes_fees[i].FeeCategory ===
                        'doc fees'
                    ) {
                        arFees.code = 'DOC_FEE';
                    } else {
                        arFees.code = 'OTHER';
                    }
                }
                arFees.name = this.lease_payload_autofi_taxes_fees[i].FeeName;
                if (
                    this.lease_payload_autofi_taxes_fees[i].payment_mode ===
                    'due_upfront'
                ) {
                    arFees.feePlacement = 'DUE_AT_SIGNING';
                } else if (
                    this.lease_payload_autofi_taxes_fees[i].payment_mode ===
                    'in_lease'
                ) {
                    arFees.feePlacement = 'GROSS_CAP';
                }
                fees.push(arFees);
            }

            for (let i = 0; i < this.leaseserviceprotection?.length; i++) {
                let products: any = {};
                products.referenceId = '23b605f6-2a9e-11ec-8d3d-0242ac130003';
                products.name = this.leaseserviceprotection[i].title;
                products.category = 'OTHER';
                products.isTaxable = false;
                products.tax = 0;
                products.termMonths = 0;
                products.termMiles = 0;
                products.price = parseFloat(
                    this.leaseserviceprotection[i].Amount
                );
                arProducts.push(products);
            }
            for (
                let i = 0;
                i < this.lease_payload_mopar_accessries?.length;
                i++
            ) {
                let products: any = {};
                products.referenceId = '23b605f6-2a9e-11ec-8d3d-0242ac130003';
                products.name = this.lease_payload_mopar_accessries[i].title;
                products.category = 'OTHER';
                products.isTaxable = false;
                products.tax = 0;
                products.termMonths = 0;
                products.termMiles = 0;
                products.price = parseFloat(
                    this.lease_payload_mopar_accessries[i].msrp
                );
                arProducts.push(products);
            }

            let isDiscount = false;
            if (
                this.lease_has_max_digital_dlr_disc ||
                this.lease_has_vauto_dlr_disc
            ) {
                isDiscount = true;
            }

            for (let i = 0; i < this.conditionalLeaseDataToShow?.length; i++) {
                for (
                    let f = 0;
                    f < this.conditionalLeaseDataToShow[i].data?.length;
                    f++
                ) {
                    if (this.conditionalLeaseDataToShow[i].data[f].isChecked) {
                        let rebates: any = {};
                        rebates.name = this.conditionalLeaseDataToShow[i].name;
                        rebates.programId =
                            this.conditionalLeaseDataToShow[i].data[f].programNumber;
                        rebates.amount =
                            this.conditionalLeaseDataToShow[i].data[f].amount;
                        rebates.disclaimer =
                            this.conditionalLeaseDataToShow[i].data[f].programRules;
                        rebates.isDiscount = isDiscount;
                        rebates.isPrivateOffer = false;
                        rebates.isQualifiedOffer = true;
                        rebates.type = 'CASH';
                        arRebates.push(rebates);
                    }
                }
            }
            for (let i = 0; i < this.leaseIncentivedata?.length; i++) {
                if (this.leaseIncentivedata[i].checked === 1) {
                    let rebates: any = {};
                    rebates.name = this.leaseIncentivedata[i].programName;
                    rebates.programId = this.leaseIncentivedata[i].programNumber;
                    rebates.amount = this.leaseIncentivedata[i].amount;
                    rebates.disclaimer = this.leaseIncentivedata[i].programRules;
                    rebates.isDiscount = isDiscount;
                    rebates.isPrivateOffer = false;
                    rebates.isQualifiedOffer = false;
                    rebates.type = 'CASH';
                    arRebates.push(rebates);
                }
            }
        } else if (this.activeTab === 'finance') {
            this.financeDetails = {
                msrp: this.financemsrp?.toString(),
                transaction_type: this.activeTab,
                term: this.financeTerm?.toString(),
                mileage: this.financeMileage,
                apr_rate: this.financeAprRate?.toString(),
                downpayment: this.financeDownPayment?.toString(),
                tradein: this.financeTradein?.toString(),
                total_incentives: this.financeTotalIncentives?.toString(),
                total_conditional_offer: this.financeTotalConditionalOffers?.toString(),
                service_protection: this.financeSandP,
                dealer_discount: this.financeDealerDiscount?.toString(),
                taxes_fees: parseFloat(this.financeTaxes_fees?.toString()),
                monthly_payment: this.financeMonthly_payment?.toString().split('-')[0],
                adjusted_cost: this.financeAdjustedCost?.replaceAll(',', '').toString(),
                est_net_price: this.financeEstNetPrice?.toString(),
                customer_zipcode: this.financecustomer_zipcode?.toString(),
                customer_state: this.financecustomer_state,
                customer_county_city: this.financeCountryCity,
                credit_score: this.financecredit_score?.toString(),
                tiers: this.financeTiers?.toString(),
                incentives: this.financeIncentives,
                conditional_offer: this.selectedFinanceconditionalOffers,
                total_taxes: this.financeTotal_taxes,
                total_fee: this.financeTotal_fee,
                taxRate: parseFloat(this.financeTaxRate),
                due_at_signing: this.dueAtSigningFinVal
            }
            for (let i = 0; i < this.financerange?.length; i++) {
                if (this.financetier == this.financerange[i].code) {
                    financetier = this.financerange[i].description.toUpperCase();
                    if (financetier === 'VERY GOOD') {
                        financetier = 'VERY_GOOD';
                    }
                    creditScore = this.financerange[i].ficoLow;
                }
            }
            amount = parseFloat(this.financetradein);
            for (
                let i = 0;
                i < this.finance_payload_autofi_taxes_fees?.length;
                i++
            ) {
                let arFees: any = {};
                arFees.amount = Number(
                    this.finance_payload_autofi_taxes_fees[i].Amount
                );
                if (this.finance_payload_autofi_taxes_fees[i].is_tax === 1) {
                    arFees.code = 'TITLE_REG';
                } else {
                    if (
                        this.finance_payload_autofi_taxes_fees[i].FeeCategory ===
                        'doc fees'
                    ) {
                        arFees.code = 'DOC_FEE';
                    } else {
                        arFees.code = 'OTHER';
                    }
                }
                arFees.name = this.finance_payload_autofi_taxes_fees[i].FeeName;
                fees.push(arFees);
            }

            for (let i = 0; i < this.financeserviceprotection?.length; i++) {
                let products: any = {};
                products.referenceId = '23b605f6-2a9e-11ec-8d3d-0242ac130003';
                products.name = this.financeserviceprotection[i].title;
                products.category = 'OTHER';
                products.isTaxable = false;
                products.tax = 0;
                products.termMonths = 0;
                products.termMiles = 0;
                products.price = parseFloat(
                    this.financeserviceprotection[i].Amount
                );
                arProducts.push(products);
            }
            for (
                let i = 0;
                i < this.finance_payload_mopar_accessries?.length;
                i++
            ) {
                let products: any = {};
                products.referenceId = '23b605f6-2a9e-11ec-8d3d-0242ac130003';
                products.name = this.finance_payload_mopar_accessries[i].title;
                products.category = 'OTHER';
                products.isTaxable = false;
                products.tax = 0;
                products.termMonths = 0;
                products.termMiles = 0;
                products.price = parseFloat(
                    this.finance_payload_mopar_accessries[i].msrp
                );
                arProducts.push(products);
            }
            let isDiscount = false;
            if (
                this.finance_has_max_digital_dlr_disc ||
                this.finance_has_vauto_dlr_disc
            ) {
                isDiscount = true;
            }
            for (
                let i = 0;
                i < this.conditionalFinanceDataToShow?.length;
                i++
            ) {
                for (
                    let f = 0;
                    f < this.conditionalFinanceDataToShow[i].data?.length;
                    f++
                ) {
                    if (this.conditionalFinanceDataToShow[i].data[f].isChecked) {
                        let rebates: any = {};
                        rebates.name = this.conditionalFinanceDataToShow[i].name;
                        rebates.programId =
                            this.conditionalFinanceDataToShow[i].data[f].programNumber;
                        rebates.amount =
                            this.conditionalFinanceDataToShow[i].data[f].amount;
                        rebates.disclaimer =
                            this.conditionalFinanceDataToShow[i].data[f].programRules;
                        rebates.isDiscount = isDiscount;
                        rebates.isPrivateOffer = false;
                        rebates.isQualifiedOffer = true;
                        rebates.type = 'CASH';
                        arRebates.push(rebates);
                    }
                }
            }
            for (let i = 0; i < this.financeincentivedata?.length; i++) {
                if (this.financeincentivedata[i].checked === 1) {
                    let rebates: any = {};
                    rebates.name = this.financeincentivedata[i].programName;
                    rebates.programId = this.financeincentivedata[i].programNumber;
                    rebates.amount = this.financeincentivedata[i].amount;
                    rebates.disclaimer = this.financeincentivedata[i].programRules;
                    rebates.isDiscount = isDiscount;
                    rebates.isPrivateOffer = false;
                    rebates.isQualifiedOffer = false;
                    rebates.type = 'CASH';
                    arRebates.push(rebates);
                }
            }
        }

        let tradeInCondition = '';
        if (DataHandler.tradeincondition === 'average') {
            tradeInCondition = 'GOOD';
        } else if (DataHandler.tradeincondition !== null) {
            tradeInCondition = DataHandler.tradeincondition?.toUpperCase();
        }

        let tradeinInfo = {
            odometer: this.tradeinmileage,
            condition: this.tradeincondition,
            vin: this.vin,
            year: this.tradeinyear,
            make: this.tradeinmake,
            model: this.tradeinmodel,
            trim: this.tradeinTrim,
            status: this.tradeinvehicleType,
            value: this.tradeinValue,
            zipcode: this.tradeinZip
        };

        let formattedTradeinInfo = this.checkObjectAndReturn(tradeinInfo);

        let employee_phone = this.autofipayload.phone
            .replaceAll('(', '')
            .replaceAll(')', '')
            .replaceAll('-', '').replaceAll(' ', '');
        if (this.autofipayload.employee_phone === undefined) {
            this.autofipayload.employee_phone = '';
        } else {
            if (
                this.autofipayload.employee_phone
                    .replaceAll('(', '')
                    .replaceAll(')', '')
                    .replaceAll('-', '').replaceAll(' ', '') != ''
            ) {
                employee_phone = this.autofipayload.employee_phone
                    .replaceAll('(', '')
                    .replaceAll(')', '')
                    .replaceAll('-', '').replaceAll(' ', '');
            }
        }

        let jobTitle = 'string';
        if (this.autofipayload.employestatus === 'Employed') {
            jobTitle = this.autofipayload.employee_title;
        }

        if (this.autofipayload.employestatus === 'military') {
            jobTitle = this.autofipayload.employee_secondTitle;
        }

        if (this.autofipayload.employestatus === 'other') {
            jobTitle = this.autofipayload.employee_thirdTitle;
        }

        let employerName = 'string';
        if (
            this.autofipayload.employestatus === 'Employed' ||
            this.autofipayload.employestatus === 'other'
        ) {
            employerName = this.employerName;
        }
        let empResidenceTotalMonthAPI = 0;
        if (
            this.autofipayload.empResidenceTotalMonthAPI === '' ||
            this.autofipayload.empResidenceTotalMonthAPI === undefined ||
            this.autofipayload.empResidenceTotalMonthAPI === null
        ) {
            empResidenceTotalMonthAPI = 1;
        } else {
            empResidenceTotalMonthAPI = this.autofipayload.empResidenceTotalMonthAPI;
        }

        let employment: any;
        if (this.autofipayload.employestatus.toUpperCase() === 'STUDENT') {
            employment = {
                employerName: this.employerName,
                timeInMonths: empResidenceTotalMonthAPI,
                employmentStatus: this.autofipayload.employestatus
                    .toUpperCase()
                    .replaceAll('-', '_'),
                jobTitle: this.autofipayload.employee_institute,
            };
        } else if (
            this.autofipayload.employestatus === 'retired' ||
            this.autofipayload.employestatus === 'UNEmployed'
        ) {
            employment = {
                employerName: this.employerName,
                timeInMonths: empResidenceTotalMonthAPI,
                employmentStatus: this.autofipayload.employestatus
                    .toUpperCase()
                    .replaceAll('-', '_'),
                employerPhone: this.encrypt(employee_phone),
            };
        } else {
            if (this.employerName === undefined) {
                this.employerName = 'string';
            }
            employment = {
                employerName: this.employerName,
                timeInMonths: empResidenceTotalMonthAPI,
                employmentStatus: this.autofipayload.employestatus
                    .toUpperCase()
                    .replaceAll('-', '_'),
                employerPhone: this.encrypt(employee_phone),
                jobTitle: jobTitle,
            };
        }
        let residenceTotalMonthAPI = 0;
        if (
            this.autofipayload.residenceTotalMonthAPI === '' ||
            this.autofipayload.residenceTotalMonthAPI === undefined ||
            this.autofipayload.residenceTotalMonthAPI === null
        ) {
            residenceTotalMonthAPI = 1;
        } else {
            residenceTotalMonthAPI = this.autofipayload.residenceTotalMonthAPI;
        }

        let incentiveOption = 'LOWEST_MONTHLY';
        if (this.lowestType === 'lowest_price') {
            incentiveOption = 'LARGEST_REBATE';
        } else if (this.lowestType === 'lowest_apr') {
            incentiveOption = 'LOWEST_APR';
        } else if (this.lowestType === 'lowest_payment') {
            incentiveOption = 'LOWEST_MONTHLY';
        }

        // offerPreferences block
        if (this.activeTab === 'finance') {
            let term = Number(this.financedafaultterm);
            this.offerPreferences = {
                // apr: Number(this.financeapr) / 100,
                // incentiveOption: incentiveOption,
                // isSubvented: this.subventedProgramStatus,
                // creditBand: financetier,
                downPayment: parseInt(
                    typeof this.financeDownPayment === 'string' ? this.financeDownPayment.replace(/,/g, '') : this.financeDownPayment
                ),
                requestedOfferType: 'FINANCE',
                term: term,
                // annualMileage: 0
            };
            let financetaxes = this.financetaxes;
            if (this.financetaxes === undefined) {
                financetaxes = 0;
            }
            this.taxRate = financetaxes > 0 ? financetaxes : 0;
        } else if (this.activeTab === 'lease') {
            let term = Number(this.leasedafaultterm);
            this.offerPreferences = {
                downPayment: parseInt(
                    this.leasedownpayment?.toString().replaceAll(',', '')
                ),
                requestedOfferType: 'LEASE',
                annualMileage: Number(this.leasemileage),
                term: term,
            };
            let leaseTaxRate = parseFloat(this.leaseTaxRate);
            this.taxRate = leaseTaxRate > 0 ? leaseTaxRate : 0;
        }


        let payload: applyCreditPayload = {
            dealer_code: this.dealer_code,
            // vin: DataHandler.vin, //this.vin.toString(),
            // formTransactionID: AdobeAnalyticsHandler.generateFTID(),
            // serviceProtectionInfo: this.spDataArray !== undefined || this.spDataArray !== null ? this.spDataArray : [],
            // tradeinInfo: formattedTradeinInfo,
            // accessoriesInfo: this.accessoriesInfo !== null || this.accessoriesInfo !== undefined ? this.accessoriesInfo : [],
            // scheduleDeliveryInfo: this.scheduleDeliveryInfo !== undefined ? this.scheduleDeliveryInfo : [],
            // financeDetails: this.financeDetails !== undefined || this.financeDetails !== null ? this.financeDetails : null,
            applicant: {
                employment: employment,
                name: {
                    first: this.encrypt(this.autofipayload.firstname),
                    last: this.encrypt(this.autofipayload.lastname),
                },
                address: {
                    street: this.autofipayload.address ? this.autofipayload.address : '',
                    city: this.autofipayload.city ? this.autofipayload.city : '',
                    state: this.autofipayload.state ? this.autofipayload.state : '',
                    zip: this.autofipayload.zipcode ? this.autofipayload.zipcode : '',
                    residenceType: this.autofipayload.paymenttypeAPI,
                    residenceTimeInMonths: residenceTotalMonthAPI,
                    residenceMonthlyPayment: Number(this.autofipayload.payment)
                },
                phone: this.encrypt(
                    this.autofipayload.phone
                        .replaceAll('(', '')
                        .replaceAll(')', '')
                        .replaceAll('-', '').replaceAll(' ', '')
                ),
                email: this.encrypt(this.autofipayload.email),
                ssn: this.encrypt(
                    this.primarysstin?.replaceAll('-', '').replaceAll(' ', '')
                ), //
                maritalStatus: this.autofipayload.material_status,
                dob: this.autofipayload.currentdateAPI,
                employmentIncome: grossIncome,
                // creditScore: creditScore
            },
            vehicle: {
                age: 'NEW',
                bodyType: DataHandler.bodyType,
                color: DataHandler.boyColor,
                invoice: Number(DataHandler.msrp),
                make: DataHandler.make,
                model: DataHandler.model,
                modelCode: DataHandler.model,
                msrp: Number(DataHandler.msrp),
                trim: decodeURIComponent(DataHandler.trim),
                vin: DataHandler.vin,
                year: DataHandler.year,
                //   photoUrl: DataHandler.heroImage ? DataHandler.heroImage : '',
                dealerRetailPrice: Number(DataHandler.msrp),
            },
            callbackUrl: environment.BackendApi_Url + '/api/autoFiCallBackUrl',
            dealer: {
                code: this.autoFi_af_code,
            },
            offerPreferences: this.offerPreferences,
            taxRate: 0.07,//this.taxRate,
            tax: 0

        }

        let otherIncomeForAPI: any = {};
        if (arOtherIncomeForAPI !== null && arOtherIncomeForAPI !== '') {
            otherIncomeForAPI.otherIncome = arOtherIncomeForAPI;
            Object.assign(payload.applicant, otherIncomeForAPI);
        }

        if (fees.length > 0) {
            let arFees: any = {};
            arFees.fees = fees;
            Object.assign(payload, arFees);
        }

        if (arProducts.length > 0) {
            let productsForApi: any = {};
            productsForApi.products = arProducts;
            Object.assign(payload, productsForApi);
        }
        if (arRebates.length > 0) {
            let rebatesForApi: any = {};
            rebatesForApi.rebates = arRebates;
            Object.assign(payload, rebatesForApi);
        }
        if (
            this.autofipayload.payment === '' ||
            this.autofipayload.payment === undefined ||
            this.autofipayload.payment === null
        ) {
            this.autofipayload.payment = 0;
        }
        let prevEphone = this.autofipayload.phone
            .replaceAll('(', '')
            .replaceAll(')', '')
            .replaceAll('-', '').replaceAll(' ', '');
        if (
            this.autofipayload.prevEphone !== undefined &&
            this.autofipayload.prevEphone
                .replaceAll('(', '')
                .replaceAll(')', '')
                .replaceAll('-', '') !== ''
        ) {
            prevEphone = this.autofipayload.prevEphone
                .replace('(', '')
                .replace(')', '')
                .replace('-', '').replaceAll(' ', '');
        }

        if (
            this.addprevemployment === 1 &&
            this.autofipayload.prevEitle !== '' &&
            this.autofipayload.prevEitle !== null
        ) {
            let previousEmployment = {
                previousEmployment: {
                    timeInMonths: empResidenceTotalMonthAPI,
                    employerName: this.prevemployerName,
                    jobTitle: this.prevEtitle,
                    employerPhone: prevEphone,
                    employmentStatus: this.autofipayload.employestatus
                        .toUpperCase()
                        .replaceAll('-', '_'),
                },
            };
            Object.assign(payload.applicant, previousEmployment);
        }
        if (
            this.addprevaddress === 1 &&
            this.autofipayload.prevaddress !== null &&
            this.autofipayload.prevaddress !== ''
        ) {
            let previousAddress = {
                previousAddress: {
                    street: this.prevStreet,
                    street2: this.autofipayload.prevapt,
                    city: this.prevCity,
                    state: this.prevState,
                    zip: this.prevZipcode,
                    residenceType: this.autofipayload.paymenttypeAPI,
                    residenceTimeInMonths: empResidenceTotalMonthAPI,
                    residenceMonthlyPayment: Number(this.autofipayload.payment),
                },
            };
            Object.assign(payload.applicant, previousAddress);
        }

        // Co-applicant Block
        if (this.autofipayload.coapplicant === 'yes') {
            let co_grossIncome = 0;
            let co_arOtherIncomeForAPI: any = [];
            if (
                this.autofipayload.coapplicant_employestatus === 'Employed' ||
                this.autofipayload.coapplicant_employestatus === 'self-Employed' ||
                this.autofipayload.coapplicant_employestatus === 'military'
            ) {
                co_grossIncome = this.autofipayload.CoApplicanttotalAmountPaid;
            } else {
                co_grossIncome = 0;
            }
            for (
                let i = 0;
                i < this.autofipayload.CoApplicantotherincome?.length;
                i++
            ) {
                let co_arOtherIncome: any = {};
                let otherco_grossIncome = 0;
                if (
                    this.autofipayload.CoApplicantotherincome[i].financetiers === 'Monthly'
                ) {
                    otherco_grossIncome =
                        parseFloat(
                            this.autofipayload.CoApplicantotherincome[i].grossIncome
                        ) * 1;
                } else if (
                    this.autofipayload.CoApplicantotherincome[i].financetiers === 'Weekly'
                ) {
                    otherco_grossIncome =
                        parseFloat(
                            this.autofipayload.CoApplicantotherincome[i].grossIncome
                        ) * 4.33;
                } else if (
                    this.autofipayload.CoApplicantotherincome[i].financetiers ===
                    'Bi-Weekly'
                ) {
                    otherco_grossIncome =
                        parseFloat(
                            this.autofipayload.CoApplicantotherincome[i].grossIncome
                        ) * 2.17;
                } else if (
                    this.autofipayload.CoApplicantotherincome[i].financetiers === 'Annual'
                ) {
                    otherco_grossIncome =
                        parseFloat(
                            this.autofipayload.CoApplicantotherincome[i].grossIncome
                        ) / 12;
                }
                co_arOtherIncome.amount = Math.round(otherco_grossIncome);
                co_arOtherIncome.source =
                    this.autofipayload.CoApplicantotherincome[i].incomeSource;
                co_arOtherIncomeForAPI.push(co_arOtherIncome);
            }

            if (
                this.autofipayload.CoApplicantpayment === '' ||
                this.autofipayload.CoApplicantpayment === undefined ||
                this.autofipayload.CoApplicantpayment === null
            ) {
                this.autofipayload.CoApplicantpayment = 0;
            }

            if (this.autofipayload.CoApplicantemployee_phone === undefined) {
                this.autofipayload.CoApplicantemployee_phone = '';
            }

            let CoApplicantemployee_phone =
                this.autofipayload.CoApplicantphone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
            if (this.autofipayload.CoApplicantemployee_phone === undefined) {
                this.autofipayload.CoApplicantemployee_phone = '';
            } else {
                if (
                    this.autofipayload.CoApplicantemployee_phone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '') !== ''
                ) {
                    CoApplicantemployee_phone =
                        this.autofipayload.CoApplicantemployee_phone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
                }
            }

            let co_jobTitle = 'string';
            if (
                this.autofipayload.coapplicant_employestatus === 'Employed' ||
                this.autofipayload.coapplicant_employestatus === 'other'
            ) {
                co_jobTitle = this.autofipayload.CoApplicantemployee_title;
            }

            if (this.autofipayload.coapplicant_employestatus === 'military') {
                co_jobTitle = this.autofipayload.CoApplicantemployee_secondTitle;
            }

            let co_employerName = 'string';
            if (
                this.autofipayload.coapplicant_employestatus === 'Employed' ||
                this.autofipayload.coapplicant_employestatus === 'other'
            ) {
                co_employerName = this.autofipayload.CoApplicantemployer;
            }

            let CoApplicantempResidenceTotalMonthAPI = 0;
            if (
                this.autofipayload.CoApplicantempResidenceTotalMonthAPI === '' ||
                this.autofipayload.CoApplicantempResidenceTotalMonthAPI === undefined ||
                this.autofipayload.CoApplicantempResidenceTotalMonthAPI === null
            ) {
                CoApplicantempResidenceTotalMonthAPI = 1;
            } else {
                CoApplicantempResidenceTotalMonthAPI =
                    this.autofipayload.CoApplicantempResidenceTotalMonthAPI;
            }

            let co_employment: any;
            if (
                this.autofipayload.coapplicant_employestatus.toUpperCase() === 'STUDENT'
            ) {
                co_employment = {
                    employerName: co_employerName,
                    timeInMonths: CoApplicantempResidenceTotalMonthAPI,
                    employmentStatus: this.autofipayload.coapplicant_employestatus.toUpperCase().replaceAll('-', '_'),
                    jobTitle: this.autofipayload.CoApplicantemployee_institute,
                };
            } else if (
                this.autofipayload.coapplicant_employestatus === 'retired' ||
                this.autofipayload.coapplicant_employestatus === 'UNEmployed'
            ) {
                co_employment = {
                    timeInMonths: CoApplicantempResidenceTotalMonthAPI,
                    employmentStatus: this.autofipayload.coapplicant_employestatus.toUpperCase().replaceAll('-', '_'),
                    employerPhone: this.encrypt(CoApplicantemployee_phone),
                };
            } else {
                co_employment = {
                    employerName: co_employerName,
                    timeInMonths: CoApplicantempResidenceTotalMonthAPI,
                    employmentStatus: this.autofipayload.coapplicant_employestatus.toUpperCase().replaceAll('-', '_'),
                    employerPhone: this.encrypt(CoApplicantemployee_phone),
                    jobTitle: co_jobTitle,
                };
            }

            let CoApplicantresidenceTotalMonthAPI = 0;
            if (
                this.autofipayload.CoApplicantresidenceTotalMonthAPI === '' ||
                this.autofipayload.CoApplicantresidenceTotalMonthAPI === undefined ||
                this.autofipayload.CoApplicantresidenceTotalMonthAPI === null
            ) {
                CoApplicantresidenceTotalMonthAPI = 1;
            } else {
                CoApplicantresidenceTotalMonthAPI =
                    this.autofipayload.CoApplicantresidenceTotalMonthAPI;
            }

            let addcoapplicant = {
                cosigner: {
                    employment: co_employment,
                    name: {
                        first: this.encrypt(this.autofipayload.CoApplicantfirstname),
                        last: this.encrypt(this.autofipayload.CoApplicantlastname),
                    },
                    address: {
                        street: this.autofipayload.CoApplicantaddress,
                        city: this.autofipayload.CoApplicantcity,
                        state: this.autofipayload.CoApplicantstate,
                        zip: this.autofipayload.CoApplicantzipcode,
                        residenceType: this.autofipayload.CoApplicantpaymenttypeAPI,
                        residenceTimeInMonths: CoApplicantresidenceTotalMonthAPI,
                        residenceMonthlyPayment: Number(
                            this.autofipayload.CoApplicantpayment
                        ),
                    },
                    phone: this.encrypt(
                        this.autofipayload.CoApplicantphone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '')
                    ),
                    email: this.encrypt(this.autofipayload.CoApplicantemail),
                    ssn: this.encrypt(
                        this.coAppliantssn?.replaceAll('-', '').replaceAll(' ', '')
                    ),
                    maritalStatus: this.autofipayload.CoApplicantamaterial_status,
                    dob: this.autofipayload.co_currentdateAPI,
                    employmentIncome: co_grossIncome,
                    relationship: this.autofipayload.relationshipAPI.toUpperCase(),
                    relationshipCode: this.autofipayload.relationshipAPI.toUpperCase(),
                },
            };

            let co_otherIncomeForAPI: any = {};
            if (co_arOtherIncomeForAPI !== null && co_arOtherIncomeForAPI !== '') {
                co_otherIncomeForAPI.otherIncome = co_arOtherIncomeForAPI;
                Object.assign(addcoapplicant.cosigner, co_otherIncomeForAPI);
            }

            if (
                this.addcoprevemployment === 1 &&
                this.autofipayload.CoApplicantprevEitle !== '' &&
                this.autofipayload.CoApplicantprevEitle !== null
            ) {
                let CoApplicantemployee_prevphone =
                    this.autofipayload.CoApplicantphone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
                if (
                    this.autofipayload.CoApplicantprevEphone !== undefined &&
                    this.autofipayload.CoApplicantprevEphone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '') !== ''
                ) {
                    CoApplicantemployee_prevphone =
                        this.autofipayload.CoApplicantprevEphone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '');
                }

                let prevEmpResidenceTotalMonthAPI = 0;
                if (
                    this.autofipayload.prevEmpResidenceTotalMonthAPI === '' ||
                    this.autofipayload.prevEmpResidenceTotalMonthAPI === undefined ||
                    this.autofipayload.prevEmpResidenceTotalMonthAPI === null
                ) {
                    prevEmpResidenceTotalMonthAPI = 1;
                } else {
                    prevEmpResidenceTotalMonthAPI =
                        this.autofipayload.prevEmpResidenceTotalMonthAPI;
                }
                let co_previousEmployment = {
                    previousEmployment: {
                        timeInMonths: prevEmpResidenceTotalMonthAPI,
                        employerName: this.autofipayload.CoApplicantprevEName,
                        jobTitle: this.autofipayload.CoApplicantprevEitle,
                        employerPhone: CoApplicantemployee_prevphone,
                        employmentStatus: this.autofipayload.coapplicant_employestatus.toUpperCase().replaceAll('-', '_'),
                    },
                };
                Object.assign(addcoapplicant.cosigner, co_previousEmployment);
            }

            if (
                this.addcoprevaddress === 1 &&
                this.autofipayload.CoApplicantprevaddress !== null &&
                this.autofipayload.CoApplicantprevaddress !== ''
            ) {
                let previousAddress = {
                    previousAddress: {
                        street: this.autofipayload.CoApplicantprevaddress,
                        street2: this.autofipayload.CoApplicantprevapt,
                        city: this.autofipayload.CoApplicantprevcity,
                        state: this.autofipayload.CoApplicantprevstate,
                        zip: this.autofipayload.CoApplicantprevzipcode,
                        residenceType: this.autofipayload.CoApplicantpaymenttypeAPI,
                        residenceTimeInMonths: CoApplicantresidenceTotalMonthAPI,
                        residenceMonthlyPayment: Number(
                            this.autofipayload.CoApplicantpayment
                        ),
                    },
                };
                Object.assign(addcoapplicant.cosigner, previousAddress);
            }

            Object.assign(payload, addcoapplicant);
        }

        const dialogRef = this.dialog.open(LoaderDialogComponent, {
            data: { timer: 60 },
            disableClose: true,
            scrollStrategy: this.overlay.scrollStrategies.noop()
        });

        const apiSubscription = this.restService.autofi(payload).pipe(
            tap(() => {
                timer(60000).subscribe(() => {
                    dialogRef.close();
                });

                dialogRef.afterClosed().subscribe(() => {
                    this.isLoaderVisible$.next(true);
                    this.cdr.detectChanges();
                });
            }),
            switchMap((response: any) => {
                let obj = JSON.parse(JSON.stringify(response));
                if (obj?.lead_status === 'success') {
                    const currentDate = new Date();
                    const year = currentDate.getUTCFullYear();
                    const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(currentDate.getUTCDate()).padStart(2, '0');
                    const hours = String(currentDate.getUTCHours()).padStart(2, '0');
                    const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
                    const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

                    const utcFormattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

                    this.adobe_apply_credit_form_submit(obj?.hashedEmail, obj?.lead_id + ':' + utcFormattedDateTime);
                }
                if (obj?.message === 'Already submitted to Auto Fi') {
                    this.autofipayload.message = 'Already submitted to Auto Fi';
                }
                if (obj?.url !== undefined) {
                    this.autofiStatus = 'Auto-Fi - Completed';
                    this.autofipayload.url = this.sanitizer.bypassSecurityTrustResourceUrl(obj.url);
                    this.autofipayload.timer = 60;
                    return timer(60000).pipe(
                        switchMap(() => {
                            this.isUrlLoaded = true;
                            return of(this.autofipayload.url);
                        })
                    );
                } else {
                    throw new Error('URL not found in response');
                }
            }),
            catchError(error => {
                console.error('API call failed:', error);
                this.isUrlLoaded = true;
                return of(this.autofipayload.url);
            }),
            finalize(() => {
                this.eventEmitterService.autoFiFormSubmit = true;
                this.isLoaderVisible$.next(false);
                this.cdr.detectChanges();
                this.viewportScroller.scrollToPosition([0, 0]);
                this.thankYouPage();
            })
        ).subscribe({
            next: resp => {
                let obj = JSON.parse(JSON.stringify(resp));
                if (obj?.afExperienceCompleted && obj?.state === 'ACCEPTED') {
                    clearInterval(this.timerautoficallback);
                    this.showcallback = 1;
                } else if (obj?.afExperienceCompleted && obj?.state === 'DECLINED') {
                    clearInterval(this.timerautoficallback);
                    this.showcallback = 2;
                } else if (obj?.afExperienceCompleted && obj?.state === 'ERROR') {
                    clearInterval(this.timerautoficallback);
                    this.showcallback = 3;
                }
            },
            error: error => {
                console.error('Subscription error:', error);
            }
        });
        this.subscription.add(apiSubscription);
    }

    public showError(errorMessage: string) {
        alert(errorMessage);
    }

    public closeautodialog() {
        clearInterval(this.timerautoficallback);
    }

    public closetimer() {
        clearInterval(this.timerautoficallback);
        // this.eventEmitterService.paymentleaserefresh([]);
        // this.eventEmitterService.paymentfinancerefresh([]);
        // this.eventEmitterService.paymentcashrefresh([]);
    }

    ngOnInit(): void {
        this.autofipayload.employementpayment = '' as EmploymentPaymentFrequency;
        this.eventEmitterService.currentData.subscribe(data => {
            this.receivedData = data;
            if (this.receivedData === null) {
                this.receivedData = false;
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
