import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from './currency-pipe';
import { IntlService } from './intl-service';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CurrencyPipe', () => {
  let intlService: IntlService;
  let pipe: CurrencyPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), IntlService],
    });

    intlService = TestBed.inject(IntlService);
    TestBed.runInInjectionContext(() => {
      pipe = new CurrencyPipe();
    });
  });

  it('should transform', () => {
    const value = 1234;
    const localeSpy = spyOn(intlService, 'locale');
    const currencySpy = spyOn(intlService, 'currency');
    localeSpy.and.returnValue('en-US');
    currencySpy.and.returnValue('USD');

    expect(pipe.transform(value)).toEqual('$1,234.00');
  });

  it('should update after changing locale', () => {
    const value = 1234;
    const localeSpy = spyOn(intlService, 'locale');
    const currencySpy = spyOn(intlService, 'currency');
    localeSpy.and.returnValue('en-US');
    currencySpy.and.returnValue('USD');
    expect(pipe.transform(value)).toEqual('$1,234.00');

    localeSpy.and.returnValue('fi-FI');

    expect(pipe.transform(value)).toEqual('1 234,00 $');
  });

  it('should update after changing currency', () => {
    const value = 1234;
    const localeSpy = spyOn(intlService, 'locale');
    const currencySpy = spyOn(intlService, 'currency');
    localeSpy.and.returnValue('en-US');
    currencySpy.and.returnValue('USD');
    expect(pipe.transform(value)).toEqual('$1,234.00');

    currencySpy.and.returnValue('EUR');

    expect(pipe.transform(value)).toEqual('€1,234.00');
  });

  it('should update after changing value', () => {
    let value = 1234;
    const localeSpy = spyOn(intlService, 'locale');
    const currencySpy = spyOn(intlService, 'currency');
    localeSpy.and.returnValue('en-US');
    currencySpy.and.returnValue('USD');
    expect(pipe.transform(value)).toEqual('$1,234.00');

    value = 5678;

    expect(pipe.transform(value)).toEqual('$5,678.00');
  });
});
