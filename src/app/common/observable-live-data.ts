import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { DataHandler } from "./data-handler";



 
@Injectable({
    providedIn: 'root'
})
export class ObservableLiveData {

    private selectedPaymentTypeSubject = new BehaviorSubject<string>('');
    selectedPaymentType$ = this.selectedPaymentTypeSubject.asObservable();

    private selectedleaseTermSubject = new BehaviorSubject<string>('');
    selectedleaseterm$ = this.selectedleaseTermSubject.asObservable();

    private leaseTermListSubject = new BehaviorSubject<string>('');
    leaseTermList$ = this.leaseTermListSubject.asObservable();

    private selectedFinanceTermSubject = new BehaviorSubject<string>('');
    selectedFinanceterm$ = this.selectedFinanceTermSubject.asObservable();

    private financeTermListSubject = new BehaviorSubject<string>('');
    financeTermList$ = this.financeTermListSubject.asObservable();

    private getLeasePlaneSubject = new Subject<void>();
    getLeasePlane$ = this.getLeasePlaneSubject.asObservable();

    private getFinancePlaneSubject = new Subject<void>();
    getFinancePlane$ = this.getFinancePlaneSubject.asObservable();

    private getCashPlaneSubject = new Subject<void>();
    getCashPlane$ = this.getCashPlaneSubject.asObservable();

    private getShowTestDriveSubject = new Subject<void>();
    getShowTestDrive$ = this.getShowTestDriveSubject.asObservable();

    private getReserveNowSubject = new Subject<void>();
    getReserveNow$ = this.getReserveNowSubject.asObservable();

    private getLeaseDetailsSubject = new Subject<void>();
    getLeaseDetails$ = this.getLeaseDetailsSubject.asObservable();

    private showleaseMonthlyPayment = new BehaviorSubject<string>('');
    showleaseMonthlyPayment$ = this.showleaseMonthlyPayment.asObservable();

    private leaseFirstMonthPayment = new BehaviorSubject<string>('');
    leaseFirstMonthPayment$ = this.leaseFirstMonthPayment.asObservable();

    private showleasedueatsigning = new BehaviorSubject<string>('');
    leasedueatsigning$ = this.showleasedueatsigning.asObservable();

    private showfinanceMonthlyPayment = new BehaviorSubject<string>('');
    showfinanceMonthlyPayment$ = this.showfinanceMonthlyPayment.asObservable();

    private showfinancedueatsigning = new BehaviorSubject<string>('');
    financedueatsigning$ = this.showfinancedueatsigning.asObservable();

    private showcashPayment = new BehaviorSubject<string>('');
    showcashPayment$ = this.showcashPayment.asObservable();

    private showleasetaxandfees = new BehaviorSubject<string>('');
    showleasetaxandfees$ = this.showleasetaxandfees.asObservable();

    private showleasefirstmonth = new BehaviorSubject<string>('');
    leasefirstmonth$ = this.showleasefirstmonth.asObservable();

    private showfinancetaxandfees = new BehaviorSubject<string>('');
    showfinancetaxandfees$ = this.showfinancetaxandfees.asObservable();


    private setShowPrequalSubject = new BehaviorSubject<boolean>(false);
    setShowPrequal$ = this.setShowPrequalSubject.asObservable();

    private setShowApplyCreditSubject = new BehaviorSubject<boolean>(false);
    setShowApplyCredit$ = this.setShowApplyCreditSubject.asObservable();

    private leaseResponseAvailableSubject = new BehaviorSubject<boolean>(false);
    leaseResponseAvailable$ = this.leaseResponseAvailableSubject.asObservable();

    private financeResponseAvailableSubject = new BehaviorSubject<boolean>(false);
    financeResponseAvailable$ = this.financeResponseAvailableSubject.asObservable();

    private cashResponseAvailableSubject = new BehaviorSubject<boolean>(false);
    cashResponseAvailable$ = this.cashResponseAvailableSubject.asObservable();

    // private lockDetailsSpecsSubject = new BehaviorSubject<boolean>(true);
    // lockDetailsSpecs$ = this.lockDetailsSpecsSubject.asObservable();

    private closeWidgetSybject = new Subject<void>();
    closeWidget$ = this.closeWidgetSybject.asObservable();

    private PaymentCalculatorSybject = new Subject<void>();
    openPaymentCalculator$ = this.PaymentCalculatorSybject.asObservable();

