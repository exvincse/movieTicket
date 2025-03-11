import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayPalErrorComponent } from './pay-pal-error.component';

describe('PayPalErrorComponent', () => {
  let component: PayPalErrorComponent;
  let fixture: ComponentFixture<PayPalErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayPalErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayPalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
