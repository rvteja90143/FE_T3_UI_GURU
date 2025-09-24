import { Component, Inject, Injectable, OnInit, ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { DataHandler } from '../common/data-handler';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { EventEmitterService } from '../event-emitter.service';
import { RestService } from '../services/rest.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { MerkleHandler } from '../common/merkle-handler';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ObservableLiveData } from '../common/observable-live-data';
import { GA4DealerService } from '../services/ga4dealer.service';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Overlay } from '@angular/cdk/overlay';
import { GA4Service } from '../services/ga4.service';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';


interface DialogData {
    date: any,
    time: any,
    dealername: any
}
@Component({
    selector: 'app-test-drive',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './test-drive.component.html',
    styleUrl: './test-drive.component.scss'
})
@Injectable({ providedIn: 'root' })
export class TestDriveComponent implements OnInit {
    isMobileScreen: any = false;
    dealername!: any;
    registerForm!: UntypedFormGroup;
    submitted = false;
    firstime = 0;
    minDate: any;
    maxDate: any;
    isValidFlg: boolean = true;
    testdrivesubmitted: boolean = false;
    times: any = [];
    address: any = '';
    showroomTimingFilter: any;
    showHomeAddress: boolean = false;
    showOtherAddress: boolean = false;
    privateoffer: any;
    initialSuccess: boolean = false;
    showthankyou: boolean = false;
    currentdate: any;
    currenttime: any;
    display_vehicle_name: string = '';
    heroImage: string = '';
    adobeEventCalled: boolean = false;
    showIframe = false;
    loaded: any;
    iFrameUrl: SafeResourceUrl | null = null;
    is_dealer_enable_dms: any;
    upload_document: boolean = true;
    showsubmit: any;
    showForm = true
    counter: any
    customizeTestdrive = true;
    selectedLocationTest: string = 'dealership';
    showdeliveryTest: any;
    showdeliveryText: any;
    initialFormFilled = false;
    dmsurl: any;
    make :any;
    private inputSubject = new Subject<string>();
    constructor(private formBuilder: UntypedFormBuilder, private ga4dealerService: GA4DealerService, private eventEmitterService: EventEmitterService, private restService: RestService, private datePipe: DatePipe, public dialog: MatDialog,
        private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private observableService: ObservableLiveData, public overlay: Overlay, private ga4Service: GA4Service) {
        this.isMobileScreen = DataHandler.isMobileScreen; ``
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currDate = new Date().getDate() + 1;
        const maxcurrDate = new Date().getDate() + 365;
        this.minDate = new Date(currentYear, currentMonth, currDate);
        this.maxDate = new Date(currentYear, currentMonth, maxcurrDate);
        this.constructtime('');
        this.showsubmit = DataHandler.testdrivesubmit;
        this.dealername = DataHandler.dealerinfo?.dealerName;
        this.is_dealer_enable_dms = DataHandler.is_dms_enabled;
      
        this.eventEmitterService.subsVar = this.eventEmitterService.
            populatedealernameFunction.subscribe((param: string) => {
                this.dealername = param;
            });
        this.eventEmitterService.
            loadTestDrivePIInfo.subscribe((param: string) => {
                this.loadPIInfo();
            });
        this.showroomTimingFilter = (d: Date): boolean => {
            if (d != null) {
                const day = d.getDay();
                if (day == 0 && DataHandler.showroomTimingFilter?.showroom_open_sunday == '' && DataHandler.showroomTimingFilter?.showroom_close_sunday == '') {
                    return false;
                } else if (day == 1 && DataHandler.showroomTimingFilter?.showroom_open_monday == '' && DataHandler.showroomTimingFilter?.showroom_close_monday == '') {
                    return false;
                } else if (day == 2 && DataHandler.showroomTimingFilter?.showroom_open_tuesday == '' && DataHandler.showroomTimingFilter?.showroom_close_tuesday == '') {
                    return false;
                } else if (day == 3 && DataHandler.showroomTimingFilter?.showroom_open_wednesday == '' && DataHandler.showroomTimingFilter?.showroom_close_wednesday == '') {
                    return false;
                } else if (day == 4 && DataHandler.showroomTimingFilter?.showroom_open_thursday == '' && DataHandler.showroomTimingFilter?.showroom_close_thursday == '') {
                    return false;
                } else if (day == 5 && DataHandler.showroomTimingFilter?.showroom_open_friday == '' && DataHandler.showroomTimingFilter?.showroom_close_friday == '') {
                    return false;
                } else if (day == 6 && DataHandler.showroomTimingFilter?.showroom_open_saturday == '' && DataHandler.showroomTimingFilter?.showroom_close_saturday == '') {
                    return false;
                } else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
    }

    disablesubmit() {
        DataHandler.testdrivesubmit = 1;
        this.showsubmit = DataHandler.testdrivesubmit;
    }

    onUploadDocument(event: any): void {
        this.upload_document = event.checked;
        console.log(event.checked ? "You have selected" : "Sorry!!!", this.upload_document);
    }

    initialevent() {
        if (this.firstime == 0) {
            ShiftDigitalHandler.shiftdigitalexecutor('Test Drive form start');
            ShiftDigitalHandler.shiftdigitalexecutor('Test Drive form date');
            MerkleHandler.merkleexecutor('test-drive-start');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('test-drive-start');
            this.firstime = 1;
            this.ga4Service.submit_to_api('TestDriveFormStart', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('TestDriveFormStart').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('TestDriveFormStart').subscribe((response: any) => { });
        }
        if (!this.adobeEventCalled) {
            this.adobe_sdg_event("initial-form-start");
            this.adobeEventCalled = true;
        }
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

    validatePhoneNo(field: any) {
        var phoneNumDigits = field.value.replace(/\D/g, '');
        this.isValidFlg = (phoneNumDigits.length == 0 || phoneNumDigits.length == 10);
        if (phoneNumDigits.length >= 6) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3, 6) + '-' + phoneNumDigits.substring(6));
        } else if (phoneNumDigits.length >= 3) {
            this.registerForm.controls["phonenumber"].setValue('(' + phoneNumDigits.substring(0, 3) + ')' + phoneNumDigits.substring(3));
        }
    }

    autoEnable = 0;
    timeEnable = -1;

    populateaddress(obj: any) {
        const input = obj.target.value;
        if (input.length < 4) {
            this.address = '';        
            this.autoEnable = 0;      
            return;
        }
        this.inputSubject.next(input);
    }

    selectaddress(obj: any, field1: any, field2: any, field3: any, field4: any) {
        var str = (obj.target.innerHTML).split(',');
        var newstrarr = [];
        var addr;
        for (let i = 0; i < str.length - 3; i++) {
            newstrarr.push(str[i]);
        }
        addr = newstrarr.join(',');
        this.registerForm.controls[field1].setValue(addr);
        this.registerForm.controls[field2].setValue(str[str.length - 3].trim());
        this.registerForm.controls[field3].setValue(str[str.length - 2].trim().split(' ')[0]);
        this.registerForm.controls[field4].setValue(str[str.length - 2].trim().split(' ')[1]);
        this.address = [];
        this.autoEnable = 0;
    }

    enabletime(prTrpe: any) {
        if (prTrpe == 1) {
            this.timeEnable = this.timeEnable * -1;
        } else if (prTrpe == 2) {
            this.timeEnable = -1;
        }
    }

    grabtime(obj: any, field1: any) {
        //console.log("obj",obj)
        // var str = obj.target.innerHTML;
        this.registerForm.controls[field1].setValue(obj);
        this.timeEnable = -1;
        //console.log("time",str)
        this.currenttime = obj;
    }

    validateInput(event: KeyboardEvent): void {
        const inputValue = (event.target as HTMLInputElement).value;
        const pattern = /^[a-zA-Z-.']*$/; // Only alphanumeric characters allowed

        const inputChar = String.fromCharCode(event.keyCode);

        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
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
        console.log(DataHandler.make)
        this.make = DataHandler.make
          this.showdeliveryText = DataHandler.testdrive_disclimer;
        this.showdeliveryTest = DataHandler.showdelivery;
        if (this.showdeliveryTest === 'P') {
            this.selectedLocationTest = 'dealership';
        } else if (this.showdeliveryTest === 'H') {
            this.selectedLocationTest = 'myhome';
        } else if (this.showdeliveryTest === 'O') {
            this.selectedLocationTest = 'otherlocation';
        }
        this.customizeTestdrive = DataHandler.customize_testdrive === 'Y' ? true : false;
        this.registerForm = this.formBuilder.group({
            date: ['', Validators.required],
            time: ['', Validators.required],
            firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")]],
            lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z-.']*$")]],
            zipCode: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
            Validators.minLength(4), Validators.maxLength(5)]],
            phonenumber: ['', [Validators.maxLength(14), this.forbiddenFirstDigitValidator(), Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
            ]],
            email: ['', [Validators.required]],
            location: ['', [Validators.required]],
            hlhomeAddress: ['', null],
            hlcity: ['', null],
            hlstate: ['', null],
            hlzipcode: ['', null],
            olhomeAddress: ['', null],
            olcity: ['', null],
            olstate: ['', null],
            olzipcode: ['', null],
            driver_license: [true, Validators.required]
        });
        this.display_vehicle_name = DataHandler.display_vehicle_name;
        this.registerForm.controls["firstName"].setValue(DataHandler.firstname);
        this.registerForm.controls["lastName"].setValue(DataHandler.lastname);
        this.registerForm.controls["email"].setValue(DataHandler.email);
        //this.registerForm.controls["phonenumber"].setValue(DataHandler.phone);
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
        /*Apply vertical scroll if exceeds*/
        /*  const maxHt = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 278;
        const testDrive = <HTMLScriptElement>document.getElementById("testDrive");
         testDrive.setAttribute('style', '');
         testDrive.style.maxHeight = maxHt + 'px';*/
        this.heroImage = DataHandler.heroImage;

        if (environment.production) {
            this.dmsurl = 'https://dms.apicarzato.com/dms?';
        } else {
            this.dmsurl = 'https://uat-dms.apicarzato.com/dms?';
        }
         this.inputSubject.pipe(
            debounceTime(300),               // wait 300ms
            distinctUntilChanged(),          // ignore same input
            filter(val => val.length >= 4)   // only after 4 chars
          ).subscribe(value => {
            this.restService.getAddress(value).subscribe(response => {
              const obj = JSON.parse(JSON.stringify(response));
              this.address = obj.result.formatted_address;
              this.autoEnable = 1;
            });
            console.log("test drive debounce");
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

    atDealership() {
        this.showHomeAddress = false;
        this.showOtherAddress = false;
        this.clearhomevalidations();
        this.clearothervalidations();
    }

    homeAddress() {
        this.showHomeAddress = true;
        this.showOtherAddress = false;
        this.clearothervalidations();
        this.registerForm.controls["hlhomeAddress"].setValidators(Validators.required);
        this.registerForm.controls["hlhomeAddress"].updateValueAndValidity();
        this.registerForm.controls["hlcity"].setValidators(Validators.required);
        this.registerForm.controls["hlcity"].updateValueAndValidity();
        this.registerForm.controls["hlstate"].setValidators(Validators.required);
        this.registerForm.controls["hlstate"].updateValueAndValidity();
        this.registerForm.controls["hlzipcode"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
        Validators.minLength(4), Validators.maxLength(5)]);
        this.registerForm.controls["hlzipcode"].updateValueAndValidity();
    }

    otherAddress() {
        this.showHomeAddress = false;
        this.showOtherAddress = true;
        this.clearhomevalidations();
        this.registerForm.controls["olhomeAddress"].setValidators(Validators.required);
        this.registerForm.controls["olhomeAddress"].updateValueAndValidity();
        this.registerForm.controls["olcity"].setValidators(Validators.required);
        this.registerForm.controls["olcity"].updateValueAndValidity();
        this.registerForm.controls["olstate"].setValidators(Validators.required);
        this.registerForm.controls["olstate"].updateValueAndValidity();
        this.registerForm.controls["olzipcode"].setValidators([Validators.required, Validators.pattern("^[0-9]*$"),
        Validators.minLength(4), Validators.maxLength(5)]);
        this.registerForm.controls["olzipcode"].updateValueAndValidity();
    }

    get myForm() {
        return this.registerForm.get('location');
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.submitted = true) {
            this.ga4dealerService.fire_asc_events('TestDriveFormInvalid').subscribe((response: any) => { });
        }
        if (this.registerForm.invalid) {
            this.adobe_sdg_event("validation-error-display");
            MerkleHandler.merkleexecutor('test-drive-invalid');
            return;
        }
        DataHandler.firstname = this.registerForm.controls["firstName"].value;
        DataHandler.lastname = this.registerForm.controls["lastName"].value;
        DataHandler.email = this.registerForm.controls["email"].value;
        //DataHandler.phone = this.registerForm.controls["phonenumber"].value;
        DataHandler.phone = this.registerForm.controls["phonenumber"].value.replace('(', '').replace(')', '').replace('-', '');
        DataHandler.zipcode = this.registerForm.controls["zipCode"].value;

        if (this.is_dealer_enable_dms == 'Y' && this.upload_document == true) {
            this.callData();
        }

        //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        if (this.firstime == 1) {
            ShiftDigitalHandler.shiftdigitalexecutor('Test Drive form finish');
            ShiftDigitalHandler.shiftdigitalexecutor('Test Drive form submit');
            MerkleHandler.merkleexecutor('test-drive-end');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('test-drive-end');
            this.ga4Service.submit_to_api('TestDriveFormEnd', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('TestDriveFormEnd').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('TestDriveFormEnd').subscribe((response: any) => { });
            this.firstime = 2;
            this.initialFormFilled = true;
            this.restService.setInitialFormFilled(true);
        }
        console.log(this.testdrivesubmitted);// to disable the button
        DataHandler.testdrive = this.registerForm.value;

       this.currentdate= DataHandler.testdrive.date = this.datePipe.transform(DataHandler.testdrive?.date, 'MM/dd/yyyy');
        DataHandler.testdrive.time = DataHandler.testdrive?.time;

        this.eventEmitterService.disableviewoffer(0);
        this.eventEmitterService.onFirstComponentButtonClick('message-1');
        this.restService.private_offers().subscribe({
            next: (response: any) => {
                this.privateoffer = JSON.parse(JSON.stringify(response));
                if (this.privateoffer != undefined && this.privateoffer != null) {
                    DataHandler.private_Offer_Status = this.privateoffer.status;
                    DataHandler.privateofferamount = this.privateoffer.privateOffers?.amount;
                    DataHandler.certificatecode = this.privateoffer.privateOffers?.certificateCode;
                    DataHandler.offerexpire = this.privateoffer.privateOffers?.expiryDate;
                    this.showForm = false
                    if (DataHandler.open_private_offer_pop == 0 && DataHandler.private_Offer_Status == true) {
                        //this.showthankyouPopup();
                        DataHandler.private_offer_conditionaloffer = true;
                        setTimeout(() => {
                            this.openPrivateOffer();
                        }, 1000);
                        DataHandler.open_private_offer_pop = 1;
                        this.eventEmitterService.paymentleaserefresh([]);
                        this.eventEmitterService.paymentfinancerefresh([]);
                        this.eventEmitterService.paymentcashrefresh([]);
                        DataHandler.private_offer_email = this.registerForm.controls["email"].value;
                    } else {
                        // this.showthankyouPopup();
                    }
                } else {
                    // this.showthankyouPopup();
                }
                this.adobe_sdg_event("submit-test-drive");
            },
            error: (error: any) => {
                this.adobe_sdg_event("api-error-display");
            }
        });
        if (this.is_dealer_enable_dms == 'Y' && this.upload_document == true) {
            this.loaded = 0;
            this.observableService.hidebackbutton(true);
            this.showIframe = true;
            this.showForm = false
            let intervel = setInterval(() => {
                if (DataHandler.resonse_DATA != undefined || this.counter == 10) {

                    this.loaded = 1;
                    clearInterval(intervel)
                    //this.showForm = false;
                    const url = this.dmsurl + DataHandler.resonse_DATA;
                    this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                    window.addEventListener('message', this.handleDMSIframeMessage);
                }

                this.counter += 1

            }, 3000);
            // setTimeout(() => {
            //   this.loaded = 1;
            //   //this.showForm = false;
            //   const url = 'https://dms.eshopdemoapp.com/dms?' + DataHandler.resonse_DATA;
            //   this.iFrameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            // }, 2000);

        } else {
            // console.log("call 4")
            this.initialSuccess = true;
            this.showthankyou = true
            this.showIframe =false;
           // this.showthankyouPopup();
        }
    }

    callData(): void {
        var merkleTire;
        if (DataHandler.merkleTire == 'ORE') {
            merkleTire = 'standalone';
        } else {
            merkleTire = DataHandler.merkleTire;
        }

        let urlObject = {
            'userEmail': DataHandler.email,
            'firstName': DataHandler.firstname,
            'lastName': DataHandler.lastname,
            'dealerCode': DataHandler.dealer,
            'dealerName': DataHandler.dealerName,
            'make': DataHandler.make,
            'modal': DataHandler.model,
            'vehicleYear': DataHandler.year,
            'trim': (DataHandler.trim != null) ? DataHandler.trim?.replace(/%20/g, " ").replace(/%AE/g, "") : '',
            'vin': DataHandler.vin,
            'tier': merkleTire,
            'vehicleInventoryStatus': (DataHandler.vehicleInventoryStatusCode != null) ? DataHandler.vehicleInventoryStatusCode : '',
            'siteprefix': "DriveFCA:inwidget_redesign"
        }

        console.log("url:", urlObject)

        DataHandler.dms_Data = { 'url': JSON.stringify(urlObject) };
        this.restService.get_dms_encryptedData('url_encryption', JSON.stringify(DataHandler.dms_Data)).subscribe(
            (response) => {
                const encryptData = `url=${response.url}`;
                DataHandler.resonse_DATA = encryptData;
            },
            (error) => {
                console.error('Error:', error);
            }
        );
    }

    handleDMSIframeMessage = (event: MessageEvent): void => {
        const iframe = document.getElementById('dms_iframe') as HTMLIFrameElement;

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
        if (data.event && data.event.startsWith('dms')) {
            switch (data.event) {
                case 'dms_page_load':
                    if (data.page_name == 'consent_form') {
                        DataHandler.iframePageNames = 'consent_form';
                        this.adobe_sdg_event('iframe_pageload');
                    }
                    else if (data.page_name == 'upload_documents') {
                        DataHandler.iframePageNames = 'upload_documents';
                        this.adobe_sdg_event("upload_documents_pageload")
                    }

                    else if (data.page_name == 'document_details') {
                        DataHandler.iframePageNames = 'document_details';
                        DataHandler.is_dms_document_submited = " and Uploaded Driver License related Document";
                        this.adobe_sdg_event('document_details_pageload');
                    }
                    else if (data.page_name == 'Preview') {
                        DataHandler.iframePageNames = 'preview_page';
                        this.adobe_sdg_event('documet_upload_review');
                    }

                    break;


                case 'dms_ctaClick':

                    if (data.cta_name == 'Return' || data.cta_name == 'return' || data.cta_name == 'Proceed') {
                        /* this.initialSuccess = true;
                         this.showthankyou = true;*/
                        // console.log("call 3")
                        this.observableService.hidebackbutton(false);
                        this.showIframe = false;
                        //this.showthankyouPopup();
                        this.initialSuccess = true;
                        this.showthankyou = true

                        if (data.page_name == 'consent_form') {
                            this.adobe_sdg_event('consent_form_return');
                        }

                        else if (data.page_name == 'upload_document') {
                            this.adobe_sdg_event('upload_document_return');
                        }

                        else if (data.page_name == 'document_details') {
                            MerkleHandler.merkleexecutor('document_details_return');
                            if (data.cta_name == 'Proceed') {
                                /*   this.initialSuccess = true;
                                   this.showthankyou = true;*/
                                //     console.log("call 2")
                                this.observableService.hidebackbutton(false);
                                this.showIframe = false;
                                this.adobe_sdg_event('document_details_submit');
                                //this.showthankyouPopup();
                            }
                        }

                        else if (data.page_name == 'error_page') {
                            DataHandler.iframeAnalyticsData = data.analytics_payload;
                            MerkleHandler.merkleexecutor('error_page_return');
                        }

                    }

                    else if (data.page_name == 'document_details') {
                        if (data.cta_name == 'start-over') {
                            this.adobe_sdg_event('start_over_click');
                        }

                        if (data.cta_name == 'Proceed') {
                            this.adobe_sdg_event('proceed_to_thankyoupage');
                            /*   this.initialSuccess = true;
                                 this.showthankyou = true;*/
                            //console.log("call 1") 
                            this.observableService.hidebackbutton(false);
                            this.showIframe = false;
                              this.initialSuccess = true;
                                this.showthankyou = true
                          //  this.showthankyouPopup();
                        }
                    }
                    else if (data.cta_name == 'Submit' && data.page_name == 'upload_document') {
                        this.adobe_sdg_event("upload_document_submit")
                    }
                    else if (data.cta_name == 'browse_files' && data.page_name == 'upload_document') {
                        this.adobe_sdg_event("browse_file_cta")
                    }
                    else if (data.cta_name == 'Next' && data.page_name == 'consent_form') {
                        this.adobe_sdg_event('consent_form_next');
                    }
                    else if (data.cta_name == 'start-over' && data.page_name == 'preview') {
                        this.adobe_sdg_event('preview_start_over');
                    }
                    else if (data.cta_name == 'drop_files' && data.page_name == 'upload_document') {
                        this.adobe_sdg_event("dropfile_uploadDocument");
                    }

                    break;


                case 'dms_form_action':
                    if (data.action_type == 'Checkbox' && data.page_name == 'consent_form') {
                        DataHandler.iframeAnalyticsData = data.analytics_payload
                        MerkleHandler.merkleexecutor('consent_form_checkbox');
                    }
                    break;
                default:
                    console.warn('Unhandled DMS event:', data.event);
            }
        } else {
            console.warn('Unrecognized event format:', data);
        }
    };

    ngAfterViewInit(): void {
        // this.onSubmit();
        this.cdr.detectChanges();
    }

    gotoform() {
        this.observableService.hidebackbutton(false);
        this.showForm = true;
        this.showIframe = false;
        this.iFrameUrl = null;
        this.showthankyou = false;
        if (DataHandler.iframePageNames == 'consent_form') {
            this.adobe_sdg_event('startOver_uploadDocument');
        } else if (DataHandler.iframePageNames == 'upload_documents') {
            this.adobe_sdg_event('startOver_uploadDetails');
        } else if (DataHandler.iframePageNames == 'document_details') {
            this.adobe_sdg_event('startOver_submitHistory');
        } else if (DataHandler.iframePageNames == 'preview_page') {
            this.adobe_sdg_event('startOver_previewDocument');
        }
    }

    ngOnDestroy(): void {
        window.removeEventListener('message', this.handleDMSIframeMessage);
    }

    showthankyouPopup() {
        const date = this.registerForm.controls['date'].value;
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

        const dialogRef = this.dialog.open(ThankYouComponent, {
            panelClass: ['testDriveThankyou'],
            data: {
                date: formattedDate,
                time: this.registerForm.controls['time'].value,
                dealername: this.dealername
            },
            width: '80vw',
            height: '71vh',
            disableClose: true,
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block()
        });
        setTimeout(() => {
            this.adobe_sdg_event("thankyoupage_load")
        }, 2000);
    }
    openPrivateOffer() {
        const couponCodeDialogRef = this.dialog.open(PrivateOfferMessageDialog, {
            panelClass: ['inWidget', 'incentiveAddedDialog-container'],
            // maxWidth: 100,
            width: '50%',
            disableClose: true,
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block()
        });
    }
    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    clearhomevalidations() {
        this.registerForm.controls["hlhomeAddress"].setValidators(null);
        this.registerForm.controls["hlhomeAddress"].updateValueAndValidity();

        this.registerForm.controls["hlcity"].setValidators(null);
        this.registerForm.controls["hlcity"].updateValueAndValidity();

        this.registerForm.controls["hlstate"].setValidators(null);
        this.registerForm.controls["hlstate"].updateValueAndValidity();

        this.registerForm.controls["hlzipcode"].setValidators(null);
        this.registerForm.controls["hlzipcode"].updateValueAndValidity();

        this.registerForm.controls["hlhomeAddress"].reset();
        this.registerForm.controls["hlcity"].reset();
        this.registerForm.controls["hlstate"].reset();
        this.registerForm.controls["hlzipcode"].reset();

    }

    closepop() {
        document.getElementById('backBtn')?.click();
    }

    closeTestDrive() {
        this.observableService.hidebackbutton(false);
        this.adobe_sdg_event('close-test-drive');
        this.eventEmitterService.loadSDGVehicleDetailsEvent()
    }

    shiftdigitaldate() {
        ShiftDigitalHandler.shiftdigitalexecutor('show date');
    }

    clearothervalidations() {
        this.registerForm.controls["olhomeAddress"].setValidators(null);
        this.registerForm.controls["olhomeAddress"].updateValueAndValidity();

        this.registerForm.controls["olcity"].setValidators(null);
        this.registerForm.controls["olcity"].updateValueAndValidity();

        this.registerForm.controls["olstate"].setValidators(null);
        this.registerForm.controls["olstate"].updateValueAndValidity();

        this.registerForm.controls["olzipcode"].setValidators(null);
        this.registerForm.controls["olzipcode"].updateValueAndValidity();

        this.registerForm.controls["olhomeAddress"].reset();
        this.registerForm.controls["olcity"].reset();
        this.registerForm.controls["olstate"].reset();
        this.registerForm.controls["olzipcode"].reset();
    }

    fnCustomizeTestDrive(type: any) {
        if (type == 'P' && (DataHandler.customize_testdrive.includes('P') || DataHandler.customize_testdrive.includes('Y'))) {
            return true;
        } else if (type == 'H' && (DataHandler.customize_testdrive.includes('H') || DataHandler.customize_testdrive.includes('Y'))) {
            return true;
        } else if (type == 'O' && (DataHandler.customize_testdrive.includes('O') || DataHandler.customize_testdrive.includes('Y'))) {
            return true;
        } else {
            return false;
        }
    }

    dateChange(date: MatDatepickerInputEvent<Date>) {
        this.selectedDateTime(date.value);
        this.currentdate = this.datePipe.transform(date.value, 'MM/dd/yyyy');
    }

    selectedDateTime(date: any) {
        const day = date.getDay();
        if (day == 0) {
            this.constructtime('sunday');
        } else if (day == 1) {
            this.constructtime('monday');
        } else if (day == 2) {
            this.constructtime('tuesday');
        } else if (day == 3) {
            this.constructtime('wednesday');
        } else if (day == 4) {
            this.constructtime('thursday');
        } else if (day == 5) {
            this.constructtime('friday');
        } else if (day == 6) {
            this.constructtime('saturday');
        } else {
            return;
        }
    }

    constructtime(dayval: any) {
        var tmpStamp;
        var starttime = '09:00 AM';
        var closetime = '09:00 PM';
        if (dayval == 'sunday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_sunday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_sunday;
        } else if (dayval == 'monday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_monday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_monday;
        } else if (dayval == 'tuesday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_tuesday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_tuesday;
        } else if (dayval == 'wednesday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_wednesday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_wednesday;
        } else if (dayval == 'thursday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_thursday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_thursday;
        } else if (dayval == 'friday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_friday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_friday;
        } else if (dayval == 'saturday') {
            starttime = DataHandler.showroomTimingFilter?.showroom_open_saturday;
            closetime = DataHandler.showroomTimingFilter?.showroom_close_saturday;
        }
        if (starttime == 'null') {
            starttime = '09:00 AM';
        }
        if (closetime == 'null') {
            closetime = '09:00 PM';
        }
        var timevals = starttime?.split(" ");
        let openarry2: any[] = [];
        if (timevals && timevals[0]) {
            openarry2 = timevals[0]?.split(":");
        }
        var openhr = Number(openarry2[0]);
        var openmin = Number(openarry2[1]);

        var ctimevals = closetime?.split(" ");
        var closearry2 = ctimevals[0]?.split(":");
        var closehr = Number(closearry2[0]);
        var closemin = Number(closearry2[1]);
        if (ctimevals[1] == 'PM') {
            closehr = closehr + 12;
        }
        if (timevals[1] == 'PM') {
            openhr = openhr + 12;
        }
        this.times = [];
        for (let i = openhr; i <= closehr; i++) {
            var closej = 60;
            if (i == closehr) {
                closej = closemin;
            }
            for (let j = openmin; j < closej; j += 15) {
                if ((j == 0) && (i < 12))
                    tmpStamp = i + ':00' + ' AM';

                if ((j != 0) && (i < 12))
                    tmpStamp = i + ':' + j + ' AM';

                if ((j == 0) && (i >= 12)) {
                    let chk = i % 12;
                    if (chk == 0)
                        chk = 12;
                    tmpStamp = chk + ':00' + ' PM';
                }

                if ((j != 0) && (i >= 12)) {
                    let chk = i % 12;
                    if (chk == 0)
                        chk = 12;
                    tmpStamp = chk + ':' + j + ' PM';
                }
                this.times.push(tmpStamp);
            }
            openmin = 0;
        }
    }

    public adobe_sdg_event(event_type: any) {
        // console.log('TestDriveComponents-', event_type);
        try {
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
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
            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            interactionClick.page = "test-drive";
            formStart.formType = "eshop:satd-form";
            formStart.formDescription = "lead";
            formStart.displayType = "page";
            formStart.displayFormat = "in-page";
            if (event_type == 'initial-form-start') {
                AdobeSDGHandler.eventLogger("form-start", formStart);
                return;
            }

            if (event_type == 'validation-error-display') {
                errorDisplay.message = "Invalid form fields";
                errorDisplay.type = "form-validation";
            }

            if (event_type == 'api-error-display') {
                errorDisplay.message = "Error in API Response";
                errorDisplay.type = "service-availability";
            }

            if (event_type == 'iframe_pageload') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "consent-form:consent";
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return
            }

            if (event_type == 'upload_documents_pageload') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "document-upload:file-upload";
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return
            }

            if (event_type == 'document_details_pageload') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "upload-history:details";
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return
            }

