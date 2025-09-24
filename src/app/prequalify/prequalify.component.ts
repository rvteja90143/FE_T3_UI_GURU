// import { CommonModule, formatNumber } from '@angular/common';
// import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
// import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
// import { RestService } from '../services/rest.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { TranslateModule } from '@ngx-translate/core';
// import { MaterialModule } from '../material/material.module';
// import { DataHandler } from '../common/data-handler';
// import { PopupService } from '../common/pop-up-service';
// import { EventEmitterService } from '../event-emitter.service';
// import { Store, select } from '@ngrx/store';
// import { prequalifyAction } from './prequalify-store/prequalify-actions';
// import * as FormActions from './prequalify-store/prequalify-actions';
// import { prequalify_data } from '../common/data-models';
// import { Subject, Subscription, takeUntil } from 'rxjs';
// import { getselectPrequalifyState } from './prequalify-store/prequalify-selector';
// import { getLeaseDetailsState } from '../common/store/lease-details/lease-details-selector';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatSliderModule } from '@angular/material/slider';
// import { NgxGaugeModule } from 'ngx-gauge';
// import * as CryptoJS from 'crypto-js';
// import { ObservableLiveData } from '../common/observable-live-data';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MerkleHandler } from '../common/merkle-handler';

// @Component({
//   selector: 'app-prequalify',
//   standalone: true,
//   imports: [  TranslateModule, MaterialModule,  NgxGaugeModule, MatSliderModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './prequalify.component.html',
//   styleUrl: './prequalify.component.scss'
// })
// export class PrequalifyComponent implements OnInit, AfterViewInit {
//   public estimateForm!: FormGroup;
//   estimaterform = 0;
//   isValidFlg = true;
//   address: any;
//   autoEnable = 0;
//   taxamount: any;
//   preTaxMonthlyIncome: any = '';
//   submitted = false;
//   accepted = false;
//   estimaterange = 0;
//   firstname!: string;
//   lastname!: string;
//   email: any;
//   phone: any;
//   prequal_apt: any;
//   prequal_city: any;
//   prequal_state: any;
//   zipcode: any;
//   prequal_preTaxMonthlyIncome = '';
//   estimatemessage: any;
//   estimateamount: any;
//   estimateerror: any = 0;
//   maxLoanAmount: any;
//   maxMonthlyPayment: any;
//   prequaltop: any;
//   prequalbottom: any;
//   showCreditEstimator = false;
//   showEstimate = false;
//   continueEnable = false;
//   showcreditestimator: any = 0;
//   estimateaverage: any;
//   firstzipcode: any;
//   graphvalueestimator: any;
//   graphtext: any;
//   estimatorButton = 0;
//   estimatevalue = 70;
//   gridvalueprqual = 700;
//   gridvalue = 700;
//   lease_level: any = 1;
//   finance_level: any = 1;
//   estimatedisabled = false;
//   prequalestimaterform = 0;
//   isClickedOnce = false;
//   customerstate: any;
//   unsubscribe$: Subject<void> = new Subject<void>();
//   rangeArray = [300, 350, 400, 450, 500, 550, 600, 650, 700, 750];
//   gridtext = "Excellent";
//   gaugeappend = '-';
//   gaugeThick = 6;
//   gaugevalue = 700;
//   gaugemax = 850;
//   gaugemin = 300;
//   gaugelabel = "Credit Score";
//   firstTime = false;
//   creditEstimaterSubscription: Subscription;
//   gaugethresholds = {
//       '0':   {color:'blue'},
//     '640': { color: 'blue' },
//     '660': { color: 'blue' },
//     '680': { color: 'blue' },
//     '700': { color: 'blue' }
//   };
//   keyphrase: any = 'd41d8cd98f00b204e9810998ecf85373';

//   @Input() public prequalifyBtn!: boolean;
//   emailFormControl = new FormControl('', [Validators.required, Validators.email]);

//   get f() {
//     return this.estimateForm.controls;
//   }

