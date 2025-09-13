import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsndconditionsComponent } from './termsndconditions.component';

describe('TermsndconditionsComponent', () => {
  let component: TermsndconditionsComponent;
  let fixture: ComponentFixture<TermsndconditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsndconditionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsndconditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