    private closePaymentCalculatorSubject = new Subject<void>();
    closePaymentCalculator$ = this.closePaymentCalculatorSubject.asObservable();

    private backbuttonSubject = new Subject<void>();
    backbutton$ = this.backbuttonSubject.asObservable();

    private setFormSubmittedSubject =new BehaviorSubject<boolean>(false);
    setFormSubmitted$ = this.setFormSubmittedSubject.asObservable();

    private showTestDriveSubject = new BehaviorSubject<boolean>(true);
    showTestDriveSubject$ = this.showTestDriveSubject.asObservable()

    private hideBackButtonSubject = new BehaviorSubject<boolean>(false);
    hideBackButton$ = this.hideBackButtonSubject.asObservable();

      private setWidgetCloseBtnSubject =new BehaviorSubject<boolean>(false);
    setWidgetCloseBtn$ = this.setWidgetCloseBtnSubject.asObservable();


    private formSubmittedSource = new BehaviorSubject<number>(DataHandler.form_submitted);

    formSubmitted$ = this.formSubmittedSource.asObservable();

    private hideCalcSubject = new BehaviorSubject<boolean | null>(null);
    hideCalcSubject$ = this.hideCalcSubject.asObservable();

    private openPrequalDialogSubject = new Subject<string>(); //Subject<void>
    openPrequalDialog$ = this.openPrequalDialogSubject.asObservable();

    private leaseListPrice = new BehaviorSubject<string>('');
    leaseListPrice$ = this.leaseListPrice.asObservable();

    private financeListPrice = new BehaviorSubject<string>('');
    financeListPrice$ = this.financeListPrice.asObservable();

    private cashListPrice = new BehaviorSubject<string>('');
    cashListPrice$ = this.cashListPrice.asObservable();


    setLeaseListPrice(value:any){
        this.leaseListPrice.next(value);
    }

    setFinanceListPrice(value:any){
        this.financeListPrice.next(value);
    }

    setCashListPrice(value:any){
        this.cashListPrice.next(value);
    }

    openPrequalDialog(eventType: any){
         this.openPrequalDialogSubject.next(eventType)
    }

    private formStatusSubject = new BehaviorSubject<{ 
        date: any; 
        time: any;
        pristine: boolean;
        location: any;
        homeFieldsValid: boolean;
        otherFieldsValid: boolean;
    }>({ 
        date: null,
        time: null,
        location: null, 
        homeFieldsValid: true,
        otherFieldsValid: true,
        pristine: true 
    });

    formStatus$ = this.formStatusSubject.asObservable();

    private tabChangeSubject = new Subject<string>();
    tabChange$ = this.tabChangeSubject.asObservable();

    private formFilledSubject = new BehaviorSubject<boolean>(false);
    formFilled$ = this.formFilledSubject.asObservable();

    updateFormFilledStatus(isFilled: boolean) {
        this.formFilledSubject.next(isFilled);
    }

    notifyTabChange(tabName: string) {
        this.tabChangeSubject.next(tabName);
    }

    updateFormStatus(status: { 
        date: any; 
        time: any;
        location: any;
        homeFieldsValid: boolean;
        otherFieldsValid: boolean;
        pristine: boolean }) {
        this.formStatusSubject.next(status);
    }
    

    updateCalc(value: boolean) {
    this.hideCalcSubject.next(value);
    }

    updateFormSubmitted(status: number): void {
        this.formSubmittedSource.next(status);
    }

    // setlockDetailsSpecs(value:boolean){
    //     this.lockDetailsSpecsSubject.next(value)
    // }


    hidebackbutton(value:boolean){
        this.hideBackButtonSubject.next(value);
    }


    setTestDrive(value:boolean){
        this.showTestDriveSubject.next(value)
    }
    
    setLeaseResponseStatus(value:boolean){
        this.leaseResponseAvailableSubject.next(value)
    }

    setfinanceResponseStatus(value:boolean){
        this.financeResponseAvailableSubject.next(value)
    }

    setCashResponseStatus(value:boolean){
        this.cashResponseAvailableSubject.next(value)
    }

    setleaseFirstMonthPayment(value:any){
        this.leaseFirstMonthPayment.next(value);
    }

    backButton(){
        this.backbuttonSubject.next();
    }
    private displayTestDriveSubject = new Subject<boolean>();
    displayTestDrive$ = this.displayTestDriveSubject.asObservable();

