import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpValidComponent } from './otp-valid.component';

describe('OtpValidComponent', () => {
  let component: OtpValidComponent;
  let fixture: ComponentFixture<OtpValidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpValidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
