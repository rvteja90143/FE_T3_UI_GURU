import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, HostListener } from '@angular/core';
import { EventEmitterService } from '../event-emitter.service';
import { CommonModule, DatePipe, ViewportScroller } from '@angular/common';
import { ObservableLiveData } from '../common/observable-live-data';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { DataHandler } from '../common/data-handler';
import { MerkleHandler } from '../common/merkle-handler';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { GA4Service } from '../services/ga4.service';
import { GA4DealerService } from '../services/ga4dealer.service';
import { RestService } from '../services/rest.service';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepicker, MatDatepickerActions, MatDatepickerInputEvent, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MaterialModule } from '../material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { select, Store } from '@ngrx/store';
import { dealerInfoDetailsNewResp } from '../app-store/app-component-selector';
import { Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';



@Component({
    selector: 'app-submit-to-dealer',
    standalone: true,
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, FormsModule, MatDividerModule, MatIconModule, MatDatepickerToggle, MatDatepickerModule, MatDatepicker, ReactiveFormsModule, MaterialModule, MatButtonModule, MatDatepickerActions],
    templateUrl: './submit-to-dealer.component.html',
    styleUrl: './submit-to-dealer.component.scss',
    providers: [DatePipe]
})
export class SubmitToDealerComponent implements OnDestroy {
    private inputSubject = new Subject<string>();
    isDeviceCheck: boolean;
    registerForm!: FormGroup;
    toggleflag: any;
    leaseDisplay: any;
    serviceleaseflag: any;
    cashDisplay: any;
    servicecashflag: any;
    financeDisplay: any;
    servicefinanceflag: any;
    accessoriesDisplay: any;
    accessoriesflag: any;
    selectedMode: any;
    showdelivery: any;
    submitted = false;
    firstime = 0;
    show = 0;
    currentDate = new Date();
    changedetected = 0;
    today: string;
    dealerinforesponse: any;

    showroomTimingFilter: any;
    switch_flag = 1;
    address: any = '';
    city: any = '';
    state: any = '';

    datecheck = 0;
    timecheck = 0;
    times: any = [];

    minDate: any;
    maxDate: any;

    autoEnable = 0;
    timeEnable = -1;
    testdrive_disclaimer: any;
    scheduledDeliveryDate: any;
    vehicleInfo: any;
    public unsubscribe$: Subject<void> = new Subject<void>();
    dealerinfo: any;
    packageoption: any;
    dealercode: any;
    isMobileScreen: boolean | undefined = false;
    renderer: any;
    vehicle_type: any;
    vin: any;
    dealername: any;
    display_vehicle_name: any;
    msrp: any;
    selectedLocation: string = 'Pick up at Dealership';
    paymentType = 'lease';
    tradein: string = '';
    tradein_adj: string = '';

    kbbyear: any = "";
    kbbmake: any = "";
    kbbmodel: any = "";
    kbbseries: any = "";
    kbbstyle: any = "";
    kbbmileage: any = "";
    kbbzip: any = "";
    kbbcondition: any = "";
    kbboptions: any = "";
    kbbprice: any = "";
    kbbtradein_value: any = "";
    kbbremainingvalue: any = "";
    style: string = '';
    mileage: string = '';
    zip: string = '';
    condition: string = '';
    vehicle: string = '';
    options: any = '';
    toggleVehicleInfo: boolean = false;
    heroImage: string = '';
    hasAdobeEventTriggered = false;
    debounceTimer: any = null;
    vehicleInfoAction: string | undefined;
    leaseResponseAvailable: any;
    financeResponseAvailable: any;
    showdeliveryText: any = '';
    vehicleStatus = true;
    hideDropdown: any;
    hideDealerText: any;
    cashResponseAvailable = true;
    @Output() deliveryChange = new EventEmitter<number>();
    @Input() isSubmitMatTabActive: boolean = false;