//   constructor(private formBuilder: FormBuilder,
//     private restService: RestService,  private creditValidator : PopupService,
//     private eventEmitterService: EventEmitterService,
//     public betterdialogRef: MatDialogRef<PrequalifyComponent>,
//     public dialog: MatDialog,
//     private store: Store<any>,
//     @Inject(LOCALE_ID) private locale: string,
//     private observableService : ObservableLiveData) {
//       this.createEstimateForm();
//       this.creditEstimaterSubscription = this.creditValidator.showCreditEstimator$.subscribe(value => {
//         this.showCreditEstimator = value;
//       });
//     }

   
      

//     createEstimateForm() {
//       this.estimateForm = this.formBuilder.group({
//         firstName: [
//             '',
//             [
//                 Validators.required,
//                 Validators.pattern("^[a-zA-Z-.']*$"),
//                 this.atLeastOneAlphabet,
//             ],
//         ],
//         lastName: [
//             '',
//             [
//                 Validators.required,
//                 Validators.pattern("^[a-zA-Z-.']*$"),
//                 Validators.pattern(/^[a-zA-Z-.']{1,}$/),
//                 this.atLeastOneAlphabet,
//             ],
//         ],
//         email: ['', [Validators.required, Validators.email]],
//         phonenumber: [
//             '',
//             [
//                 Validators.required,
//                 Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
//                 Validators.minLength(14),
//                 Validators.maxLength(14),
//                 this.forbiddenFirstDigitValidator()
//             ],
//         ],
//         address: [
//             '',
//             [Validators.required, Validators.pattern('^[a-zA-Z 0-9 ]*$')],
//         ],
//         apt: ['', [Validators.pattern('^[a-zA-Z 0-9 ]*$')]],
//         city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
//         state: [
//             '',
//             [
//                 Validators.required,
//                 Validators.pattern('^[a-zA-Z ]*$'),
//                 Validators.minLength(2),
//                 Validators.maxLength(2),
//                 this.stateValidator,
//             ],
//         ],
//         zipcode: [
//             '',
//             [
//                 Validators.required,
//                 Validators.pattern('^[0-9]*$'),
//                 Validators.minLength(4),
//                 Validators.maxLength(5),
//             ],
//         ],
//         amount: ['', [Validators.required, Validators.pattern("^[0-9,]*$"), Validators.maxLength(6), Validators.minLength(3),this.firstDigitValidator_payment]],
//         acceptTerms: [false, Validators.requiredTrue]
//       });
//       const phoneNumberControl = this.estimateForm.get('phonenumber');
//             if (phoneNumberControl) {
//                 this.formatPhoneNumber(phoneNumberControl);
//             }
//     }

//     private formatPhoneNumber(phoneNumberControl: AbstractControl): void {
//       if (!phoneNumberControl) return;

//       phoneNumberControl.valueChanges.subscribe(value => {
//           let newVal = value?.replace(/\D/g, '');

//           if (newVal?.length === 0) {
//               newVal = '';
//           } else if (newVal?.length <= 3) {
//               newVal = `(${newVal}`;
//           } else if (newVal?.length <= 6) {
//               newVal = `(${newVal.slice(0, 3)}) ${newVal.slice(3)}`;
//           } else if (newVal?.length > 6) {
//               newVal = `(${newVal.slice(0, 3)}) ${newVal.slice(3, 6)}-${newVal.slice(6, 10)}`;
//           }

//           if (value !== newVal) {
//               phoneNumberControl.setValue(newVal, { emitEvent: false });
//           }
//       });
//     }

//     forbiddenFirstDigitValidator(): ValidatorFn {
//       return (control: AbstractControl): ValidationErrors | null => {
//           const value = control.value;
//           if (!value) return null;

//           const matches = value.match(/^\((\d)/);
//           if (matches && (matches[1] === '0' || matches[1] === '1')) {
//               return { invalidFirstDigit: true };
//           }

//           return null;
//       };
//   }