    setDisplayTestDrive(display:boolean){
        this.displayTestDriveSubject.next(display);
    }
    closeWidget(){
        this.closeWidgetSybject.next();
    }

    closePaymentCalculator(){
     this.closePaymentCalculatorSubject.next();
    }

    openPaymentCalculator(){
        this.PaymentCalculatorSybject.next()
    }
	
	setShowApplyCredit(show :boolean){
        this.setShowApplyCreditSubject.next(show)
    }


    setSelectedPaymentType(type:string){ 
        if(type !='' && type != null)
       this.selectedPaymentTypeSubject.next(type); 
    }
    setShowPrequal(show :boolean){
        this.setShowPrequalSubject.next(show)
    }

    getLeasePlane(){
        this.getLeasePlaneSubject.next();
    }

    getFinancePlane(){
        this.getFinancePlaneSubject.next();
    }

    getCashPlane(){
        this.getCashPlaneSubject.next();
    }

    getLeaseDetails(){
        this.getLeaseDetailsSubject.next();
    }

    setSelectedLeaseTerm(term:any){
        this.selectedleaseTermSubject.next(term);
    }

    setLeaseTermList(term:any){
        this.leaseTermListSubject.next(term)
    }

    setSelectedFinanceTerm(term:any){
        this.selectedFinanceTermSubject.next(term);
    }

    setFinanceTermList(term:any){
        this.financeTermListSubject.next(term);
    }

    setShowTestDriveSubject(showTestDrive : any){
        this.getShowTestDriveSubject.next(showTestDrive)
    }

    setReserveNowSubject(showReserveNow : any){
        this.getReserveNowSubject.next(showReserveNow)
    }

    setleaseMonthlyPayment(value:any){
      this.showleaseMonthlyPayment.next(value)
    }

    setleasedueatsigning(value:any){
        this.showleasedueatsigning.next(value)
    }

    setfinanceMonthlyPayment(value:any){
    this.showfinanceMonthlyPayment.next(value)
    }

    setfinancedueatsigning(value:any){
        this.showfinancedueatsigning.next(value)
    }

    setcashPayment(value:any){
        this.showcashPayment.next(value)
    }

    setleasetaxandfees(value:any){
        this.showleasetaxandfees.next(value)
    }

    setleasefirstmonth(value:any){
        this.showleasefirstmonth.next(value)
    }

    setfinancetaxandfees(value:any){
        this.showfinancetaxandfees.next(value)
    }

    setFormSubmitted(value:any){
        this.setFormSubmittedSubject.next(value)
    }
    setWidgetCloseBtn(value:any){
        this.setWidgetCloseBtnSubject.next(value);
    }

    reset(){
        this.setSelectedPaymentType('');
        this.setSelectedLeaseTerm('');
        this.setLeaseTermList('');
        this.setSelectedFinanceTerm('');
        this.setFinanceTermList('');
        this.setleaseMonthlyPayment('');
        this.setleaseFirstMonthPayment('');
        this.setleasedueatsigning('');
        this.setfinanceMonthlyPayment('');
        this.setfinancedueatsigning('');
        this.setcashPayment('');
        this.setleasetaxandfees('');
        this.setleasefirstmonth('');
        this.setfinancetaxandfees('');
        this.setShowPrequal(false);
        this.setShowApplyCredit(false);
        this.setLeaseResponseStatus(false);
        this.setfinanceResponseStatus(false);
        this.setCashResponseStatus(false);
        //this.setlockDetailsSpecs(true);
        this.setFormSubmitted(false);
        this.setTestDrive(true);
        this.hidebackbutton(false);
        this.setWidgetCloseBtn(true)
        this.setLeaseListPrice('');
        this.setFinanceListPrice('');
        this.setCashListPrice('');
        // this.closeWidgetSybject.complete();
        // this.PaymentCalculatorSybject.complete();
        // this.closePaymentCalculatorSubject.complete();
        // this.backbuttonSubject.complete();
        // this.openPrequalDialogSubject.complete();
        // this.displayTestDriveSubject.complete();
        // this.getLeasePlaneSubject.complete();
        // this.getFinancePlaneSubject.complete();
        // this.getCashPlaneSubject.complete();
        // this.getShowTestDriveSubject.complete();
        // this.getReserveNowSubject.complete();
        // this.getLeaseDetailsSubject.complete();
        //console.log("observable reset complete")

    }
}