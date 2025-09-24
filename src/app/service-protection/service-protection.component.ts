import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil,distinctUntilChanged } from 'rxjs';
import { serviceContractAction, serviceContractCashAction, serviceContractFinanceAction, serviceProtectionAction } from './service-protection-store/service-protection-action';
import { DataHandler } from '../common/data-handler';
import { getselectServiceProtectionState, getserviceContractDetailsState, getserviceContractFinanceDetailsState, getserviceContractCashDetailsState } from './service-protection-store/service-protection-selector';
import { ObservableLiveData } from '../common/observable-live-data';
import { serviceContract } from '../common/data-models';
import { RestService } from '../services/rest.service';
import { EventEmitterService } from '../event-emitter.service';
import { getLeaseDetailsState } from '../common/store/lease-details/lease-details-selector';
import { GA4DealerService } from '../services/ga4dealer.service';
import { MaterialModule } from '../material/material.module';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { valHooks } from 'jquery';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { GA4Service } from '../services/ga4.service';


@Component({
    selector: 'app-service-protection',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './service-protection.component.html',
    styleUrls: ['./service-protection.component.scss']
})



export class ServiceProtectionComponent implements OnInit, OnDestroy {
    public unsubscribe$: Subject<void> = new Subject<void>();

    public unsubscribelease$: Subject<void> = new Subject<void>();
    public unsubscribefinance$: Subject<void> = new Subject<void>();
    public unsubscribecash$: Subject<void> = new Subject<void>();

    selectedLeaseItems: any[] = [];
    selectedFinanceItems: any[] = [];
    selectedCashItems: any[] = [];

    vin: any
    serviceLease: any;
    serviceLeaseHeader: any;
    serviceLeaseLogo: any;

    pickedLeaseList: Array<any> = [];
    pickedLeaseIds: Array<any> = [];

    pickedFinanceList: Array<any> = [];
    pickedFinanceIds: Array<any> = [];

    pickedCashList: Array<any> = [];
    pickedCashIds: Array<any> = [];

    serviceContractLease: any;
    serviceContractLeaseHeader: any;
    serviceContractLeaseLogo: any;
    serviceContractLeaseURL: any;

    serviceFinance: any;
    serviceFinanceHeader: any;
    serviceFinanceLogo: any;

    serviceContractFinanceURL: any;
    serviceContractFinance: any;
    serviceContractFinanceHeader: any;
    serviceContractFinanceLogo: any;

    serviceCash: any;
    serviceCashHeader: any;
    serviceCashLogo: any;
    serviceLeaseURL: any;

    serviceContractCash: any;
    serviceContractCashHeader: any;
    serviceContractCashLogo: any;
    serviceContractCashURL: any;

    checkWavePlans: any = false;
    checkWaveBenefits: any = false;

    serviceWaveLease: any;
    serviceWaveLeaseTitle: any;
    serviceWaveLeaseDescription: any;

    serviceWaveFinance: any;
    serviceWaveFinanceTitle: any;
    serviceWaveFinanceDescription: any;

    serviceWaveCash: any;
    serviceWaveCashTitle: any;
    serviceWaveCashDescription: any;

    servicePlanSectionHeader: any;

    activeTab: string = 'lease';

    customplan = 0;
    leasedefaulttermduration: any;
    leasetermduration: any;

    financedefaulttermduration: any;
    financetermduration: any;

    serviceContract = 0;  //0 krna hai
    makeyear: any;
    make_url: any;

    switch_flag = 1;
    togglecontrol = 1;
    selectedMode: string = 'lease';
    accessoriesExterior: boolean = false;
    rotateChange: any = '';
    accessories: any;
    displayAccessories: Array<any> = [];
    selectedAccessories: Array<any> = [];
    customize_accessories: any;
    leaseplanname: any;
    financeplanname: any;
    cashplanname: any;

    servicepricelease: any;
    servicepricefinance: any;
    servicepricecash: any;

    leasepercentage: any;
    financepercentage: any;
    cashpercentage: any;

    lease_percentageamount: any;
    finance_percentageamount: any;
    cash_percentageamount: any;

    lease_msrp_month = [];
    finance_msrp_month: any;
    cash_msrp_month: any;

    serviceContractLeaseFlag = 0;
    serviceContractFinanceFlag = 0;
    serviceContractCashFlag = 0;

    serviceleaseavailable: boolean = true;
    servicefinanceavailable: boolean = true;
    servicecashavailable: boolean = true;
    leaseLoading: boolean = true;
    financeLoading: boolean = true;
    cashLoading: boolean = true;
    make: any;
    showMore: boolean = false;
    wordLimit: number = 20;
    private subscription: Subscription | null = null;
    isMobileScreen: boolean | undefined = false;
    termValue: any;
    serviceStatus: any;
    serviceItem: any;

    leaseResponseAvailable : any;
    financeResponseAvailable : any;

    


    constructor(private store: Store<any>, private ga4dealerService: GA4DealerService, private observableservice: ObservableLiveData, private restService: RestService, private eventEmitterService: EventEmitterService,
        private ga4Service: GA4Service) {
        this.isMobileScreen = DataHandler.isMobileScreen;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.unsubscribelease$.next();
        this.unsubscribelease$.complete();

        this.unsubscribefinance$.next();
        this.unsubscribefinance$.complete();

        this.unsubscribecash$.next();
        this.unsubscribecash$.complete();
    }

    ngOnInit() {
        this.vin = DataHandler.vin
        this.makeyear = DataHandler.year;
        this.make_url = DataHandler.make_url;

        this.observableservice.leaseResponseAvailable$.subscribe((value) =>{
            this.leaseResponseAvailable = value
        })

        this.observableservice.financeResponseAvailable$.subscribe((value)=>{
            this.financeResponseAvailable = value
        })

        this.observableservice.selectedPaymentType$.subscribe((value) => {
            this.activeTab = value;
            //console.log("activetab",this.activeTab)
            this.selectedMode = value;

        })

        this.observableservice.selectedleaseterm$.subscribe((value) => {
            this.leasedefaulttermduration = value
            //DataHandler.leasedafaultterm = value
            //console.log("leasedefaulttermduration",this.leasedefaulttermduration)
        })

        this.observableservice.leaseTermList$.subscribe((value) => {
            this.leasetermduration = value
        })

        this.observableservice.financeTermList$.subscribe((value) => {
            this.financetermduration = value
            //console.log("list",value)
        })

        this.observableservice.selectedFinanceterm$.subscribe((value) => {
            this.financedefaulttermduration = value
            DataHandler.financedafaultterm = value
        })

        this.subscription = this.observableservice.getLeasePlane$.subscribe(() => {
            this.getleaseServicePlane();
        })

        this.subscription = this.observableservice.getFinancePlane$.subscribe(() => {
            this.getFinanceServicePlane();
        })

        this.subscription = this.observableservice.getCashPlane$.subscribe(() => {
            this.getCashServicePlane();
        })


        this.store.dispatch(serviceProtectionAction({ vin: this.vin }))


    }