//     stateValidator() {
//       return (control: AbstractControl): ValidationErrors | null => {
//           const myArray: string[] = [
//               'AL',
//               'AK',
//               'AZ',
//               'AR',
//               'AA',
//               'AE',
//               'AP',
//               'CA',
//               'CO',
//               'CT',
//               'DE',
//               'DC',
//               'FL',
//               'GA',
//               'HI',
//               'ID',
//               'IL',
//               'IN',
//               'IA',
//               'KS',
//               'KY',
//               'LA',
//               'ME',
//               'MD',
//               'MA',
//               'MI',
//               'MN',
//               'MS',
//               'MO',
//               'MT',
//               'NE',
//               'NV',
//               'NH',
//               'NJ',
//               'NM',
//               'NY',
//               'NC',
//               'ND',
//               'OH',
//               'OK',
//               'OR',
//               'PA',
//               'RI',
//               'SC',
//               'SD',
//               'TN',
//               'TX',
//               'UT',
//               'VT',
//               'VA',
//               'WA',
//               'WV',
//               'WI',
//               'WY',
//               'AB',
//               'BC',
//               'MB',
//               'NB',
//               'NL',
//               'NT',
//               'NS',
//               'NU',
//               'ON',
//               'PE',
//               'QC',
//               'SK',
//               'YT',
//           ];
//           const valueToCheck = control.value?.toString().toUpperCase();
//           if (!myArray.includes(valueToCheck)) {
//               return { invalidState: true };
//           } else {
//               return null;
//           }
//       };
//   }

//     encryptInfo: any;

//     encrypt(input: any): string {
//       try {
//         var keyObj = CryptoJS.enc.Utf8.parse(this.keyphrase);
//         var encryptedtext = encodeURIComponent(CryptoJS.AES.encrypt(input, keyObj, { iv: CryptoJS.enc.Hex.parse(this.keyphrase) }).toString());
//         return encryptedtext;
//       } catch (error) {
//         return '';
//       }
//     }
    
//     closePreQualifyform(){
//         this.betterdialogRef.close();  
//       this.observableService.setShowPrequal(false);
//     }

//     continue(){
//       this.creditValidator.setCreditEstimator(false);
//       this.continueEnable = true
//       this.showcreditestimator = 2;
//     }

//     onSubmit() {
//       this.submitted = true;
//       if (this.estimateForm.invalid) {
//         return;
//       }

//       if (this.estimateForm.valid) {
//         this.accepted = true;
//         this.estimaterange = 1;
//       }
//       this.firstname = this.estimateForm.controls["firstName"].value;
//       this.lastname = this.estimateForm.controls["lastName"].value;
//       this.email = this.estimateForm.controls["email"].value;
//       this.phone = Number(this.estimateForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '').replaceAll(' ', ''));
//       this.address = this.estimateForm.controls["address"].value;
//       this.prequal_apt = this.estimateForm.controls["apt"].value;
//       this.prequal_city = this.estimateForm.controls["city"].value;
//       this.prequal_state = this.estimateForm.controls["state"].value;
//       this.zipcode = this.estimateForm.controls["zipcode"].value;
//       this.preTaxMonthlyIncome = this.prequal_preTaxMonthlyIncome = this.estimateForm.controls["amount"].value.replaceAll(',', '');
  
//       this.taxamount = Number(this.taxamount);
//       this.preTaxMonthlyIncome = this.taxamount ? formatNumber(this.taxamount, this.locale, '1.0-0') : "";
//       DataHandler.prequal_preTaxMonthlyIncome = this.preTaxMonthlyIncome;
//       this.zipcode = DataHandler.zipcode;

//       const encryptedFirstName = this.encrypt(this.firstname);
//       const encryptedLastName = this.encrypt(this.lastname);
//       const encryptedEmail = this.encrypt(this.email);
//       const encryptedPhone = this.encrypt(this.phone.toString());

//     if(DataHandler.leadtrack == 0){
//       this.restService.track_lead().subscribe((response) => {  
//       });
//       DataHandler.leadtrack = 1;
//     }

//       if (this.estimateForm.valid) {
//         let prequalifyData: prequalify_data = {
//           first_name: encryptedFirstName,
//           last_name: encryptedLastName,
//           email: encryptedEmail,
//           phone: encryptedPhone,
//           address: this.address,
//           apt: this.prequal_apt,
//           city: this.prequal_city,
//           state: this.prequal_state,
//           zip: this.zipcode,
//           monthly_income: this.prequal_preTaxMonthlyIncome,
//           prequal_pop_btntraffic: ''
//         }
//         this.store.dispatch(FormActions.prequalifyAction(prequalifyData));
//         setTimeout(()=>{
//           this.prequalifyStateSubscription();
//         },1000)
//       }
//       this.keyPressdn('');
//     }

