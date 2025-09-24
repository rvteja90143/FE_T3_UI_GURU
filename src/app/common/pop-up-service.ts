import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private openInitialPopUpSubject = new BehaviorSubject<boolean>(false);
  openInitialPopUp$ = this.openInitialPopUpSubject.asObservable();
 
  private formValidSubject = new BehaviorSubject<boolean>(true);
  formValid$ = this.formValidSubject.asObservable();
 
  private showCreditEstimatorSubject = new BehaviorSubject<boolean>(false);
  showCreditEstimator$ = this.showCreditEstimatorSubject.asObservable();
 
  setFormValidity(valid: boolean) {
    this.formValidSubject.next(valid);
  }
 
  setCreditEstimator(value: boolean){
    this.showCreditEstimatorSubject.next(value);
  }
 
  constructor() { }
 
  setOpenInitialPopUp(value: boolean) {
    this.openInitialPopUpSubject.next(value);
  }
}