    ngAfterViewInit() {
        this.get_service_protection();
        //this.terms_settings();
        this.displayLeasePlanefromleaseContract();
        this.displayFinancePlanceFromFinanceContract();
        this.displayCashPlanceFromCashContract();

    }

    get_service_protection() {
        this.store.pipe(select(getselectServiceProtectionState),
            takeUntil(this.unsubscribe$)).subscribe({
                next: (data) => {
                    let obj = JSON.parse(JSON.stringify(data.serviceProtection));
                    if (obj !== null) {
                        //console.log("obj:",obj)
                        this.customplan = obj?.custom_plan_added;
                        // DataHandler.customPlane = this.customplan;
                        DataHandler.custom_plan_added = this.customplan
                        this.servicePlanSectionHeader = obj?.service_protections.planHeader;

                        // this.serviceLeaseHeader = obj?.service_protections.header.lease.service_header;
                        // this.serviceLeaseLogo = obj?.service_protections.header.lease.service_logo.replace('\r\n',''); // Added replace to remove unsafe text from image url
                         
                        if(obj?.service_protections.header?.lease?.service_header)
                            {
                              this.serviceLeaseHeader = obj?.service_protections.header?.lease?.service_header;
                              this.serviceLeaseLogo =  obj?.service_protections.header?.lease?.service_logo.replace('\r\n','');
                            }
                            else if(obj?.service_protections.header?.lease?.t3_service_header)
                            {
                              this.serviceLeaseHeader = obj?.service_protections.header?.lease?.t3_service_header;
                              this.serviceLeaseLogo = obj?.service_protections.header?.lease?.t3_service_logo.replace('\r\n','');
                            }

                        // this.serviceFinanceHeader = obj?.service_protections.header.finance.service_header;
                        // this.serviceFinanceLogo = obj?.service_protections.header.finance.service_logo.replace('\r\n','');

                        if(obj?.service_protections.header?.finance?.service_header)
                            {
                              this.serviceFinanceHeader = obj?.service_protections.header?.finance?.service_header;
                              this.serviceFinanceLogo = obj?.service_protections.header?.finance?.service_logo.replace('\r\n','');
                            }
                            else if(obj?.service_protections.header.finance?.t3_service_header)
                            {
                              this.serviceFinanceHeader = obj?.service_protections.header?.finance?.t3_service_header;
                              this.serviceFinanceLogo = obj?.service_protections.header?.finance?.t3_service_logo.replace('\r\n','');
                            }

                        if(DataHandler.vehicle_type =='new'){
                            // this.serviceCashHeader = obj?.service_protections.header.cash.service_header;
                            // this.serviceCashLogo = obj?.service_protections?.header.cash.service_logo.replace('\r\n','');

                            if(obj?.service_protections.header?.cash?.service_header)
                                {
                                  this.serviceCashHeader = obj?.service_protections.header?.cash?.service_header;
                                  this.serviceCashLogo = obj?.service_protections.header?.cash?.service_logo.replace('\r\n','');
                                }
                                else if(obj?.service_protections.header?.cash?.t3_service_header)
                                {
                                  this.serviceCashHeader = obj?.service_protections.header?.cash?.t3_service_header;
                                  this.serviceCashLogo = obj?.service_protections?.header?.cash?.t3_service_logo.replace('\r\n','');
                                }
                        }

                        this.checkWavePlans = obj?.service_protections.checkWavePlans;
                        if(DataHandler.vehicle_type =='new'){
                            this.checkWaveBenefits = obj?.wave_benefits.checkWaveBenefits;

                            this.serviceWaveLease = obj?.wave_benefits.plans.lease;
                            this.serviceWaveLeaseTitle = obj?.wave_benefits.header.lease.title;
                            this.serviceWaveLeaseDescription = obj?.wave_benefits.header.lease.description;

                            this.serviceWaveFinance = obj?.wave_benefits.plans.finance;
                            this.serviceWaveFinanceTitle = obj?.wave_benefits.header.finance.title;
                            this.serviceWaveFinanceDescription = obj?.wave_benefits.header.finance.description;
                        
                            this.serviceWaveCash = obj?.wave_benefits.plans.cash;
                            this.serviceWaveCashTitle = obj?.wave_benefits.header.cash.title;
                            this.serviceWaveCashDescription = obj?.wave_benefits.header.cash.description;
                        }
                        if (this.customplan == 0) {
                            this.checkWavePlans = true;
                            this.checkWaveBenefits = true;
                            this.serviceContract = 1;
                        } else {
                            this.serviceLease = obj.service_protections.plans.lease;
                            //console.log("serviceLease",this.serviceLease)
                            this.serviceFinance = obj.service_protections.plans.finance;
                            this.serviceCash = obj.service_protections.plans.cash;
                            if (this.serviceLease != '' && this.serviceLease != undefined) {
                                this.leaseLoading = false
                            }
                            else {
                                this.leaseLoading = false
                                this.serviceleaseavailable = false;
                            }

                            if (this.serviceFinance != '' && this.serviceFinance != undefined) {
                                this.financeLoading = false
                            }
                            else {
                                this.financeLoading = false
                                this.servicefinanceavailable = false;
                            }

                            if (this.serviceCash != '' && this.serviceCash != undefined) {
                                this.cashLoading = false
                            }
                            else {
                                this.cashLoading = false
                                this.servicecashavailable = false;
                            }

                            // console.log("checkWavePlans",this.checkWavePlans,this.activeTab)

                        }
                    }
                }
            })
    }

