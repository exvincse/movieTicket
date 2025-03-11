import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPalCheckComponent } from './pay-pal-check.component';

describe('PayPalCheckComponent', () => {
  let component: PayPalCheckComponent;
  let fixture: ComponentFixture<PayPalCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPalCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPalCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