//     prequalifyStateSubscription() {
//       this.store.pipe(select(getselectPrequalifyState), takeUntil(this.unsubscribe$)).subscribe({ next:(data) => {
//         if (data !== undefined && data !== null) {
//         this.estimateamount = JSON.parse(JSON.stringify(data));
//         this.estimatemessage = this.estimateamount.prequalifyResp.message;
//         this.estimateerror = this.estimateamount.prequalifyResp.success;
//         this.maxLoanAmount = DataHandler.maxLoanAmount = this.estimateamount.prequalifyResp.data.prequalification?.maxLoanAmount;
//         this.maxMonthlyPayment = DataHandler.maxMonthlyPayment = this.estimateamount.prequalifyResp.data.prequalification?.maxMonthlyPayment;
//         this.prequaltop = this.estimateamount.prequalifyResp.data.prequalification?.ficoRange.top;
//         this.prequalbottom = this.estimateamount.prequalifyResp.data.prequalification?.ficoRange.bottom;
//         if(this.estimateamount.prequalifyResp.prequalification_status > 399){
//           this.creditValidator.setCreditEstimator(false);
//           this.continueEnable = true
//           this.showcreditestimator = 2;
//         }
//         else {
//           this.showcreditestimator = 1;
//           this.creditValidator.setCreditEstimator(true);
//           this.continueEnable = true
//           this.showCreditEstimator = true;
//           this.showEstimate = true;
//           this.graphValue();
//           this.updatePayment();
//           this.estimatedisabled = true;
//         }
//         if (this.prequalestimaterform == 0) {
//           this.prequalestimaterform = 1;
//         }
//         this.isClickedOnce = true;
//         DataHandler.submitdealer = this.estimateForm.value;
//       }
//       }
//     });
//   }

//     updatePayment(){
//       this.lease_level = DataHandler.leaserange_length;
//       for (let i = 0; i < DataHandler.leaserange_length; i++) {
//         if ((Number(this.gridvalue) >= DataHandler.leaserange[i].ficoLow) && (Number(this.gridvalue) < DataHandler.leaserange[i].ficoHigh)) {
//           this.lease_level = DataHandler.leaserange[i].code;
//         }
//       }
//       this.finance_level = DataHandler.financerange_length;
//       for (let i = 0; i < DataHandler.financerange_length; i++) {
//         if ((Number(this.gridvalue) >= DataHandler.financerange[i].ficoLow) && (Number(this.gridvalue) < DataHandler.financerange[i].ficoHigh)) {
//           this.finance_level = DataHandler.financerange[i].code;
//         }
//       }
   
      
//       if (this.isClickedOnce == false) {
      
//       }
//     }

//   ngOnInit(): void {
//     if (DataHandler.firstname) { 
//       this.estimateForm.controls["firstName"].setValue(DataHandler.firstname);
//     }
//     if (DataHandler.lastname) {
//       this.estimateForm.controls['lastName'].setValue(DataHandler.lastname);
//     }
//     if(DataHandler.zipcode) {
//       this.estimateForm.controls['zipcode'].setValue(DataHandler.zipcode);
//     }
//     if(DataHandler.email) {
//       this.estimateForm.controls['email'].setValue(DataHandler.email);
//     }
//     if(DataHandler.phone) {
//       this.estimateForm.controls['phonenumber'].setValue(DataHandler.phone);
//     }
//   }

//   ngAfterViewInit(): void {
//     console.log('ngAfterViewInit triggered::');
//   }

//   opencreditestimator() {
//     this.showcreditestimator = 1;
//     this.estimaterange = 0;
//     this.keyPressdn('');
//   }

