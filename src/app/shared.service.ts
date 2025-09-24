import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class SharedService {

  private isReserveDialogOpenSubject = new BehaviorSubject<boolean>(false);

  isReserveDialogOpen$ = this.isReserveDialogOpenSubject.asObservable();

  private paymentCalculatorStateSubject = new BehaviorSubject<boolean>(false);
  paymentCalculatorState$ = this.paymentCalculatorStateSubject.asObservable();

  setReserveDialogState(isOpen: boolean): void {
    this.isReserveDialogOpenSubject.next(isOpen);
  }

  setPaymentCalculatorState(isCalled: boolean): void {
    this.paymentCalculatorStateSubject.next(isCalled);
  }
}
