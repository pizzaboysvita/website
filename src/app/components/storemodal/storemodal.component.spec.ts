import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoremodalComponent } from './storemodal.component';

describe('StoremodalComponent', () => {
  let component: StoremodalComponent;
  let fixture: ComponentFixture<StoremodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoremodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoremodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
