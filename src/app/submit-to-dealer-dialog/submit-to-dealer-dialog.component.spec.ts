import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitToDealerDialogComponent } from './submit-to-dealer-dialog.component';

describe('SubmitToDealerDialogComponent', () => {
  let component: SubmitToDealerDialogComponent;
  let fixture: ComponentFixture<SubmitToDealerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitToDealerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitToDealerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
