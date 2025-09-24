import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-loader-dialog',
    template: `
    <div class="loader-container">
      <div class="loader"></div>
      <p>We are reviewing your application,<br/>Kindly stay with us.<br /> Your application
      will be processed within {{ countdown }} seconds.</p>
    </div>
  `,
    styles: [`
    .loader-container { text-align: center; }
  `]
})

export class LoaderDialogComponent implements OnInit, OnDestroy {
    countdown: number = 60;
    intervalId: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LoaderDialogComponent>) { }

    ngOnInit() {
        this.startCountdown();
    }

    startCountdown() {
        this.intervalId = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(this.intervalId);
                this.dialogRef.close();
              }
            }, 1000);
    }

    ngOnDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
