import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProtectionComponent } from './service-protection.component';

describe('ServiceProtectionComponent', () => {
  let component: ServiceProtectionComponent;
  let fixture: ComponentFixture<ServiceProtectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceProtectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
