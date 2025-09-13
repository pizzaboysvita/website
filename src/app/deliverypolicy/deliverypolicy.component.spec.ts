import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverypolicyComponent } from './deliverypolicy.component';

describe('DeliverypolicyComponent', () => {
  let component: DeliverypolicyComponent;
  let fixture: ComponentFixture<DeliverypolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliverypolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliverypolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