    terms_settings() {

        // this.store
        //   .pipe(select(getLeaseDetailsState), takeUntil(this.unsubscribe$))
        //   .subscribe({
        //     next: (data) => {
        //       if (data != null) {
        //         var leasedetails = data.leaseDetails
        //         this.leasetermduration = leasedetails?.payload_calculation.terms_list
        //         this.observableservice.setSelectedLeaseTerm(leasedetails?.payload_calculation?.default_term)
        //       }
        //     }, error: (error) => {
        //       // Do nothing
        //     }
        //   });

        //this.financedefaulttermduration = DataHandler.financedafaultterm;
        //this.financetermduration = DataHandler.termdurationfinance;
    }

    fntermduration(obj: any) {
        //var term = obj.currentTarget?.value
        var term = obj?.value;
        //When lease,finance term is changing calling the respected api 
        if (this.activeTab === 'lease') {
            this.observableservice.setSelectedLeaseTerm(term)
            DataHandler.previousleaseterm = term
            DataHandler.leasedafaultterm = term;
            this.getleaseServicePlane();
            this.observableservice.getLeaseDetails();
             setTimeout(()=>{
                this.eventEmitterService.paymentleaserefresh([]);
            },500)

        }
        else if (this.activeTab === 'finance') {
            this.observableservice.setSelectedFinanceTerm(term)
            DataHandler.previousfinanceterm = term
            DataHandler.financedafaultterm = term;
            this.getFinanceServicePlane();
        }
        this.adobe_sdg_event("term-switch", term);
    }

    leaseFinanceCashSwitch(obj: any) {
        //this.observableservice.setSelectedPaymentType(obj.currentTarget?.value);
        this.observableservice.setSelectedPaymentType(obj?.value);

        if (this.customplan == 0) {
            if (this.activeTab == 'lease') {
                this.ga4dealerService.fire_asc_events('ServiceProtection-lease').subscribe((response: any) => { });  
                if (DataHandler.leaseServiceContract == false) {
                    DataHandler.leaseServiceContract = true
                    DataHandler.previousleaseterm = DataHandler.leasedafaultterm
                    this.getleaseServicePlane();
                }
            }
            else if (this.activeTab == 'finance') {
                this.ga4dealerService.fire_asc_events('ServiceProtection-finance').subscribe((response: any) => { });
                if (DataHandler.financeServiceContract == false) {
                    DataHandler.financeServiceContract = true
                    DataHandler.previousfinanceterm = DataHandler.financedafaultterm
                    this.getFinanceServicePlane();
                }
            }
            else {
                this.ga4dealerService.fire_asc_events('ServiceProtection-cash').subscribe((response: any) => { });
                if (DataHandler.cashServiceContract == false) {
                    DataHandler.cashServiceContract = true
                    this.getCashServicePlane();
                }
            }
        }
        this.adobe_sdg_event("option-switch")
    }

    isItemSelected(itemId: any, selectedItems: any[]): boolean {
        return selectedItems.some(item => item.id === itemId);
    }


    oncheckitem(event: any, item: any, serviceType: any = '') {
        const isChecked = event.target.checked;

        if (serviceType === 'lease') {
            var selectedLeaseIds: any[] = []
            this.updateSelectedItems(isChecked, item, this.selectedLeaseItems);
            if (this.customplan == 0) {
                this.selectedLeaseItems.forEach((items: any) => {
                    selectedLeaseIds.push(items.protection_value);
                })
            } else {
                this.selectedLeaseItems.forEach((items: any) => {
                    selectedLeaseIds.push(items.id);
                })
            }
            DataHandler.serviceleaseIds = selectedLeaseIds;
            //console.log("callTimes")
            //need to call lease api  here and pass DataHandler.serviceleaseIds as a value of user_service_a_protection
            this.eventEmitterService.populateleaseprotection(this.selectedLeaseItems);
            setTimeout(() => {
                this.eventEmitterService.paymentleaserefresh([]);
            }, 500);
        } else if (serviceType === 'finance') {
            var selectedFinacneIds: any[] = []
            this.updateSelectedItems(isChecked, item, this.selectedFinanceItems);
            if (this.customplan == 0) {
                this.selectedFinanceItems.forEach((items: any) => {
                    selectedFinacneIds.push(items.protection_value);
                });
            } else {
                this.selectedFinanceItems.forEach((items: any) => {
                    selectedFinacneIds.push(items.id);
                });
            }
            DataHandler.servicefinanceIds = selectedFinacneIds
            //need to call finance api  here and pass DataHandler.servicefinanceIds as a value of user_service_a_protection
            this.eventEmitterService.populatefinanceeprotection(this.selectedFinanceItems);
            setTimeout(() => {
                this.eventEmitterService.paymentfinancerefresh([]);
            }, 500);
        } else if (serviceType === 'cash') {
            var selectedCashIds: any[] = []
            this.updateSelectedItems(isChecked, item, this.selectedCashItems);
            if (this.customplan == 0) {
                this.selectedCashItems.forEach((items: any) => {
                    selectedCashIds.push(items.protection_value);
                });
            } else {
                this.selectedCashItems.forEach((items: any) => {
                    selectedCashIds.push(items.id);
                });
            }
            DataHandler.servicecashIds = selectedCashIds

            //need to call cash api  here and pass DataHandler.serviceCashIds as a value of user_service_a_protection

            this.eventEmitterService.populatecashprotection(this.selectedCashItems);
            setTimeout(() => {
                this.eventEmitterService.paymentcashrefresh([]);
            }, 500);
        }
        this.ga4Service.submit_to_api('Accessories','','','',DataHandler.objActivePaymentData.activeTab,item.accessories_title,'Accessories').subscribe((response) => {});
        this.ga4dealerService.submit_to_api_ga4dealer('Accessories').subscribe((response: any) => {});
        this.ga4dealerService.fire_asc_events('Accessories').subscribe((response: any) => {});
        ShiftDigitalHandler.shiftdigitalexecutoraccessories('add accessories');
    }
    onToggleItemSelection(event: any, item: any, serviceType: string = '') {
        const isSelected = this.isItemSelected(item.id, this.getSelectedItems(serviceType));  // Check if the item is selected
        this.serviceItem = item;
        // Toggle the selection state
        if (isSelected) {
            // Remove the item from the selected list
            this.removeItemFromSelection(item, serviceType);
            this.serviceStatus = "remove";
        } else {
            // Add the item to the selected list
            this.addItemToSelection(item, serviceType);
            this.serviceStatus = "add";
        }

        // Update the relevant DataHandler and emit events for each service type
        if (serviceType === 'lease') {
            this.updateServiceIds(this.selectedLeaseItems, 'lease');
        } else if (serviceType === 'finance') {
            this.updateServiceIds(this.selectedFinanceItems, 'finance');
        } else if (serviceType === 'cash') {
            this.updateServiceIds(this.selectedCashItems, 'cash');
        }
        this.adobe_sdg_event("select-service-protection", this.serviceStatus, item.protection_name);
    }

