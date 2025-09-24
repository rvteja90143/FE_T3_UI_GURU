import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrequalifyComponent } from './prequalify.component';

describe('PrequalifyComponent', () => {
  let component: PrequalifyComponent;
  let fixture: ComponentFixture<PrequalifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrequalifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrequalifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