            if (event_type == 'documet_upload_review') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "document-upload:preview";
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return
            }
            if (event_type == 'thankyoupage_load') {
                pageLoad.pageType = "overlay";
                pageLoad.pageName = "schedule-a-test-drive-confirmation";
                DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                AdobeSDGHandler.eventLogger("page-load", pageLoad);
                return
            }

            if (event_type == 'consent_form_return') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "consent-form:consent";
                interactionClick.description = "upload-your-documents:skip-upload";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }

            if (event_type == 'consent_form_next') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "consent-form:consent";
                interactionClick.description = "upload-your-documents:proceed";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }

            if (event_type == 'upload_document_return') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:file-upload";
                interactionClick.description = "upload-your-documents:skip-upload";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'document_details_submit') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "upload-history:details";
                interactionClick.description = "submit-upload-history:submit";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }

            if (event_type == 'browse_file_cta') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:file-upload";
                interactionClick.description = "upload-your-documents:browse-files";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'preview_start_over') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:preview";
                interactionClick.description = "preview-document:upload-again";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'dropfile_uploadDocument') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:file-upload";
                interactionClick.description = "upload-your-documents:file-upload";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'upload_document_submit') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:preview";
                interactionClick.description = "preview-document:proceed";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'proceed_to_thankyoupage') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "upload-history:details";
                interactionClick.description = "submit-upload-history:submit";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'start_over_click') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "upload-history:details";
                interactionClick.description = "submit-upload-history:upload-again";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'startOver_uploadDocument') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "consent-form:consent";
                interactionClick.description = "upload-your-documents:start-over";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'startOver_uploadDetails') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:file-upload";
                interactionClick.description = "upload-your-documents:start-over";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'startOver_submitHistory') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "upload-history:details";
                interactionClick.description = "submit-upload-history:start-over";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }
            if (event_type == 'startOver_previewDocument') {
                interactionClick.page = "schedule-a-test-drive";
                interactionClick.location = "document-upload:preview";
                interactionClick.description = "preview-document:start-over";
                AdobeSDGHandler.eventLogger('interaction-click', interactionClick);
                return
            }

            if (event_type == 'submit-test-drive') {
                formSubmit.formDescription = "lead";
                formSubmit.formType = "eshop:satd-form";
                formSubmit.displayType = "page";
                formSubmit.displayFormat = "in-page";
                formSubmit.hashedEmail = "";
                formSubmit.leadId = "";
                AdobeSDGHandler.eventLogger("form-submit", formSubmit);
                return;
            }

            AdobeSDGHandler.eventLogger("error-display", errorDisplay);
        } catch (e) {
            console.log('TestDriveComponents-adobe_sdg_event issue', e);
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

@Component({
    selector: 'test-drive-thankyou',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './thankyou-section.template.html',
    styleUrl: './test-drive.component.scss'
})

export class ThankYouComponent {
    currentdate: string = '';
    currenttime: string = '';
    dealername: string = '';
    heroImage: any;
    display_vehicle_name: string = '';

    constructor(public thankYouDialog: MatDialogRef<TestDriveComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private observableService: ObservableLiveData) {
        this.heroImage = DataHandler.heroImage;

    }

    ngOnInit() {
        this.display_vehicle_name = DataHandler.display_vehicle_name;
        this.currentdate = this.data.date;
        this.currenttime = this.data.time;
        this.dealername = this.data.dealername;
    }
    closepop_thankyou() {
        document.getElementById('backBtn')?.click();
        this.thankYouDialog.close();
    }
    closepop() {
        document.getElementById('backBtn')?.click();
    }

    closeTestDrive() {
        this.adobe_sdg_event('close-test-drive');
    }



    public adobe_sdg_event(event_type: any) {
        // console.log('ThankYouComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            interactionClick.site = "dealer";
            interactionClick.type = "func";
            interactionClick.location = "confirmation";
            interactionClick.name = "close";
            interactionClick.page = "schedule-a-test-drive";
            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);

        } catch (e) {
            console.log('ThankYouComponent-adobe_sdg_event issue', e);
        }
    }
}


