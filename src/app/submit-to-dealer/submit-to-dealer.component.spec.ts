import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitToDealerComponent } from './submit-to-dealer.component';

describe('SubmitToDealerComponent', () => {
  let component: SubmitToDealerComponent;
  let fixture: ComponentFixture<SubmitToDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitToDealerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitToDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
