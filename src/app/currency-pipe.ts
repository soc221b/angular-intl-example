import { inject, Pipe, PipeTransform } from '@angular/core';
import { IntlService } from './intl-service';
import { formatCurrency } from './format-currency';

@Pipe({
  name: 'currency',
  pure: false,
})
export class CurrencyPipe implements PipeTransform {
  private intlService = inject(IntlService);
  private params: readonly [number, string, string] = [NaN, '', ''];
  private cache: string = '';

  transform(value: number): string {
    const params = [value, this.intlService.locale(), this.intlService.currency()] as const;
    const missing = JSON.stringify(params) !== JSON.stringify(this.params);
    if (missing) {
      this.params = params;
      this.cache = formatCurrency(...this.params)
        .map(({ value }) => value)
        .join('');
    }

    return this.cache;
  }
}
