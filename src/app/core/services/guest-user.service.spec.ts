import { TestBed } from '@angular/core/testing';

import { GuestUserService } from './guest-user.service';

describe('GuestUserService', () => {
  let service: GuestUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
