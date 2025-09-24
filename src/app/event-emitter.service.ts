import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  accessoriestab: any;
  invokeFirstComponentFunction: any;
  invokeIframeComponentFunction: any;
  invoketradeinpopulateFunction: any;
  invokepopupFunction: any;
  invokedisableviewoffer: any;
  invokevalidationchecked: any;
  invokevehicledetails: any;
  invokevideoplayer: any;
  closeMainWidget: any;
  invokefinalsubmit: any;
  invokepopulateheader: any;
  invokeserviceleasepopulateFunction: any;
  invokeservicefinancepopulateFunction: any;
  invokeservicecashpopulateFunction: any;
  invokeaccessoriespopulateFunction: any;
  populatedealernameFunction: any;
  togglepaymenttab: any;
  toggleleasefinancetab1: any;
  toggleleasefinancetab2: any;
  tooglemover: any;
  leasepaymentrefresh: any;
  financepaymentrefresh: any;
  cashpaymentrefresh: any;
  openApplyForCredit: any;
  backToApplyForCredit:any;
  openCouponCodeMessage: any;
  invokeestimatepopup: any;
  resetpaymentcalculartor: any;
  applyCreditDisable: any;
  reserveNowDisable: any;
  checkBCIncentive: any;
  subsVar: any;
  photogallery: any;
  tradein: any;
  serviceandprotection: any;
  delivery: any;
  invokePaymentOption: any;
  invokeReserveNow: any;
  openPrivateOffer: any;
  secondPrivateOffer: any;
  refreshLeftPanel: any;
  callLender: any;
  updatemoparFlag: any;
  autofi: any;
  pageState: any;
  updateTerm: any;
  snpPageSelected: any;
  updatemaincalc: any;
  betterState: any;
  sessiontimeout: any;
  closeinitialform: any;
  loadtradin: any;
  hideheroimagge: any;
  showphotogallery: any;
  openeapthankyoudialog: any;
  zoomImage: any;
  invokeTabClick :any;
  checkSubmit :any;
  closeWidgetSDG :any;
  addPiInfo :any;
  loadTestDrivePIInfo:any;
  loadReserveNowPIInfo :any;
  loadSDGVehicleDetails :any;
  private activeTab: BehaviorSubject<string> = new BehaviorSubject<string>('lease');
  public dueAtSigning: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public dueAtSigningFinVal: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public autoFiFormSubmitSubject = new BehaviorSubject<boolean>(false);
  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable();
  private tabChange = new BehaviorSubject<number>(0);
  tabChange$ = this.tabChange.asObservable();
  private selectedLocationSubject = new BehaviorSubject<string | null>(null);
  selectedLocation$ = this.selectedLocationSubject.asObservable();

  private tabChangeSubject = new BehaviorSubject<string[] | null>(null);
  tabChangeAcc$ = this.tabChangeSubject.asObservable();
  displayMainContentView: any;

  changeTabAcc(tabName: string[]) {
    this.tabChangeSubject.next(tabName);
  }

  private closeMainDialogSubject = new Subject<void>();

  closeMainDialog$ = this.closeMainDialogSubject.asObservable();

  closeMainDialog() {
    this.closeMainDialogSubject.next();
  }
  private closeMainDialogSDGSubject = new Subject<void>();

  closeMainDialogSDG$ = this.closeMainDialogSDGSubject.asObservable();

  closeMainDialogSDG() {
    this.closeMainDialogSDGSubject.next();
  }
  updateData(data: any) {
    this.dataSource.next(data);
  }

  setSelectedLocation(location: string) {
    this.selectedLocationSubject.next(location);
  }

  changeTab(index: number) {
    this.tabChange.next(index);
  }

  reset() {
    this.accessoriestab = new EventEmitter();
    this.subsVar = null;
    this.invokeFirstComponentFunction = new EventEmitter();
    this.invokeIframeComponentFunction = new EventEmitter();
    this.invoketradeinpopulateFunction = new EventEmitter();
    this.invokepopupFunction = new EventEmitter();
    this.invokedisableviewoffer = new EventEmitter();
    this.invokevalidationchecked = new EventEmitter();
    this.invokevehicledetails = new EventEmitter();
    this.invokevideoplayer = new EventEmitter();
    this.closeMainWidget = new EventEmitter();
    this.invokefinalsubmit = new EventEmitter();
    this.invokepopulateheader = new EventEmitter();
    this.invokeserviceleasepopulateFunction = new EventEmitter();
    this.invokeservicecashpopulateFunction = new EventEmitter();
    this.invokeservicefinancepopulateFunction = new EventEmitter();
    this.invokeaccessoriespopulateFunction = new EventEmitter();
    this.populatedealernameFunction = new EventEmitter();
    this.togglepaymenttab = new EventEmitter();
    this.toggleleasefinancetab1 = new EventEmitter();
    this.toggleleasefinancetab2 = new EventEmitter();
    this.tooglemover = new EventEmitter();
    this.leasepaymentrefresh = new EventEmitter();
    this.financepaymentrefresh = new EventEmitter();
    this.cashpaymentrefresh = new EventEmitter();
    this.openApplyForCredit = new EventEmitter();
    this.backToApplyForCredit = new EventEmitter();
    this.openCouponCodeMessage = new EventEmitter();
    this.invokeestimatepopup = new EventEmitter();
    this.resetpaymentcalculartor = new EventEmitter();
    this.applyCreditDisable = new EventEmitter();
    this.displayMainContentView =new EventEmitter();
    this.reserveNowDisable = new EventEmitter();
    this.checkBCIncentive = new EventEmitter();
    this.photogallery = new EventEmitter();
    this.tradein = new EventEmitter();
    this.serviceandprotection = new EventEmitter();
    this.delivery = new EventEmitter();
    this.invokePaymentOption = new EventEmitter();
    this.invokeReserveNow = new EventEmitter();
    this.openPrivateOffer = new EventEmitter();
    this.secondPrivateOffer = new EventEmitter();
    this.refreshLeftPanel = new EventEmitter();
    this.callLender = new EventEmitter();
    this.updatemoparFlag = new EventEmitter();
    this.pageState = new EventEmitter();
    this.betterState = new EventEmitter();
    this.autofi = new EventEmitter();
    this.snpPageSelected = new EventEmitter();
    this.updateTerm = new EventEmitter();
    this.updatemaincalc = new EventEmitter();
    this.sessiontimeout = new EventEmitter();
    this.closeinitialform = new EventEmitter();
    this.loadtradin = new EventEmitter();
    this.hideheroimagge = new EventEmitter();
    this.showphotogallery = new EventEmitter();
    this.openeapthankyoudialog = new EventEmitter();
    this.zoomImage = new EventEmitter();
    this.checkSubmit = new EventEmitter();
    this.invokeTabClick = new EventEmitter();
    this.closeWidgetSDG = new EventEmitter();  
    this.addPiInfo = new EventEmitter(); 
    this.loadTestDrivePIInfo = new EventEmitter(); 
    this.loadReserveNowPIInfo  = new EventEmitter();
    this.loadSDGVehicleDetails = new EventEmitter();
  }

  constructor() { }


  onFirstComponentButtonClick(par: any) {
    this.invokeFirstComponentFunction.emit(par);
  }

  popupateheader(par: any) {
    this.invokepopulateheader.emit(par);
  }

  populateiframe(par1: any) {
    this.invokeIframeComponentFunction.emit(par1);
  }

  set autoFiFormSubmit(index: boolean) {
    this.autoFiFormSubmitSubject.next(index);
}

