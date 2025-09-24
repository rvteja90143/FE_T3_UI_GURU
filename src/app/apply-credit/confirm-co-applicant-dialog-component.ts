import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'confirm-co-applicant-dialog-component',
    templateUrl: './confirm-co-applicant-dialog-component.html',
})
export class ConfirmCoApplicantDialogComponent {
    showform: any = 1;
    constructor(
        public dialogRef: MatDialogRef<ConfirmCoApplicantDialogComponent>
    ) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}