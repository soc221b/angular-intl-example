import { TestBed } from '@angular/core/testing';

import { NgxAutofocusService } from './ngx-autofocus.service';

describe('NgxAutofocusService', () => {
  let service: NgxAutofocusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAutofocusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
