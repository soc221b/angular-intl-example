import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntlService {
  private readonly _locale = signal('en-US');
  readonly locale = this._locale.asReadonly();
  readonly setLocale = this._locale.set.bind(this._locale);

  private readonly _currency = signal('USD');
  readonly currency = this._currency.asReadonly();
  readonly setCurrency = this._currency.set.bind(this._currency);
}