//   closeestimate() {
//     this.creditValidator.setCreditEstimator(false);
//     this.continueEnable = false;
//     this.updateslider();
//     this.observableService.setShowPrequal(false);
//     this.betterdialogRef.close(); 
//     if (DataHandler.isClickZipCode == false) {
//       this.showprivateoffer();
//       if (this.showcreditestimator) {
//         MerkleHandler.merkleexecutor('estimate-credit-estimator-x');
//       } else {
//         MerkleHandler.merkleexecutor('estimate-close-x');
//       }
//     }
//   }
//   privateoffer:any;
//   showprivateoffer(){
//     this.restService.private_offers().subscribe((response: any) => {
//       this.privateoffer = JSON.parse(JSON.stringify(response));
//       if (this.privateoffer != undefined && this.privateoffer != null ) {
//         DataHandler.private_Offer_Status = this.privateoffer.status;
//         if (DataHandler.private_Offer_Status == true && DataHandler.open_private_offer_pop == 0) {
//           DataHandler.privateofferID = this.privateoffer.privateOffers.programNumber;
//           DataHandler.privateofferamount = this.privateoffer.privateOffers?.amount;
//           DataHandler.certificatecode = this.privateoffer.privateOffers.certificateCode;
//           DataHandler.offerexpire = this.privateoffer.privateOffers.expiryDate;
//           this.eventEmitterService.paymentfinancerefresh([]);
//           this.eventEmitterService.paymentcashrefresh([]);
//         }
//       } 
//     });
    
//   }

//   leaseDetailsSubscription() {
//     this.store
//             .pipe(select(getLeaseDetailsState), takeUntil(this.unsubscribe$))
//             .subscribe((data: any) => {
//                 if (data !== null && data !== undefined) {
//                     let resp = JSON.parse(JSON.stringify(data));
//                     if (resp.leaseInfoResp !== null) {
//                         DataHandler.leaserange_length = resp?.leaseInfoResp?.payload_calculation?.available_tiers_options.length;
//                         DataHandler.leaserange_length = DataHandler.leaserange_length >= 5 ? 4 : DataHandler.leaserange_length;
//                     }
//                 }
//             });
//   }

//   betterEstimateDialog() {
//     DataHandler.is_lead_form_open = true;
//     const betterdialogRef = this.dialog.open(PrequalifyComponent, {
//       panelClass: ['inWidget', 'betterEstimateDialog-container'],
//       maxWidth: 200,
//       disableClose: true,
//     });
//     betterdialogRef.afterClosed().subscribe(result => {
//       DataHandler.is_lead_form_open = false;
//     });
//   }

//   updateslider() {
//     this.lease_level = DataHandler.leaserange_length;
//     for (let i = 0; i < DataHandler.leaserange_length; i++) {
//       if ((Number(this.gridvalueprqual) >= DataHandler.leaserange[i].ficoLow) && (Number(this.gridvalueprqual) <= DataHandler.leaserange[i].ficoHigh)) {
//         this.lease_level = DataHandler.leaserange[i].code;
//       }
//     }
//     this.finance_level = DataHandler.financerange_length;
//     for (let i = 0; i < DataHandler.financerange_length; i++) {
//       if ((Number(this.gridvalueprqual) >= DataHandler.financerange[i].ficoLow) && (Number(this.gridvalueprqual) < DataHandler.financerange[i].ficoHigh)) {
//         this.finance_level = DataHandler.financerange[i].code;
//       }
//     }

   
//   }

//   updateSetting(event: any) {
//     event=this.gridvalue;
//     if (event >= 700 && event <= 850) {
//       this.gridtext = "Excellent";
//     }
//     else if (event >= 680 && event < 700) {
//       this.gridtext = "Very Good";
//     }
//     else if (event >= 660 && event < 680) {
//       this.gridtext = "Good";
//     }
//     else if (event < 660) {
//       this.gridtext = "Fair";
//     }
//     DataHandler.gridVal = this.gridvalue;
//     DataHandler.gridText = this.gridtext
//  }


//   graphValue() {
//     if (Number(this.prequalbottom) >= 700 && Number(this.prequaltop) <= 850) {
//       var avg = Number(this.prequalbottom) + Number(this.prequaltop);
//       this.estimateaverage = avg / 2;
//       this.graphtext = "Excellent";
//       this.estimatevalue = this.estimateaverage / 10 - 25;
//     } else if (Number(this.prequalbottom) >= 680 && Number(this.prequaltop) <= 700) {
//       var avg1 = Number(this.prequalbottom) + Number(this.prequaltop);
//       this.estimateaverage = avg1 / 2;
//       this.graphtext = "Very Good";
//       this.estimatevalue = this.estimateaverage / 10 - 25;
//     } else if (Number(this.prequalbottom) >= 660 && Number(this.prequaltop) <= 680) {
//       var avg2 = Number(this.prequalbottom) + Number(this.prequaltop);
//       this.estimateaverage = avg2 / 2;
//       this.graphtext = "Good";
//       this.estimatevalue = this.estimateaverage / 10 - 25;
//     } else if (Number(this.prequalbottom) < 660) {
//       this.estimateaverage = Number(this.prequalbottom);
//       this.estimatevalue = Number(this.prequalbottom) / 10 - 25;
//       this.graphtext = "Fair"
//       this.estimateaverage = this.estimatevalue;
//     }
   
