import { Injectable } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { EventEmitterService } from "./event-emitter.service";

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  public idle$: Subject<boolean> = new Subject();
  public wake$: Subject<boolean> = new Subject();

  isIdle = false;
  isClosed = false;

  private idleAfterSeconds = 420; 
  private countDown: any;

  constructor(private eventEmitterService:EventEmitterService) {
    // Setup events    
    fromEvent(document, 'mousemove').subscribe(() => this.onInteraction());
    fromEvent(document, 'touchstart').subscribe(() => this.onInteraction());
    fromEvent(document, 'keydown').subscribe(() => this.onInteraction());
  }

  initialize() {
    this.isClosed = false;
    //this.startIdleTimer();
  }

  onInteraction() {
    if (!this.isClosed) {
      // Is idle and interacting, emit Wake
      if (this.isIdle) {
        this.isIdle = false;
        this.wake$.next(true);
      }

      // User interaction, reset start-idle-timer
      clearTimeout(this.countDown);
      this.startIdleTimer();
    }
  }

  private startIdleTimer() {
    clearTimeout(this.countDown);
    this.countDown = setTimeout(() => {

      // Countdown done without interaction - emit Idle
      this.isIdle = true;
      this.idle$.next(true);

      // Trigger session timeout popup
      this.eventEmitterService.fnsessiontimeout();

    }, this.idleAfterSeconds * 1000);
  }

  onClose() {
    clearTimeout(this.countDown);
    this.isClosed = true;
  }
}