    addItemToSelection(item: any, serviceType: string) {
        // Add item to the correct selected items array based on service type
        if (serviceType === 'lease') {
            this.selectedLeaseItems.push(item);           
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,this.leasedefaulttermduration,DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
            DataHandler.shiftdigitaladdoname = item.protection_name;
            DataHandler.shiftdigitaladdontype = 'FI';
            ShiftDigitalHandler.shiftdigitalexecutorSNP("Lease Service and Protection Add");
        } else if (serviceType === 'finance') {
            this.selectedFinanceItems.push(item);
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,this.financedefaulttermduration,DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
            DataHandler.shiftdigitaladdoname = item.protection_name;
            DataHandler.shiftdigitaladdontype = 'FI';
            ShiftDigitalHandler.shiftdigitalexecutorSNP("Finance Service and Protection Add");
        } else if (serviceType === 'cash') {
            this.selectedCashItems.push(item);
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,'',DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
            DataHandler.shiftdigitaladdoname = item.protection_name;
            DataHandler.shiftdigitaladdontype = 'FI';
            ShiftDigitalHandler.shiftdigitalexecutorSNP("Cash Service and Protection Add");
        }
    }

    removeItemFromSelection(item: any, serviceType: string) {
        // Remove item from the correct selected items array based on service type
        if (serviceType === 'lease') {
            this.selectedLeaseItems = this.selectedLeaseItems.filter((i) => i.id !== item.id);
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,this.leasedefaulttermduration,DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
        } else if (serviceType === 'finance') {
            this.selectedFinanceItems = this.selectedFinanceItems.filter((i) => i.id !== item.id);
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,this.financedefaulttermduration,DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
        } else if (serviceType === 'cash') {
            this.selectedCashItems = this.selectedCashItems.filter((i) => i.id !== item.id);
            this.ga4Service.submit_to_api('ServiceProtection','',this.leaseplanname,'',DataHandler.objActivePaymentData.activeTab,'','').subscribe((response) => {});
            this.ga4dealerService.submit_to_api_ga4dealer('ServiceProtection').subscribe((response: any) => {});
            this.ga4dealerService.fire_asc_events('ServiceProtection').subscribe((response: any) => {});
        }
    }

    updateServiceIds(selectedItems: any[], serviceType: string) {
        let selectedIds: any[] = [];

        // Extract the protection ids or other properties based on custom plan
        if (this.customplan == 0) {
            selectedItems.forEach((item) => {
                selectedIds.push(item.protection_value);
            });
        } else {
            selectedItems.forEach((item) => {
                selectedIds.push(item.id);
            });
        }

        // Update the corresponding DataHandler service ids
        if (serviceType === 'lease') {
            DataHandler.serviceleaseIds = selectedIds;
            this.eventEmitterService.populateleaseprotection(selectedItems);
        } else if (serviceType === 'finance') {
            DataHandler.servicefinanceIds = selectedIds;
            this.eventEmitterService.populatefinanceeprotection(selectedItems);
        } else if (serviceType === 'cash') {
            DataHandler.servicecashIds = selectedIds;
            this.eventEmitterService.populatecashprotection(selectedItems);
        }

        // Trigger refresh events
        setTimeout(() => {
            if (serviceType === 'lease') {
                this.eventEmitterService.paymentleaserefresh([]);
            } else if (serviceType === 'finance') {
                this.eventEmitterService.paymentfinancerefresh([]);
            } else if (serviceType === 'cash') {
                this.eventEmitterService.paymentcashrefresh([]);
            }
        }, 500);
    }

    getSelectedItems(serviceType: string) {
        // Return the selected items based on the service type
        if (serviceType === 'lease') {
            return this.selectedLeaseItems;
        } else if (serviceType === 'finance') {
            return this.selectedFinanceItems;
        } else if (serviceType === 'cash') {
            return this.selectedCashItems;
        }
        return [];
    }


    // Update selected items array
    updateSelectedItems(isChecked: boolean, item: any, selectedItems: any[]) {
        if (isChecked) {
            selectedItems.push(item);
        } else {
            const index = selectedItems.findIndex((selectedItem) => selectedItem.id === item.id);
            if (index > -1) {
                selectedItems.splice(index, 1);
            }
        }
    }


    getleaseServicePlane() {
        let currentDate = new Date();
        let dt = this.restService.leftpad(currentDate.getMonth() + 1, 2) +
            '/' + this.restService.leftpad(currentDate.getDate(), 2) +
            '/' + currentDate.getFullYear();
        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = DataHandler.dealerzip;
        }

        let leaseserviceContractpayload: serviceContract = {
            vin: this.vin,
            test_code: '',
            termsInMonths: DataHandler.leasedafaultterm,
            currentOdometer: '0',
            milesperyear: '10000',
            customerAddressLine1: '',
            customerAddressLine2: '',
            customerCity: '',
            customerLastName: 'test',
            customerState: '',
            customerZipCode: zip,
            dealerCode: DataHandler.dealer,
            dealerState: DataHandler.dealerstate,
            deductible: '100',
            engineType: '',
            eppFlag: '',
            isCommercial: 'N',
            isLease: 'Y',
            leaseOrLoanTerm: DataHandler.leasedafaultterm,
            make: DataHandler.make,
            model: DataHandler.model,
            modelYear: DataHandler.year,
            optionSaleDate: dt,
            paymentMode: 'LE',
            productLine: 'DLR',
            source: 'ESHOP',
            vehicleInServiceDate: dt,
        }