//     this.gridvalue = this.estimateaverage;
//     this.graphvalueestimator = this.estimatevalue;
//   }

//   atLeastOneAlphabet(control:any) {
//     const regex = /[a-zA-Z]+/;
//     const valid = regex.test(control.value);
//     return valid ? null : { atLeastOneAlphabet: true };
//   }

//   firstDigitValidator(control: AbstractControl): ValidationErrors | null {
//     const firstDigit = control.value?.toString().charAt(1);
//     if (firstDigit === '0' || firstDigit === '1') {
//       return { 'invalidFirstDigit': true };
//     }
//     return null;
//   }

//   firstDigitValidator_payment(control: AbstractControl): ValidationErrors | null {
//     const firstDigit = control.value?.toString().charAt(0);
//     if (firstDigit === '0') {
//       return { 'invalidFirstDigit_payment': true };
//     }
//     return null;
//   }

//   startForm() {
//     if (this.estimaterform == 0) {
//     this.estimaterform = 1;
//    }
//   }

//   validateInput(event: KeyboardEvent): void {
//     const inputValue = (event.target as HTMLInputElement).value;
//     const pattern = /^[a-zA-Z-.']*$/;

//     const inputChar = String.fromCharCode(event.keyCode);

//     if (!pattern.test(inputChar)) {
//         event.preventDefault();
//     }
// }

//   validatePhoneNo(field: any) {
//     var phoneNumDigits = field.value.replace(/\D/g, '');
//     this.isValidFlg = (phoneNumDigits.length == 0 || phoneNumDigits.length == 10);
//     if (phoneNumDigits.length >= 6) {
//       this.estimateForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6));
//     } else if (phoneNumDigits.length >= 3) {
//       this.estimateForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3));
//     }
//   }

//   keyPress(event: any) {
//     const pattern = /[0-9\+\-\ ]/;
//     let inputChar = String.fromCharCode(event.charCode);
//     if (event.keyCode != 8 && !pattern.test(inputChar)) {
//       event.preventDefault();
//     }
//     if (event.keyCode != 8) {
//       this.validatePhoneNo(event.target);
//     }
//   }

//   populateaddress(obj: any) {
//     this.restService.getAddress(obj.target.value).subscribe((response) => {
//       var obj = JSON.parse(JSON.stringify(response));
//       this.address = obj.result.formatted_address;
//     });
//     this.autoEnable = 1;
//   }

//   selectaddress(obj: any) {
//     let str = (obj.target.innerHTML).split(',');
//     let newstrarr = [];
//     let addr;
//     for (let i = 0; i < str.length - 3; i++) {
//       newstrarr.push(str[i]);
//     }
//     addr = newstrarr.join(',');
//     this.estimateForm.controls["address"].setValue(addr);
//     this.estimateForm.controls["city"].setValue(str[str.length - 3].trim());
//     this.estimateForm.controls["state"].setValue(str[str.length - 2].trim().split(' ')[0]);
//     this.estimateForm.controls["zipcode"].setValue(str[str.length - 2].trim().split(' ')[1]);

//     this.address = [];
//     this.autoEnable = 0;
//   }

//   keyPressdn(event: any) {
//     this.taxamount = ((<HTMLInputElement>document.getElementById('amount'))?.value)?.replace(",", "");
//     this.taxamount = Number(this.taxamount);
//     this.preTaxMonthlyIncome = this.taxamount ? formatNumber(this.taxamount, this.locale, '1.0-0') : 0;
//   }

//   validateNumber(event: any) {
//     const keyCode = event.keyCode;
//     const excludedKeys = [8, 37, 39, 46];
//     if (
//         !(
//             (keyCode >= 48 && keyCode <= 57) ||
//             (keyCode >= 96 && keyCode <= 105) ||
//             excludedKeys.includes(keyCode)
//         )
//     ) {
//         event.preventDefault();
//     }
// }
// }