    constructor(private eventEmitterService: EventEmitterService, private datePipe: DatePipe, private observableService: ObservableLiveData, private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, private restService: RestService, private formBuilder: FormBuilder, private store: Store<any>,
        private cdr: ChangeDetectorRef, private viewportScroller: ViewportScroller,) {
        if (window.addEventListener) {  //ifram-events reading
            window.addEventListener("message", this.receiveMessage.bind(this), false);
        }
        else {
            (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
        }

        this.currentDate.setDate(this.currentDate.getDate() + 10);
        this.vehicle_type = DataHandler.vehicle_type;
        this.vin = DataHandler.vin;
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.isDeviceCheck = window.innerWidth < 980;
        if (this.vehicle_type == 'new') {
            this.showroomTimingFilter = (d: Date): boolean => {
                if (d != null) {
                    const day = d.getDay();
                    if (day == 0 && (DataHandler.showroomTimingFilter?.showroom_open_sunday == '' || DataHandler.showroomTimingFilter?.showroom_open_sunday == null || DataHandler.showroomTimingFilter?.showroom_open_sunday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_sunday == '' || DataHandler.showroomTimingFilter?.showroom_close_sunday == null || DataHandler.showroomTimingFilter?.showroom_close_sunday == 'null')) {
                        return false;
                    } else if (day == 1 && (DataHandler.showroomTimingFilter?.showroom_open_monday == '' || DataHandler.showroomTimingFilter?.showroom_open_monday == null || DataHandler.showroomTimingFilter?.showroom_open_monday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_monday == '' || DataHandler.showroomTimingFilter?.showroom_close_monday == null || DataHandler.showroomTimingFilter?.showroom_close_monday == 'null')) {
                        return false;
                    } else if (day == 2 && (DataHandler.showroomTimingFilter?.showroom_open_tuesday == '' || DataHandler.showroomTimingFilter?.showroom_open_tuesday == null || DataHandler.showroomTimingFilter?.showroom_open_tuesday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_tuesday == '' || DataHandler.showroomTimingFilter?.showroom_close_tuesday == null || DataHandler.showroomTimingFilter?.showroom_close_tuesday == 'null')) {
                        return false;
                    } else if (day == 3 && (DataHandler.showroomTimingFilter?.showroom_open_wednesday == '' || DataHandler.showroomTimingFilter?.showroom_open_wednesday == null || DataHandler.showroomTimingFilter?.showroom_open_wednesday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_wednesday == '' || DataHandler.showroomTimingFilter?.showroom_close_wednesday == null || DataHandler.showroomTimingFilter?.showroom_close_wednesday == 'null')) {
                        return false;
                    } else if (day == 4 && (DataHandler.showroomTimingFilter?.showroom_open_thursday == '' || DataHandler.showroomTimingFilter?.showroom_open_thursday == null || DataHandler.showroomTimingFilter?.showroom_open_thursday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_thursday == '' || DataHandler.showroomTimingFilter?.showroom_close_thursday == null || DataHandler.showroomTimingFilter?.showroom_close_thursday == 'null')) {
                        return false;
                    } else if (day == 5 && (DataHandler.showroomTimingFilter?.showroom_open_friday == '' || DataHandler.showroomTimingFilter?.showroom_open_friday == null || DataHandler.showroomTimingFilter?.showroom_open_friday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_friday == '' || DataHandler.showroomTimingFilter?.showroom_close_friday == null || DataHandler.showroomTimingFilter?.showroom_close_friday == 'null')) {
                        return false;
                    } else if (day == 6 && (DataHandler.showroomTimingFilter?.showroom_open_saturday == '' || DataHandler.showroomTimingFilter?.showroom_open_saturday == null || DataHandler.showroomTimingFilter?.showroom_open_saturday == 'null') && (DataHandler.showroomTimingFilter?.showroom_close_saturday == '' || DataHandler.showroomTimingFilter?.showroom_close_saturday == null || DataHandler.showroomTimingFilter?.showroom_close_saturday == 'null')) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        } else if (this.vehicle_type = 'used') {
            this.showroomTimingFilter = (d: Date): boolean => {
                if (d != null) {
                    const day = d.getDay();
                    if (day == 0 && (DataHandler.showroomTimingFilterUsed?.sunday.open == '' || DataHandler.showroomTimingFilter?.sunday.open == null || DataHandler.showroomTimingFilter?.sunday.open == 'null') && (DataHandler.showroomTimingFilter?.sunday.close == '' || DataHandler.showroomTimingFilter?.sunday.close == null || DataHandler.showroomTimingFilter?.sunday.close == 'null')) {
                        return false;
                    } else if (day == 1 && (DataHandler.showroomTimingFilterUsed?.monday.open == '' || DataHandler.showroomTimingFilterUsed?.monday.open == null || DataHandler.showroomTimingFilterUsed?.monday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.monday.close == '' || DataHandler.showroomTimingFilterUsed?.monday.close == null || DataHandler.showroomTimingFilterUsed?.monday.close == 'null')) {
                        return false;
                    } else if (day == 2 && (DataHandler.showroomTimingFilterUsed?.tuesday.open == '' || DataHandler.showroomTimingFilterUsed?.tuesday.open == null || DataHandler.showroomTimingFilterUsed?.tuesday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.tuesday.close == '' || DataHandler.showroomTimingFilterUsed?.tuesday.close == null || DataHandler.showroomTimingFilterUsed?.tuesday.close == 'null')) {
                        return false;
                    } else if (day == 3 && (DataHandler.showroomTimingFilterUsed?.wednesday.open == '' || DataHandler.showroomTimingFilterUsed?.wednesday.open == null || DataHandler.showroomTimingFilterUsed?.wednesday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.wednesday.close == '' || DataHandler.showroomTimingFilterUsed?.wednesday.close == null || DataHandler.showroomTimingFilterUsed?.wednesday.close == 'null')) {
                        return false;
                    } else if (day == 4 && (DataHandler.showroomTimingFilterUsed?.thursday.open == '' || DataHandler.showroomTimingFilterUsed?.thursday.open == null || DataHandler.showroomTimingFilterUsed?.thursday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.thursday.close == '' || DataHandler.showroomTimingFilterUsed?.thursday.close == null || DataHandler.showroomTimingFilterUsed?.thursday.close == 'null')) {
                        return false;
                    } else if (day == 5 && (DataHandler.showroomTimingFilterUsed?.friday.open == '' || DataHandler.showroomTimingFilterUsed?.friday.open == null || DataHandler.showroomTimingFilterUsed?.friday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.friday.close == '' || DataHandler.showroomTimingFilterUsed?.friday.close == null || DataHandler.showroomTimingFilterUsed?.friday.close == 'null')) {
                        return false;
                    } else if (day == 6 && (DataHandler.showroomTimingFilterUsed?.saturday.open == '' || DataHandler.showroomTimingFilterUsed?.saturday.open == null || DataHandler.showroomTimingFilterUsed?.saturday.open == 'null') && (DataHandler.showroomTimingFilterUsed?.saturday.close == '' || DataHandler.showroomTimingFilterUsed?.saturday.close == null || DataHandler.showroomTimingFilterUsed?.saturday.close == 'null')) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

        //console.log("this.showroomTimingFilter", DataHandler.showroomTimingFilter)
        this.heroImage = DataHandler.heroImage;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const currDate = new Date().getDate() + 1;
        const currDateEd = new Date().getDate() + 365;

        this.minDate = new Date(currentYear, currentMonth, currDate);
        this.maxDate = new Date(currentYear, currentMonth, currDateEd);

        this.constructtime('');
        this.showdelivery = DataHandler.showdelivery;
        this.showdeliveryText = DataHandler.schedule_delivery_disclimer;
        this.observableService.selectedPaymentType$.subscribe((value) => {
            this.paymentType = value;
        })
        this.registerForm = this.formBuilder.group({
            date: [null, Validators.required],
            time: [null, Validators.required],
            location: [null, [Validators.required]],

            hlhomeAddress: ['', Validators.required],
            hlcity: ['', Validators.required],
            hlstate: ['', Validators.required],
            hlzipcode: ['', Validators.required],

            olhomeAddress: ['', Validators.required],
            olcity: ['', Validators.required],
            olstate: ['', Validators.required],
            olzipcode: ['', Validators.required],

        });

        const date = new Date();
        this.today = date.toISOString().split('T')[0];
        this.eventEmitterService.checkSubmit.subscribe((param: any) => {
            this.onSubmit();
        })
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: Event): void {
	  this.isDeviceCheck = window.innerWidth < 980;
	}
    receiveMessage: any = (event: any) => {
        if (event.data.eventName == "pageLoaded") {
        }

        if (event.data.eventName == "formSubmitted" && event.data.pageId == 1) {
            MerkleHandler.merkleexecutor('tradein-bb-start', '');
            if (DataHandler.shifttradeinstart == 0) {
                DataHandler.shifttradeinstart = 1;
                ShiftDigitalHandler.shiftdigitalexecutor('tradein start');
                this.ga4Service.submit_to_api('TradeInBB', '', '', '', '', '', '').subscribe((response) => { });
            }
            this.vehicle = event.data.data[0].year + " " + event.data.data[0].make + " " + event.data.data[0].model + " " + event.data.data[0].series
            this.style = event.data.data[0].style;
            this.mileage = event.data.data[0].mileage;
            this.zip = event.data.data[0].zip;
            this.condition = event.data.data[0].condition;

            DataHandler.tradeinmake = event.data.data[0].make;
            DataHandler.tradeinmodel = event.data.data[0].model;
            DataHandler.tradeinseries = event.data.data[0].series;
            DataHandler.tradeinyear = event.data.data[0].year;
            DataHandler.tradeinstyle = event.data.data[0].style;
            DataHandler.tradeinzip = event.data.data[0].zip;
            DataHandler.tradeinmileage = event.data.data[0].mileage;
            DataHandler.tradeincondition = event.data.data[0].condition;

        }

        //Storing step 2 data
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 2) {
            this.options = event.data.data;
            DataHandler.tradeinoptions = event.data.data;
        }

        //Storing step 3 Price and sending ajax
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 5 && event.data.step == 0) {
            this.tradein = event.data.data[0].results.price;
            this.tradein_adj = event.data.data[0].Remainingvalue;

            DataHandler.tradeinvalue = this.tradein;
            DataHandler.tradeinadjvalue = this.tradein_adj;

            if (this.tradein_adj == '0' || this.tradein_adj == '') {
                this.tradein_adj = (this.tradein);
                DataHandler.tradeinadjvalue = this.tradein_adj;
            }
            // this.eventEmitterService.populatetradein(this.tradein);

        }

        //Storing step 4 Remainingvalue
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 5 && event.data.step == 1) {
            if (DataHandler.shiftdigitalbb == 0) {
                ShiftDigitalHandler.shiftdigitalexecutor('tradein bb submit');
                DataHandler.shiftdigitalbb = 1;
            }
            MerkleHandler.merkleexecutor('tradein-bb-submit', '');
            this.tradein_adj = event.data.data[0].RemainingValue;
            DataHandler.tradeinadjvalue = this.tradein_adj;

            if (this.tradein_adj == '0') {
                this.tradein_adj = (this.tradein);
                DataHandler.tradeinadjvalue = this.tradein_adj;
            }
            DataHandler.tradeinamount = Number(event.data.data[0].svtPrice);
            DataHandler.tradeinpayoff = DataHandler.tradeinamount - Number(DataHandler.tradeinadjvalue);
            this.eventEmitterService.populatetradein(this.tradein_adj);
            this.show = 1;
        }

        //storing the KBB details if present
        if (event.data["KBB_Trade-In_Advisor_Event"] != undefined) {

            if (event.data["KBB_Trade-In_Advisor_Event"]["event"] == "Trade-In Report Generated") {
                if (DataHandler.shiftdigitalkbb == 0) {
                    ShiftDigitalHandler.shiftdigitalexecutor('tradein kbb submit');
                    DataHandler.shiftdigitalkbb = 1;
                }
                MerkleHandler.merkleexecutor('tradein-kbb-submit', '', '');
                var kbb_data = event.data["KBB_Trade-In_Advisor_Event"];

                this.kbbyear = kbb_data["tradein_year"];
                this.kbbmake = kbb_data["tradein_make"];
                this.kbbmodel = kbb_data["tradein_model"];
                this.kbbseries = "";
                this.kbbstyle = kbb_data["tradein_style"];
                this.kbbmileage = kbb_data["tradein_mileage"];
                this.kbbzip = kbb_data["tradein_zip_code"];
                this.kbbcondition = kbb_data["tradein_condition"];

                if (kbb_data["tradein_options"] != "") {
                    var strval = kbb_data["tradein_options"]
                    var myarr = strval.split("|");
                    this.kbboptions = myarr;
                }

                this.kbbprice = kbb_data["kbb_tradein_value"];
                this.kbbtradein_value = kbb_data["kbb_tradein_value"];
                this.kbbremainingvalue = "0";

                this.tradein = this.kbbtradein_value;
                this.vehicle = kbb_data["tradein_year"] + " " + kbb_data["tradein_make"] + " " + kbb_data["tradein_model"];
                this.style = kbb_data["tradein_style"];
                this.mileage = kbb_data["tradein_mileage"];
                this.tradein_adj = kbb_data["kbb_tradein_value"];
                this.options = this.kbboptions;

                DataHandler.tradeinmake = kbb_data["tradein_make"];
                DataHandler.tradeinmodel = kbb_data["tradein_model"];
                DataHandler.tradeinseries = "";
                DataHandler.tradeinyear = kbb_data["tradein_year"];
                DataHandler.tradeinstyle = kbb_data["tradein_style"];
                DataHandler.tradeinzip = kbb_data["tradein_zip_code"];
                DataHandler.tradeinmileage = kbb_data["tradein_mileage"];
                DataHandler.tradeincondition = kbb_data["tradein_condition"];
                DataHandler.tradeinoptions = this.kbboptions;

                DataHandler.tradeinvalue = kbb_data["kbb_tradein_value"];
                DataHandler.tradeinadjvalue = kbb_data["kbb_tradein_value"];

                this.eventEmitterService.populatetradein(this.kbbtradein_value);
                this.show = 1;
            }
        }

    }


    isFormValid(): boolean {
        return this.registerForm.valid;
    }

    @Output() deliveryStatusUpdated = new EventEmitter<number>();
    @Output() formStatus = new EventEmitter<{ date: any, time: any, pristine: boolean }>();

    dateFocus() {
        this.registerForm.controls['date'].setErrors({ required: true });
      }
      
      dateBlur() {
        if (!this.registerForm.controls['date'].value) {
          this.registerForm.controls['date'].setErrors({ required: true });
        }
    }

    ngOnInit() {
        this.onResize();
        if (this.showdelivery === 'P') {
            this.selectedLocation = 'Pick up at Dealership';
        } else if (this.showdelivery === 'H') {
            this.selectedLocation = 'My Home';
        } else if (this.showdelivery === 'O') {
            this.selectedLocation = 'Other Location (No extra charge)';
        }

        this.vehicleStatus = DataHandler.Vehicle_delivery === 'N' ? false : true;
        this.observableService.leaseResponseAvailable$.subscribe((value) => {
            this.leaseResponseAvailable = value
        })

        this.observableService.financeResponseAvailable$.subscribe((value) => {
            this.financeResponseAvailable = value
        })

        this.display_vehicle_name = DataHandler.display_vehicle_name;
        this.msrp = DataHandler.msrp;        
        this.registerForm.valueChanges.subscribe(data => {
            this.changedetected = 1;
            DataHandler.deliverychanges = 1;
        });
            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeserviceleasepopulateFunction.subscribe((param: any) => {
                    if (param.length > 0) {
                        this.leaseDisplay = param;
                        DataHandler.SandPData = this.leaseDisplay;
                        DataHandler.servicelease = DataHandler.SandPData.map((item: { protection_name: any; id: any; protection_cost: number; }) => ({
                            package_name: item.protection_name,
                            id: item.id,
                            package_cost: item.protection_cost
                        }));
                        this.serviceleaseflag = 1;
                    } else {
                        this.leaseDisplay = {};
                        this.serviceleaseflag = 0;
                    }
                });

            //selected finance service plane
            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeservicefinancepopulateFunction.subscribe((param: any) => {
                    if (param.length > 0) {
                        this.financeDisplay = param;
                        DataHandler.SandPDataFinance = this.financeDisplay;
                        DataHandler.servicefinance = DataHandler.SandPDataFinance.map((item: { protection_name: any; id: any; protection_cost: number; }) => ({
                            package_name: item.protection_name,
                            id: item.id,
                            package_cost: item.protection_cost
                        }));
                        this.servicefinanceflag = 1;
                    } else {
                        this.financeDisplay = {};
                        this.servicefinanceflag = 0;
                    }
                });

            //selected cash service plane
            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeservicecashpopulateFunction.subscribe((param: any) => {
                    if (param.length > 0) {
                        this.cashDisplay = param;
                        DataHandler.servicecash = this.cashDisplay.map((item: { protection_name: any; id: any; protection_cost: number; }) => ({
                            package_name: item.protection_name,
                            id: item.id,
                            package_cost: item.protection_cost
                        }));
                        this.servicecashflag = 1;
                    } else {
                        this.cashDisplay = {};
                        this.servicecashflag = 0;
                    }
                });

            //selected accessories
            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokeaccessoriespopulateFunction.subscribe((param: any) => {
                    if (param.length > 0) {
                        this.accessoriesDisplay = param;
                        DataHandler.accessoriesInfo = this.accessoriesDisplay;
                        this.accessoriesflag = 1;
                    } else {
                        this.accessoriesDisplay = {};
                        this.accessoriesflag = 0;
                    }
                });
        // }
        this.showdelivery = DataHandler.showdelivery;
        this.testdrive_disclaimer = DataHandler.schedule_delivery_disclimer;
        this.dealercode = DataHandler.dealercode;
        this.registerForm.get('date')?.valueChanges.subscribe((dateValue) => {
            const timeValue = this.registerForm.get('time')?.value;
            if (dateValue && timeValue) {
                DataHandler.deliverychanges = 0;
            } else {
                DataHandler.deliverychanges = 1;
            }
        });

        this.registerForm.get('time')?.valueChanges.subscribe((timeValue) => {
            const dateValue = this.registerForm.get('date')?.value;

            if (dateValue && timeValue) {
                DataHandler.deliverychanges = 0;
            } else {
                DataHandler.deliverychanges = 1;
            }
            
        });

        this.registerForm.valueChanges.subscribe(() => {
            const dateValue = this.registerForm.get('date')?.value;
            const timeValue = this.registerForm.get('time')?.value;
            const locationValue = this.registerForm.get('location')?.value;
            const isPristine = this.registerForm.pristine;

            let homeFieldsValid = true;
            let otherFieldsValid = true;

            if (locationValue === 'My Home') {
                homeFieldsValid = !!this.registerForm.get('hlhomeAddress')?.value &&
                                 !!this.registerForm.get('hlcity')?.value &&
                                 !!this.registerForm.get('hlstate')?.value &&
                                 !!this.registerForm.get('hlzipcode')?.value;
            }
    
            if (locationValue === 'Other Location (No extra charge)') {
                otherFieldsValid = !!this.registerForm.get('olhomeAddress')?.value &&
                                   !!this.registerForm.get('olcity')?.value &&
                                   !!this.registerForm.get('olstate')?.value &&
                                   !!this.registerForm.get('olzipcode')?.value;
            }

            this.observableService.updateFormStatus({
                date: dateValue,
                time: timeValue,
                location: locationValue,
                homeFieldsValid: homeFieldsValid,
                otherFieldsValid: otherFieldsValid,
                pristine: isPristine,
            });

            const isFilled = this.isFormFullyFilled();
            this.observableService.updateFormFilledStatus(isFilled);

            const selectedLocation = this.registerForm.get('location')?.value;
            this.updateRequiredFields(selectedLocation);
            
        });

        this.observableService.tabChange$.subscribe(tabName => {
            if (tabName === 'Submit') {
              this.validateOnTabSwitch();
            }
        });

        setTimeout(() => {
            const selectedLocation = this.registerForm.get('location')?.value;
            this.updateRequiredFields(selectedLocation);
        });

        this.observableService.hideCalcSubject$.subscribe(value => {
            if (value !== null && value !== undefined) {
                this.hideDropdown = value;
                this.hideDealerText = value;
            }
        });

        this.observableService.cashResponseAvailable$.subscribe((value) => {
            this.cashResponseAvailable = value;
        });

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
                console.log("submit debounce");
        });
    }

    isFormFullyFilled(): boolean {
        const selectedLocation = this.registerForm.get('location')?.value;
        let requiredFieldsValid = true;
    
        // Check common fields (date, time)
        if (!this.registerForm.get('date')?.value || !this.registerForm.get('time')?.value) {
            requiredFieldsValid = false;
        }
    
        // Check fields based on selected location
        if (selectedLocation === 'My Home') {
            requiredFieldsValid = requiredFieldsValid &&
                !!this.registerForm.get('hlhomeAddress')?.value &&
                !!this.registerForm.get('hlcity')?.value &&
                !!this.registerForm.get('hlstate')?.value &&
                !!this.registerForm.get('hlzipcode')?.value;
        } else if (selectedLocation === 'Other Location (No extra charge)') {
            requiredFieldsValid = requiredFieldsValid &&
                !!this.registerForm.get('olhomeAddress')?.value &&
                !!this.registerForm.get('olcity')?.value &&
                !!this.registerForm.get('olstate')?.value &&
                !!this.registerForm.get('olzipcode')?.value;
        } 
        // Pickup at dealership may not require extra address fields, only date & time
        else if (selectedLocation === 'Pickup at Dealership') {
            requiredFieldsValid = requiredFieldsValid;
        }
    
        return requiredFieldsValid;
    }
    

    validateOnTabSwitch() {
        if (this.registerForm.dirty || this.registerForm.touched) { 
        this.submitted = true;
        this.registerForm.markAllAsTouched();
        this.registerForm.updateValueAndValidity();
        }
      }

    updateRequiredFields(selectedLocation: string) {
        const dateValue = this.registerForm.get('date')?.value;
        const timeValue = this.registerForm.get('time')?.value;

        if (this.registerForm.pristine) {
            DataHandler.deliverychanges = 0;
            this.deliveryStatusUpdated.emit(DataHandler.deliverychanges);
            return;
        }
    
        let allFieldsFilled = false;
    
        if (selectedLocation === 'Pick up at Dealership') {
            // Only date and time are required
            allFieldsFilled = !!dateValue && !!timeValue;
        } else if (selectedLocation === 'My Home') {
            // Date, time, and home address fields are required
            const homeFields = [
                this.registerForm.get('hlhomeAddress')?.value,
                this.registerForm.get('hlcity')?.value,
                this.registerForm.get('hlstate')?.value,
                this.registerForm.get('hlzipcode')?.value,
            ];
            allFieldsFilled = !!dateValue && !!timeValue && homeFields.every(field => !!field);
        } else if (selectedLocation === 'Other Location (No extra charge)') {
            // Date, time, and other location fields are required
            const otherFields = [
                this.registerForm.get('olhomeAddress')?.value,
                this.registerForm.get('olcity')?.value,
                this.registerForm.get('olstate')?.value,
                this.registerForm.get('olzipcode')?.value,
            ];
            allFieldsFilled = !!dateValue && !!timeValue && otherFields.every(field => !!field);
        }
    
        DataHandler.deliverychanges = allFieldsFilled ? 0 : 1;
        this.deliveryStatusUpdated.emit(DataHandler.deliverychanges);
    }
    

    emitFormStatus() {
        const dateValue = this.registerForm.get('date')?.value;
        const timeValue = this.registerForm.get('time')?.value;
        const isPristine = this.registerForm.pristine;
        this.formStatus.emit({ date: dateValue, time: timeValue, pristine: isPristine });
    }

    ngAfterViewInit() {
        this.registerForm.valueChanges.subscribe(() => {
            this.emitFormStatus();
        });
        setTimeout(() => { this.display_vehicle_name = DataHandler.display_vehicle_name; }, 1000)
        this.msrp = DataHandler.msrp;
        if (this.vehicle_type === 'new') {
            this.store
                .pipe(select(dealerInfoDetailsNewResp), takeUntil(this.unsubscribe$))
                .subscribe({
                    next: (data) => {
                        this.vehicleInfo = data.dealerDetails[0]?.vehicle_information
                        this.dealerinfo = data.dealerDetails[0]?.Dealer_info;
                        this.packageoption = data.dealerDetails[0]?.PackageAndOption_list;
                    }
                })
        }
        if (this.vehicle_type === 'used') {
            this.restService.get_Used_DealerInfo(this.vin, this.dealercode).subscribe((response) => {
                this.dealerinforesponse = response;
                var obj = JSON.parse(JSON.stringify(this.dealerinforesponse));

                this.vehicleInfo = obj?.result?.vehicle_information
                this.dealerinfo = obj?.result?.Dealer_info;
            });
        }
    }

    leaseFinanceCashSwitch(event: any) {
        this.paymentType = event?.value;
        this.adobe_sdg_event('finance-option', 'interaction-click', event?.value);
        this.observableService.setSelectedPaymentType(event?.value);
        const sectionOne = document.getElementById('PurchaseContainer') as HTMLElement;
        if(this.isDeviceCheck) {
            setTimeout(() => {
                sectionOne.scrollIntoView({ behavior: 'smooth' });
                this.viewportScroller.scrollToAnchor('sectionOne');
                this.cdr.detectChanges();
            }, 100);
        }
    }

    get myForm() {
        return this.registerForm.get('location');
    }

    get f() { return this.registerForm.controls; }
    @Output() formValuesChange = new EventEmitter<any>();

    onSubmit() {
        this.submitted = true;
        this.registerForm.markAllAsTouched();
        if (this.registerForm.valid) {
            this.formValuesChange.emit(this.registerForm.value);
            DataHandler.deliverychanges = 0;
        }
        if (this.registerForm.invalid) {
        // set focus to the first invalid control
        const firstInvalidControl: HTMLElement = document.querySelector('.is-invalid') as HTMLElement;
        if (firstInvalidControl) {
            firstInvalidControl.focus();
        }
        return;
    }
        
        if (this.registerForm.invalid) {
            MerkleHandler.merkleexecutor('scheduled-delivery-invalid');
            this.adobe_sdg_event('error-display', 'error', 'Invalid form fields', 'form-validation');
            // DataHandler.deliverychanges = 1;
            // return;
        }

        const selectedLocation = this.registerForm.get('location')?.value;
        const dateValue = this.registerForm.get('date')?.value;
        const timeValue = this.registerForm.get('time')?.value;

        let allFieldsFilled = false;

        if (selectedLocation === 'Pick up at Dealership') {
            allFieldsFilled = !!dateValue && !!timeValue;
        } else if (selectedLocation === 'My Home') {
            const homeFields = [
                this.registerForm.get('hlhomeAddress')?.value,
                this.registerForm.get('hlcity')?.value,
                this.registerForm.get('hlstate')?.value,
                this.registerForm.get('hlzipcode')?.value,
            ];
            allFieldsFilled = !!dateValue && !!timeValue && homeFields.every(field => !!field);
        } else if (selectedLocation === 'Other Location (No extra charge)') {
            const otherFields = [
                this.registerForm.get('olhomeAddress')?.value,
                this.registerForm.get('olcity')?.value,
                this.registerForm.get('olstate')?.value,
                this.registerForm.get('olzipcode')?.value,
            ];
            allFieldsFilled = !!dateValue && !!timeValue && otherFields.every(field => !!field);
        }
    
        // Set delivery change status
        DataHandler.deliverychanges = allFieldsFilled ? 0 : 1;
        this.cdr.detectChanges();
        
        // Emit form values if all required fields are filled
        if (allFieldsFilled) {
            this.formValuesChange.emit(this.registerForm.value);
        } else {
            return;
        }

        if (this.firstime == 1) {
            ShiftDigitalHandler.shiftdigitalexecutor('scheduled Delivery form submit');
            MerkleHandler.merkleexecutor('scheduled-delivery-end');
            this.ga4Service.submit_to_api('ScheduleDelivery', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4dealerService.submit_to_api_ga4dealer('ScheduleDelivery').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('ScheduleDelivery').subscribe((response: any) => { });
            this.firstime = 2;
        }

        DataHandler.scheduledelivery = this.registerForm.value;
        DataHandler.scheduledelivery.date = this.datePipe.transform(DataHandler.scheduledelivery?.date, 'MM/dd/yyyy');
        DataHandler.scheduledelivery.time = DataHandler.scheduledelivery?.time;
        this.changedetected = 0;
        // DataHandler.deliverychanges = 0;
        this.eventEmitterService.openfinalsubmit();
    }

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
      //  this.adobe_sdg_event("select-time");
   
    }


    shiftdigitaldate() {
        ShiftDigitalHandler.shiftdigitalexecutor('show date');
        this.adobe_sdg_event("select-date");
    }

    grabtime(obj: any, field1: any) {
        DataHandler.deliverychanges = 1;
        var str = obj.target.innerHTML;
        this.registerForm.controls[field1].setValue(str);
        this.timeEnable = -1;
        MerkleHandler.merkleexecutor('scheduled-delivery-start-time', '', str);
        GoogleAnalyticsHandler.googleAnalyticsExecutor('scheduled-delivery-start-time');
    }

    homeAddress() {
        this.selectedLocation = 'My Home';
        this.eventEmitterService.setSelectedLocation(this.selectedLocation);
        DataHandler.deliverychanges = 1;
        var homeAddress = <HTMLScriptElement>document.getElementById('homeAddress-delivery');
        homeAddress?.classList.add('showThis');

        var otherAddress = <HTMLScriptElement>document.getElementById('otherAddress-delivery');
        otherAddress?.classList.remove('showThis');

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

        MerkleHandler.merkleexecutor('scheduledelivery-deliverylocation-select', '', 'home');
        GoogleAnalyticsHandler.googleAnalyticsExecutor('scheduledelivery-deliverylocation-select', '', 'Delivery at Home');
    }

    otherAddress() {
        this.selectedLocation = 'Other Location (No extra charge)';
        this.eventEmitterService.setSelectedLocation(this.selectedLocation);
        DataHandler.deliverychanges = 1;
        var homeAddress = <HTMLScriptElement>document.getElementById('homeAddress-delivery');
        homeAddress?.classList.remove('showThis');
        var otherAddress = <HTMLScriptElement>document.getElementById('otherAddress-delivery');
        otherAddress?.classList.add('showThis');

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

        MerkleHandler.merkleexecutor('scheduledelivery-deliverylocation-select', '', 'other');
        GoogleAnalyticsHandler.googleAnalyticsExecutor('scheduledelivery-deliverylocation-select', '', 'Delivery at other location');

    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    atDealership() {
        this.selectedLocation = 'Pick up at Dealership';
        this.eventEmitterService.setSelectedLocation(this.selectedLocation);
        DataHandler.deliverychanges = 1;
        var homeAddress = <HTMLScriptElement>document.getElementById('homeAddress-delivery');
        homeAddress?.classList.remove('showThis');
        var otherAddress = <HTMLScriptElement>document.getElementById('otherAddress-delivery');
        otherAddress?.classList.remove('showThis');
        this.clearhomevalidations();
        this.clearothervalidations();
        MerkleHandler.merkleexecutor('scheduledelivery-deliverylocation-select', '', 'dealership');
        GoogleAnalyticsHandler.googleAnalyticsExecutor('scheduledelivery-deliverylocation-select', '', 'Delivery at Dealership');
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

    emit_vehicledetails() {
        this.eventEmitterService.gotovehicledetails(1);
    }

    track(obj: any) {
        MerkleHandler.merkleexecutor(obj);
    }

    fnCheckVehicalDelivery(type: any) {
        if (type == 'P' && (DataHandler.Vehicle_delivery.includes('P') || DataHandler.Vehicle_delivery.includes('Y'))) {
            return true;
        } else if (type == 'H' && (DataHandler.Vehicle_delivery.includes('H') || DataHandler.Vehicle_delivery.includes('Y'))) {
            return true;
        } else if (type == 'O' && (DataHandler.Vehicle_delivery.includes('O') || DataHandler.Vehicle_delivery.includes('Y'))) {
            return true;
        } else {
            return false;
        }
    }

    handleDeliveryClick() {
        this.adobe_sdg_event("delivery-option");
    }

    fnopenapplyforcredit() {
        this.eventEmitterService.fnOpenApplyForCredit();
    }

    openautofi() {
        this.eventEmitterService.fnOpenAutofi();
    }

    autofiapply() {
        MerkleHandler.merkleexecutor('autofiapply');
    }

    initialevent(date: MatDatepickerInputEvent<Date>) {
        DataHandler.deliverychanges = 1;
        if (this.firstime == 0) {
            this.scheduledDeliveryDate = this.datePipe.transform(date.value, 'MM/dd/yyyy');
            ShiftDigitalHandler.shiftdigitalexecutor('scheduled Delivery form start');
            MerkleHandler.merkleexecutor('scheduled-delivery-start-date', '', this.scheduledDeliveryDate);
            GoogleAnalyticsHandler.googleAnalyticsExecutor('scheduled-delivery-start-date');
            this.firstime = 1;
        }
        this.selectedDateTime(date.value);
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
            starttime = DataHandler.showroomTimingFilter.showroom_open_sunday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_sunday;
        } else if (dayval == 'monday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_monday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_monday;
        } else if (dayval == 'tuesday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_tuesday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_tuesday;
        } else if (dayval == 'wednesday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_wednesday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_wednesday;
        } else if (dayval == 'thursday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_thursday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_thursday;
        } else if (dayval == 'friday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_friday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_friday;
        } else if (dayval == 'saturday') {
            starttime = DataHandler.showroomTimingFilter.showroom_open_saturday;
            closetime = DataHandler.showroomTimingFilter.showroom_close_saturday;
        }
        if (starttime == 'null') {
            starttime = '09:00 AM';
        }
        if (closetime == 'null') {
            closetime = '09:00 PM';
        }
        var timevals = starttime.split(" ");
        var openarry2 = timevals[0].split(":");
        var openhr = Number(openarry2[0]);
        var openmin = Number(openarry2[1]);

        var ctimevals = closetime.split(" ");
        var closearry2 = ctimevals[0].split(":");
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

    ngOnDestroy() {
        this.eventEmitterService.invokeserviceleasepopulateFunction.unsubscribe();
        this.eventEmitterService.invokeservicefinancepopulateFunction.unsubscribe();
        this.eventEmitterService.invokeservicecashpopulateFunction.unsubscribe();
        this.eventEmitterService.invokeaccessoriespopulateFunction.unsubscribe();
    }

    vehicleInfoClick() {
        this.toggleVehicleInfo = !this.toggleVehicleInfo;

        if (this.toggleVehicleInfo) {
            this.vehicleInfoAction = "expand";
        }
        else {
            this.vehicleInfoAction = "collapse";
        }
        this.adobe_sdg_event("vehicle-info");
    }

    public adobe_sdg_event(event_type: any, event_name: any = '', param: any = '', param1: any = '') {
       // console.log('SubmitToDealerComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };

            if (event_type == 'error-display') {
                errorDisplay.message = param;
                errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }

            interactionClick.site = "dealer";
            interactionClick.type = "nav";
            interactionClick.page = "build-your-deal:confirm-your-deal";
            interactionClick.location = "dealer-information";

            if (event_type == 'dealer-address') {
                interactionClick.description = "view-on-map";
            }

            if (event_type == 'dealer-phone') {
                interactionClick.description = "click-to-call";
            }

            if (event_type == 'delivery-option' || event_type == 'select-date' || event_type == 'select-time') {
                interactionClick.type = "tool";
                interactionClick.location = "schedule-vehicle-delivery";
            }

            if (event_type == 'finance-option') {
                interactionClick.type = "func";
                interactionClick.description = param;
                interactionClick.name = 'purchase-option'
                interactionClick.location = "schedule-vehicle-delivery";
            }

            if (event_type == 'delivery-option') {
                interactionClick.description = "select-delivery-location";
            }

            if (event_type == 'select-date') {
                interactionClick.description = "select-date";
            }

            if (event_type == 'select-time') {
                interactionClick.description = "select-time";
            }

            if (event_type == 'vehicle-info') {
                interactionClick.type = "tool";
                interactionClick.location = "vehicle-information";
                interactionClick.description = `${this.vehicleInfoAction}-vehicle-info`;
            }

            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
        } catch (e) {
            console.log('SubmitToDealerComponent-adobe_sdg_event issue', e);
        }
    }
}


// transform(url: any) {
// return this.dom.bypassSecurityTrustResourceUrl(url);
// }