@Component({
    selector: 'private-offer-message-dialog',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './private-offer-message-dialog.html',
    styleUrl: './test-drive.component.scss'
})

export class PrivateOfferMessageDialog {
    privateoffer: any;
    privateofferamount: any;
    firstname: any;
    lastname: any;
    certificatecode: any;
    offerexpire: any;
    make: any;
    popup: any;
    offerstatus: any;
    which_private_offer_popup: any = 1;
    open_private_offer_pop: any = 0;
    form: any;


    constructor(public privateOfferDialogRef: MatDialogRef<TestDriveComponent>, private restService: RestService, private eventEmitterService: EventEmitterService) {
        this.which_private_offer_popup = DataHandler.which_private_offer_popup;
        this.open_private_offer_pop = DataHandler.open_private_offer_pop;
        this.make = DataHandler.make;
        this.firstname = DataHandler.firstname;
        this.lastname = DataHandler.lastname;
        this.privateofferamount = DataHandler.privateofferamount;
        this.certificatecode = DataHandler.certificatecode;
        this.offerexpire = DataHandler.offerexpire;
        this.form = DataHandler.form;
        var amount = DataHandler.privateofferamount;
        var Form = this.form;
        MerkleHandler.merkleexecutor('private-offer-open', amount, Form);
    }
    ngOnInit() {

    }

    closepop() {
        this.privateOfferDialogRef.close();
        var Form = this.form;
        MerkleHandler.merkleexecutor('private-offer-continue', Form);
    }

    close() {
        this.privateOfferDialogRef.close();
        // var Form = this.form;
        // MerkleHandler.merkleexecutor('private-offer-close',Form);
    }

}