get autoFiFormSubmit(): boolean | false {
    return this.autoFiFormSubmitSubject.value;
}
  populatetradein(par1: any) {
    this.invoketradeinpopulateFunction.emit(par1);
  }

  populateleaseprotection(par: any) {
    this.invokeserviceleasepopulateFunction.emit(par);
  }

  populatecashprotection(par: any) {
    this.invokeservicecashpopulateFunction.emit(par);
  }

  populatefinanceeprotection(par: any) {
    this.invokeservicefinancepopulateFunction.emit(par)
  }

  populateaccessories(par: any) {
    this.invokeaccessoriespopulateFunction.emit(par);
  }

  opensubmitButton(par1: any) {
    this.invokepopupFunction.emit(par1);
  }

  disableviewoffer(par1: any) {
    this.invokedisableviewoffer.emit(par1);
  }

  checkdeliveryfields(par1: any) {
    this.invokevalidationchecked.emit(par1);
  }

  gotovehicledetails(par1: any) {
    this.invokevehicledetails.emit(par1);
  }
  openaccessoriestab() {
    this.accessoriestab.emit();
  }


  launchvideoplayer() {
    this.invokevideoplayer.emit();
  }

  closeWidget() {
    this.closeMainWidget.emit();
  }

  openfinalsubmit() {
    this.invokefinalsubmit.emit();
  }

  populatedealername(par1: any) {
    this.populatedealernameFunction.emit(par1);
  }

  toggelpaymenttab(par: any) {
    this.togglepaymenttab.emit(par);
  }

  toggleleasefinanceser() {
    this.toggleleasefinancetab1.emit();
  }

  toggleleasefinancedel() {
    this.toggleleasefinancetab2.emit();
  }

  togglefrompaymenttab(par: any) {
    this.tooglemover.emit(par);
  }

  paymentleaserefresh(data: any, isChecked: any = '', programId: any = '', type: any = '') {
    this.leasepaymentrefresh.emit(data, isChecked, programId, type);
  }

  paymentfinancerefresh(data: any, isChecked: any = '', programId: any = '', type: any = '') {
    this.financepaymentrefresh.emit(data, isChecked, programId, type);
  }
  paymentcashrefresh(data: any, isChecked: any = '', programId: any = '', type: any = '') {
    this.cashpaymentrefresh.emit(data, isChecked, programId, type);
  }

  openestimatepopup() {
    this.invokeestimatepopup.emit();
  }

  fnOpenApplyForCredit() {
    this.openApplyForCredit.emit();
  }

  fnBackToApplyForCredit(){
    this.backToApplyForCredit.emit();
  }

  fnOpencouponCodeMessageDialog() {
    this.openCouponCodeMessage.emit();
  }

  fnApplyCreditDisable() {
    this.applyCreditDisable.emit();
  }

  displayMainContent(){
     this.displayMainContentView.emit();
  }
  fnReserveNowDisable(status: string, text: string) {
    this.reserveNowDisable.emit(status, text);
  }

  fnCheckBCIncentive() {
    this.checkBCIncentive.emit();
  }

  // resetpayment(){ 
  //   console.log("Event emitterr instance")
  //   this.resetpaymentcalculartor.emit('');
  // }

  resetpayment(par1: any, par2: any, par3: any, par4: any, par5: any) {
    this.resetpaymentcalculartor.emit({ par1, par2, par3, par4, par5 });
  }

  getActiveTab(): Observable<string> {
    return this.activeTab.asObservable();
  }

  openphotogallery() {
    this.photogallery.emit();
  }

  opentradein() {
    this.tradein.emit();
  }

  openserviceandprotection() {
    this.serviceandprotection.emit();
  }

  opendelivery() {
    this.delivery.emit();
  }

  gotoPaymentOption(par1: any) {
    this.invokePaymentOption.emit(par1);
  }

  gotoReserveNowDialog() {
    this.invokeReserveNow.emit();
  }

  fnOpenPrivateOffer() {
    this.openPrivateOffer.emit();
  }

  fnSecondPrivateOffer() {
    this.secondPrivateOffer.emit();
  }

  fnRefreshLeftPanel(prData: any) {
    this.refreshLeftPanel.emit(prData);
  }

  fnUpdatemoparFlag() {
    this.updatemoparFlag.emit();
  }

  fnCallLender(prData: any) {
    this.callLender.emit(prData);
  }

  fnOpenAutofi() {
    this.autofi.emit();
  }

  fnPageState(popupName: string, prType: string) {
    var arData = { 'popupName': popupName, 'type': prType };
    this.pageState.emit(arData);
  }

  fnPageStatebetter(popupName: string, type: string) {
    this.betterState.emit(popupName, type);
  }

  fnUpdateTerm() {
    this.updateTerm.emit();
  }

  fnSnpPageSelected() {
    this.snpPageSelected.emit();
  }

  fnupdatemaincalc(par: any) {
    this.updatemaincalc.emit(par);
  }

  fnsessiontimeout() {
    this.sessiontimeout.emit();
  }

  fnCloseInitialForm(par: any) {
    this.closeinitialform.emit();
  }

  fnloadtradin() {
    this.loadtradin.emit();
  }

  fnhideheroimage(par: any) {
    this.hideheroimagge.emit(par);
  }

  fnshowphotogallry(par: any) {
    this.showphotogallery.emit(par);
  }

  fnopeneapthankyou(par: any){
    this.openeapthankyoudialog.emit(par);
  }

  fnopenZoomImage(popupName: string, imgURL: string) {
    var zoomData = { 'popupName': popupName, 'imgURL': imgURL };
    this.zoomImage.emit(zoomData);
  }
  validateSubmitForm(){
    this.checkSubmit.emit();
  }

  clickTabEvent(tabIndex :any){
    this.invokeTabClick.emit(tabIndex);
  }

  closeWidgetSDGEvent(){
  this.closeWidgetSDG.emit();
  }
  loadPIInfoEvent(){
    this.addPiInfo.emit();
  }
  loadTestDrivePIInfoEvent(){
    this.loadTestDrivePIInfo.emit();
  }
   loadReserveNowPIInfoEvent(){
    this.loadReserveNowPIInfo.emit();
  }
   loadSDGVehicleDetailsEvent(){
        this.loadSDGVehicleDetails.emit();
    }
}  