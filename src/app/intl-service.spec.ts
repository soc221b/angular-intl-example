import { TestBed } from '@angular/core/testing';
import { IntlService } from './intl-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('IntlService', () => {
  let service: IntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(IntlService);
  });

  it('#currency should return default value', () => {
    expect(service.currency()).toBe('USD');
  });

  it('#setCurrency should update currency', () => {
    service.setCurrency('TWD');

    expect(service.currency()).toBe('TWD');
  });

  it('#locale should return default value', () => {
    expect(service.locale()).toBe('en-US');
  });

  it('#setLocale should update locale', () => {
    service.setLocale('zh-TW');

    expect(service.locale()).toBe('zh-TW');
  });
});
