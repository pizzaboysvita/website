import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginGuestModalComponent } from './login-guest-modal.component';

describe('LoginGuestModalComponent', () => {
  let component: LoginGuestModalComponent;
  let fixture: ComponentFixture<LoginGuestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginGuestModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginGuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
