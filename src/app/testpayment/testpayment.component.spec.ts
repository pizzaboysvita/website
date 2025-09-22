import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpaymentComponent } from './testpayment.component';

describe('TestpaymentComponent', () => {
  let component: TestpaymentComponent;
  let fixture: ComponentFixture<TestpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestpaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
