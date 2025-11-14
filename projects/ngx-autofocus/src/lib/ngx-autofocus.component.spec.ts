import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAutofocusComponent } from './ngx-autofocus.component';

describe('NgxAutofocusComponent', () => {
  let component: NgxAutofocusComponent;
  let fixture: ComponentFixture<NgxAutofocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxAutofocusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxAutofocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
