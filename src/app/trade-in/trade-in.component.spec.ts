import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeInComponent } from './trade-in.component';

describe('TradeInComponent', () => {
  let component: TradeInComponent;
  let fixture: ComponentFixture<TradeInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