        this.store.dispatch(serviceContractAction({ payload: leaseserviceContractpayload }));
    }

    displayLeasePlanefromleaseContract() {
        this.store
            .pipe(
                select(getserviceContractDetailsState),
                takeUntil(this.unsubscribelease$),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev.serviceContractDetails) === JSON.stringify(curr.serviceContractDetails))
            )
            .subscribe({
                next: (data) => {
                    var obj = JSON.parse(JSON.stringify(data?.serviceContractDetails));
                    if (obj != null) {
                        this.servicepricelease = obj?.customize_serviceprice;
                        //console.log("serviceLease:",this.serviceLease)
                        DataHandler.servicepricelease = this.servicepricelease;
                        this.leasepercentage = obj?.lease_percentage;
                        var pickedLeaseList = [];
                        var pickedLeaseIds = [];
                        var selectedLeaseIds: any[] = [];
                        this.make = DataHandler.make?.toLowerCase();
                        this.serviceContractLease = obj.service_protections;
                        var newPlan: any = [];
                        var displayLease: Array<any> = [];
                        for (let i = 0; i < this.serviceContractLease?.length; i++) {
                            newPlan[i] = {};
                            newPlan[i].finance_type = "lease";
                            newPlan[i].optioncode = this.serviceContractLease[i].optionCode;
                            newPlan[i].protection_name = this.serviceContractLease[i].categoryDescription.replace("[CNM]", "[NEW]").replace("[NEW]", "").toLowerCase();
                            this.serviceContractLease[i].categoryDescriptionAPI = this.serviceContractLease[i].categoryDescription.replace(" [CNM]", " [NEW]").replace(" [NEW]", "");
                            //newPlan[i].protection_cost = this.serviceContractLease[i].msrpTotal;
                            newPlan[i].protection_cost_duration = '';
                            newPlan[i].mile = this.serviceContractLease[i].miles;
                            newPlan[i].protection_cost = newPlan[i].msrpmonth = this.serviceContractLease[i].msrpPerMonth;
                            newPlan[i].msrbase = this.serviceContractLease[i].msrpBase;
                            var mile_lenght = this.serviceContractLease[i].miles.toString().split('');
                            if (newPlan[i].mile == 999999) {
                                newPlan[i].mile = 'unlimited';
                            }
                            newPlan[i].deductible = this.serviceContractLease[i].deductible;
                            newPlan[i].term = this.serviceContractLease[i].terms;
                            newPlan[i].categoryCode = this.serviceContractLease[i].categoryCode;
                            newPlan[i].id = i + 1;

                            newPlan[i].percentage = this.serviceContractLease[i].msrpPerMonth * this.leasepercentage / 100;
                            //newPlan[i].lease_percentageamount = newPlan[i].percentage + newPlan[i].msrpmonth;
                            newPlan[i].lease_percentageamount = this.serviceContractLease[i].msrpTotal;
                            newPlan[i].protection_value = this.serviceContractLease[i].categoryCode + "|" + this.serviceContractLease[i].reportingDescription + "|" + newPlan[i].lease_percentageamount + "|" + this.serviceContractLease[i].terms;
                            newPlan[i].protection_description = this.getImageOrDescription(obj.discription, this.serviceContractLease[i].categoryDescription);
                            newPlan[i].plan_image_url = this.getImageOrDescription(obj.images, this.serviceContractLease[i].categoryDescription);

                            for (let j = 0; j < this.pickedLeaseList.length; j++) {
                                if (this.pickedLeaseList[j].package_name == newPlan[i].protection_name) {
                                    newPlan[i].check = true;
                                    pickedLeaseList.push({ "package_name": newPlan[i].protection_name, "id": newPlan[i].id });
                                    pickedLeaseIds.push(newPlan[i].protection_value);

                                    if (this.customplan == 1) {
                                        displayLease.push({ "title": newPlan[i].protection_name, "desc": newPlan[i].protection_description, "cost": newPlan[i].protection_cost, "duration": newPlan[i].protection_cost_duration, "term": newPlan[i].term, "customplan": this.customplan });
                                        if (newPlan[i].protection_cost != null)
                                            this.pickedLeaseList[i].package_cost = newPlan[i].protection_cost + ' ' + newPlan[i].protection_cost_duration;
                                    } else if (this.customplan == 0) {
                                        displayLease.push({ "title": newPlan[i].protection_name, "desc": newPlan[i].protection_description, "cost": newPlan[i].lease_percentageamount, "duration": newPlan[i].protection_cost_duration, "term": newPlan[i].term, "pricedisplay": this.servicepricelease, "customplan": this.customplan });
                                        if (newPlan[i].protection_cost != null)
                                            this.pickedLeaseList[i].package_cost = newPlan[i].protection_cost + ' ' + newPlan[i].protection_cost_duration;
                                    }
                                }
                            }
                        }
                        this.pickedLeaseList = pickedLeaseList;
                        this.pickedLeaseIds = pickedLeaseIds;
                        this.serviceLease = newPlan;

                        if (this.serviceLease != '' && this.serviceLease != undefined) {
                            this.leaseLoading = false
                        }
                        else {
                            this.leaseLoading = false
                            this.serviceleaseavailable = false;
                        }


                        this.selectedLeaseItems = this.selectedLeaseItems.filter((item) =>
                            this.serviceLease.some((serviceItem: any) => serviceItem.id === item.id)
                        );

                        this.serviceLease.forEach((serviceItem: any) => {
                            // Find the index of the item in selectedLeaseItems that matches the serviceItem.id
                            const index = this.selectedLeaseItems.findIndex((item) => item.id === serviceItem.id);

                            if (index !== -1) {
                                // Update the item properties with the properties from serviceItem
                                this.selectedLeaseItems[index] = { ...this.selectedLeaseItems[index], ...serviceItem };
                            }
                        });

                        this.selectedLeaseItems.forEach((items: any) => {
                            selectedLeaseIds.push(items.protection_value);
                        })


                        DataHandler.servicetoggle = 'lease';
                        DataHandler.serviceleaseIds = selectedLeaseIds
                        DataHandler.servicelease = this.pickedLeaseList;

                        this.eventEmitterService.populateleaseprotection(this.selectedLeaseItems);

                       // if(DataHandler.leaseRefresh == false){
                        //call the lease api here 
                        //console.log("call lease refresh")
                        this.eventEmitterService.paymentleaserefresh([]);
                        //console.log("Call payment calculator3")
                     //   }

                        //DataHandler.leaseRefresh = false
                    }
                },
                error: (err) => {
                    this.leaseLoading = false
                    this.serviceleaseavailable = false;
                },
            });

    }

    getFinanceServicePlane() {
        let currentDate = new Date();
        let dt =
            this.restService.leftpad(currentDate.getMonth() + 1, 2) +
            '/' +
            this.restService.leftpad(currentDate.getDate(), 2) +
            '/' +
            currentDate.getFullYear();

        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = DataHandler.dealerzip;
        }

        let financeserviceContractpayload: serviceContract = {
            vin: this.vin,
            test_code: '',
            termsInMonths: DataHandler.financedafaultterm,
            currentOdometer: '0',
            milesperyear: '10000',
            customerAddressLine1: '',
            customerAddressLine2: '',
            customerCity: '',
            customerLastName: 'test',
            customerState: '',
            customerZipCode: zip,
            dealerCode: DataHandler.dealer,
            dealerState: DataHandler.dealerstate,
            deductible: '100',
            engineType: '',
            eppFlag: 'Y',
            isCommercial: 'N',
            isLease: 'N',
            leaseOrLoanTerm: DataHandler.financedafaultterm,
            make: this.make,
            model: DataHandler.model,
            modelYear: DataHandler.year,
            optionSaleDate: dt,
            paymentMode: 'FV',
            productLine: 'DLR',
            source: 'ESHOP',
            vehicleInServiceDate: dt,
        };

        this.store.dispatch(
            serviceContractFinanceAction({ payload: financeserviceContractpayload })
        );

        if(DataHandler.financeRefresh == false){
        this.eventEmitterService.paymentfinancerefresh([]);
        }

        DataHandler.financeRefresh = false
    }

    displayFinancePlanceFromFinanceContract() {

        this.store
            .pipe(
                select(getserviceContractFinanceDetailsState),
                takeUntil(this.unsubscribefinance$),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev.serviceContractFinanceDetails) === JSON.stringify(curr.serviceContractFinanceDetails))
            ).subscribe({
                next: (data) => {
                    let obj = JSON.parse(JSON.stringify(data?.serviceContractFinanceDetails));
                    if (obj != null) {
                        this.make = DataHandler.make?.toLowerCase();
                        this.servicepricefinance = obj.customize_serviceprice;
                        DataHandler.servicepricefinance = this.servicepricefinance;
                        this.financepercentage = obj.finance_percentage;
                        var pickedFinanceList = [];
                        var pickedFinanceIds = [];
                        var selectedFinanceIds: any[] = [];
                        this.serviceContractFinance = obj.service_protections;
                        var newPlan: any = [];
                        var displayFinance: Array<any> = [];

                        for (let i = 0; i < this.serviceContractFinance?.length; i++) {
                            newPlan[i] = {};
                            newPlan[i].finance_type = "finance";
                            newPlan[i].optioncode = this.serviceContractFinance[i].optionCode;
                            newPlan[i].protection_name = this.serviceContractFinance[i].categoryDescription.replace("[CNM]", "[NEW]").replace("[NEW]", "").toLowerCase();
                            this.serviceContractFinance[i].categoryDescriptionAPI = this.serviceContractFinance[i].categoryDescription.replace(" [CNM]", " [NEW]").replace(" [NEW]", "");
                            newPlan[i].protection_description = this.serviceContractFinance[i].plan_description;
                            //newPlan[i].protection_cost = this.serviceContractFinance[i].msrpTotal;
                            newPlan[i].protection_cost_duration = '';
                            newPlan[i].plan_image_url = this.serviceContractFinance[i].plan_image_url;
                            newPlan[i].mile = this.serviceContractFinance[i].miles;
                            newPlan[i].protection_cost = newPlan[i].msrpmonth = this.serviceContractFinance[i].msrpPerMonth;
                            newPlan[i].percentage = this.serviceContractFinance[i].msrpPerMonth * this.financepercentage / 100;
                            //newPlan[i].finance_percentageamount = newPlan[i].percentage + newPlan[i].msrpmonth;
                            newPlan[i].finance_percentageamount = this.serviceContractFinance[i].msrpTotal;
                            newPlan[i].msrbase = this.serviceContractFinance[i].msrpBase;
                            var mile_lenght = this.serviceContractFinance[i].miles.toString().split('');
                            if (newPlan[i].mile == 999999) {
                                newPlan[i].mile = 'unlimited';
                            }
                            newPlan[i].deductible = this.serviceContractFinance[i].deductible;
                            newPlan[i].term = this.serviceContractFinance[i].terms;
                            newPlan[i].id = i + 200;
                            newPlan[i].protection_value = this.serviceContractFinance[i].categoryCode + "|" + this.serviceContractFinance[i].reportingDescription + "|" + newPlan[i].finance_percentageamount + "|" + this.serviceContractFinance[i].terms;
                            newPlan[i].protection_description = this.getImageOrDescription(obj.discription, this.serviceContractFinance[i].categoryDescription);
                            newPlan[i].plan_image_url = this.getImageOrDescription(obj.images, this.serviceContractFinance[i].categoryDescription);
                            for (let j = 0; j < this.pickedFinanceList.length; j++) {
                                if (this.pickedFinanceList[j].package_name == newPlan[i].protection_name) {
                                    pickedFinanceList.push({ "package_name": newPlan[i].protection_name, "id": newPlan[i].id });
                                    pickedFinanceIds.push(newPlan[i].protection_value);
                                    newPlan[i].check = true;

                                    if (this.customplan == 1) {
                                        displayFinance.push({ "title": newPlan[i].protection_name, "desc": newPlan[i].protection_description, "cost": newPlan[i].finance_percentageamount, "duration": newPlan[i].protection_cost_duration, "term": newPlan[i].term, "customplan": this.customplan });
                                        if (newPlan[i].protection_cost != null)
                                            this.pickedFinanceList[i].package_cost = newPlan[i].protection_cost + ' ' + newPlan[i].protection_cost_duration;
                                    } else if (this.customplan == 0) {
                                        displayFinance.push({ "title": newPlan[i].protection_name, "desc": newPlan[i].protection_description, "cost": newPlan[i].finance_percentageamount, "duration": newPlan[i].protection_cost_duration, "term": newPlan[i].term, "pricedisplay": this.servicepricefinance, "customplan": this.customplan });
                                        if (newPlan[i].protection_cost != null)
                                            this.pickedFinanceList[i].package_cost = newPlan[i].protection_cost + ' ' + newPlan[i].protection_cost_duration;
                                    }
                                }
                            }
                        }

                        var addamount;
                        addamount = (this.finance_msrp_month * this.financepercentage / 100);
                        this.finance_percentageamount = this.finance_msrp_month + addamount;

                        this.pickedFinanceList = pickedFinanceList;
                        this.pickedFinanceIds = pickedFinanceIds;
                        this.serviceFinance = newPlan;


                        if (this.serviceFinance != '' && this.serviceFinance != undefined) {
                            this.financeLoading = false
                        }
                        else {
                            this.financeLoading = false
                            this.servicefinanceavailable = false;
                        }

                        this.selectedFinanceItems = this.selectedFinanceItems.filter((item) =>
                            this.serviceFinance.some((serviceItem: any) => serviceItem.id === item.id)
                        );

                        this.serviceFinance.forEach((serviceItem: any) => {
                            // Find the index of the item in selectedFinanceItems that matches the serviceItem.id
                            const index = this.selectedFinanceItems.findIndex((item) => item.id === serviceItem.id);

                            if (index !== -1) {
                                // Update the item properties with the properties from serviceItem
                                this.selectedFinanceItems[index] = { ...this.selectedFinanceItems[index], ...serviceItem };
                            }
                        });

                        this.selectedFinanceItems.forEach((items: any) => {
                            selectedFinanceIds.push(items.protection_value);
                        })

                        this.eventEmitterService.populatefinanceeprotection(this.selectedFinanceItems);

                        DataHandler.servicetoggle = 'finance';
                        DataHandler.servicefinanceIds = selectedFinanceIds;
                        DataHandler.servicefinance = this.pickedFinanceList;

                    }
                },
                error: (err) => {
                    this.financeLoading = false
                    this.servicefinanceavailable = false;
                },
            });

    }

    getCashServicePlane() {
        let currentDate = new Date();
        let dt =
            this.restService.leftpad(currentDate.getMonth() + 1, 2) +
            '/' +
            this.restService.leftpad(currentDate.getDate(), 2) +
            '/' +
            currentDate.getFullYear();

        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = DataHandler.dealerzip;
        }

        let cashServiceContractpayload: serviceContract = {
            vin: this.vin,
            test_code: '',
            termsInMonths: '84',
            currentOdometer: '0',
            milesperyear: '0',
            customerAddressLine1: '',
            customerAddressLine2: '',
            customerCity: '',
            customerLastName: 'test',
            customerState: '',
            customerZipCode: zip,
            dealerCode: DataHandler.dealer,
            dealerState: DataHandler.dealerstate,
            deductible: '100',
            engineType: '',
            eppFlag: 'Y',
            isCommercial: 'Y',
            isLease: 'N',
            leaseOrLoanTerm: '',
            make: this.make,
            model: DataHandler.model,
            modelYear: DataHandler.year,
            optionSaleDate: dt,
            paymentMode: 'CA',
            productLine: 'DLR',
            source: 'ESHOP',
            vehicleInServiceDate: '',
        };

        this.store.dispatch(
            serviceContractCashAction({ payload: cashServiceContractpayload })
        );

    }

    displayCashPlanceFromCashContract() {

        this.store.pipe(select(getserviceContractCashDetailsState),
            takeUntil(this.unsubscribecash$),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev.serviceContractCashDetails) === JSON.stringify(curr.serviceContractCashDetails))
            )
            .subscribe({
                next: (data) => {
                    let obj = JSON.parse(JSON.stringify(data?.serviceContractCashDetails));
                    if (obj != null) {
                        this.make = DataHandler.make?.toLowerCase();
                        this.servicepricecash = obj.customize_serviceprice;
                        DataHandler.servicepricecash = this.servicepricecash;
                        this.cashpercentage = obj.cash_percentage;
                        this.serviceContractCash = obj.service_protections;
                        var newPlan: any = [];
                        for (let i = 0; i < this.serviceContractCash.length; i++) {
                            newPlan[i] = {};
                            newPlan[i].finance_type = "cash";
                            newPlan[i].optioncode = this.serviceContractCash[i].optionCode;
                            newPlan[i].protection_name = this.serviceContractCash[i].categoryDescription.replace("[CNM]", "[NEW]").replace("[NEW]", "").toLowerCase();
                            this.serviceContractCash[i].categoryDescriptionAPI = this.serviceContractCash[i].categoryDescription.replace(" [CNM]", " [NEW]").replace(" [NEW]", "");
                            newPlan[i].protection_description = this.serviceContractCash[i].plan_description;
                            //newPlan[i].protection_cost = this.serviceContractCash[i].msrpTotal;
                            newPlan[i].protection_cost_duration = '';
                            newPlan[i].plan_image_url = this.serviceContractCash[i].plan_image_url;
                            newPlan[i].mile = this.serviceContractCash[i].miles;
                            newPlan[i].msrpTotal = this.serviceContractCash[i].msrpTotal;
                            newPlan[i].msrpmonth = this.serviceContractCash[i].msrpPerMonth;
                            // newPlan[i].percentage = parseFloat(this.serviceContractCash[i].msrpTotal) * parseFloat(this.cashpercentage) /100;
                            // newPlan[i].cash_percentageamount =  parseFloat(newPlan[i].percentage) +  parseFloat(newPlan[i].msrpTotal);

                            newPlan[i].percentage = this.serviceContractCash[i].msrpTotal * this.cashpercentage / 100;
                            newPlan[i].cash_percentageamount = newPlan[i].percentage + newPlan[i].msrpTotal;
                            this.cash_msrp_month = newPlan[i].protection_cost = newPlan[i].msrpBase = this.serviceContractCash[i].msrpBase;
                            var mile_lenght = this.serviceContractCash[i].miles.toString().split('');
                            if (newPlan[i].mile == 999999) {
                                newPlan[i].mile = 'unlimited';
                            }
                            newPlan[i].deductible = this.serviceContractCash[i].deductible;
                            newPlan[i].term = this.serviceContractCash[i].terms;
                            newPlan[i].id = i + 300;
                            newPlan[i].protection_value = this.serviceContractCash[i].categoryCode + "|" + this.serviceContractCash[i].reportingDescription + "|" + this.serviceContractCash[i].msrpTotal + "|" + this.serviceContractCash[i].terms;
                            newPlan[i].protection_description = this.getImageOrDescription(obj.discription, this.serviceContractCash[i].categoryDescription);
                            newPlan[i].plan_image_url = this.getImageOrDescription(obj.images, this.serviceContractCash[i].categoryDescription);
                            for (let j = 0; j < this.pickedCashList.length; j++) {
                                if (this.pickedCashList[j].package_name == newPlan[i].protection_name) {
                                    newPlan[i].check = true;
                                }
                            }
                        }

                        var addamount;
                        addamount = (this.cash_msrp_month * this.cashpercentage / 100);
                        this.cash_percentageamount = this.cash_msrp_month + addamount;
                        this.serviceCash = newPlan;

                        if (this.serviceCash != '' && this.serviceCash != undefined) {
                            this.cashLoading = false
                        }
                        else {
                            this.cashLoading = false
                            this.servicecashavailable = false;
                        }

                        // Filter out selectedCashItems that no longer exist in serviceCash
                        this.selectedCashItems = this.selectedCashItems.filter(itemId =>
                            this.serviceCash.some((item: { id: number; }) => item.id === itemId)
                        );
                    }
                },
                error: (err) => {
                    this.cashLoading = false
                    this.servicecashavailable = false;
                },
            });
    }


    getImageOrDescription(data: any, key: any) {
        var returnString = '';
        if (key == 'ADDED CARE PLUS' || key == "ADDED CARE PLUS LEASE" || key == "AUTO CARE PLUS [CNM]" || key == "ADDED CARE PLUS [NEW]") { //
            returnString = data['ADDED-CARE-PLUS'];
        } else if (key == 'AUTO APPEARANCE CARE' || key == 'AUTO APPEARANCE CARE [NEW]' || key == 'AUTO APPEARANCE CARE [CNM]') {
            returnString = data['AUTO-APPEARANCE-CARE'];
        } else if (key == 'ADDED CARE PLUS LEASE' || key == 'ADDED CARE PLUS LEASE [NEW]' || key == 'ADDED CARE PLUS LEASE [CNM]') {
            returnString = data['ADDED-CARE-PLUS-LEASE'];
        } else if (key == 'GUARANTEED AUTO PROTECTION' || key == 'GUARANTEED AUTO PROTECTION [CNM]' || key == 'GUARANTEED AUTO PROTECTION [NEW]') {
            returnString = data['GAP-(GUARANTEED-AUTOMOTIVE-PROTECTION)'];
        } else if (key == 'LEASE PROTECT' || key == 'LEASE PROTECT [CNM]' || key == 'LEASE PROTECT [NEW]') { //
            returnString = data['LEASE-PROTECT'];
        } else if (key == 'LEASE WEAR & TEAR' || key == 'LEASE WEAR & TEAR [CNM]' || key == 'LEASE WEAR & TEAR [NEW]') {
            returnString = data['LEASE-WEAR-AND-TEAR'];
        } else if (key == 'MAXIMUM CARE' || key == "MAXIMUM CARE [NEW]" || key == "MAXIMUM CARE [NEW]") { //
            returnString = data['MAXIMUM-CARE'];
        } else if (key == "MAXIMUM CARE LEASE" || key == "MAXIMUM CARE LEASE [NEW]" || key == "MAXIMUM CARE LEASE [CNM]") { //
            returnString = data['MAXIMUM-CARE-LEASE'];
        } else if (key == 'MULTICARE PLUS ULTIMATE' || key == 'MULTICARE PLUS ULTIMATE [CNM]' || key == 'MULTICARE PLUS ULTIMATE [NEW]') {
            returnString = data['MULTICARE-PLUS-ULTIMATE'];
        } else if (key == 'ROAD HAZARD TIRE & WHEEL PROTECTION' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION [CNM]' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION [NEW]') {
            returnString = data['ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION'];
        } else if (key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT [CNM]' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT [NEW]') { //
            returnString = data['ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION-Light'];
        } else if (key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT [CNM]' || key == 'ROAD HAZARD TIRE & WHEEL PROTECTION LIGHT [NEW]') { //
            returnString = data['ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION-Light'];
        } else if (key == 'ALFA ROMEO LEASE PROTECT ' || key == 'ALFA ROMEO LEASE PROTECT [CNM]' || key == 'ALFA ROMEO LEASE PROTECT [NEW]') { //
            returnString = data['ALFA-LEASE-PROTECT'];
        } 
        else if (key == 'WAGONEER PREMIER PROTECTION ' || key == 'WAGONEER PREMIER PROTECTION [NEW]' || key == 'WAGONEER PREMIER PROTECTION [CNM]') { //
            returnString = data['WAGONEER-PREMIER-PROTECTION'];
        }
        else {
            returnString = data[key];
          }
        return returnString;
    }

    toggleShowMore(item: any) {
        item.showMore = !item.showMore;
    }

    // Method to get the sliced text
    getSlicedText(description: string) {
        const words = description.split(' ');
        return words.length > this.wordLimit ? words.slice(0, this.wordLimit).join(' ') + '...' : description;
    }

    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '') {
       // console.log('ServiceProtectionComponent-', event_type);
        try {
            const interactionClick = { ...DataHandler.SDGEvents.interactionClick };

            interactionClick.site = "dealer";
            interactionClick.type = "tool";
            interactionClick.page = "build-your-deal:service-and-protection";

            if (event_type == 'term-switch') {
                interactionClick.location = "select-term";
                interactionClick.description = param + '-months';
            }

            if (event_type == 'option-switch') {
                interactionClick.location = "select-payment-option";
                interactionClick.description = this.activeTab;
            }

            if (event_type == 'select-service-protection') {
                interactionClick.location = "plan-selection";
                interactionClick.description = `${param}-${param1.replace(/\s+/g, '-').toLowerCase()}`.replace(/-$/, '');
            }

            if (event_type == 'view-disclaimer') {
                interactionClick.location = "view-disclaimer";
                interactionClick.description = param;
            }

            AdobeSDGHandler.eventLogger("interaction-click", interactionClick);
        } catch (e) {
            console.log('InitialDialog-adobe_sdg_event issue', e);
        }
    }

}



