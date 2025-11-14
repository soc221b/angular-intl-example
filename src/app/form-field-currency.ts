import { AfterContentInit, Directive, effect, inject } from '@angular/core';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/input';
import { IntlService } from './intl-service';
import { formatCurrency } from './format-currency';

// WARNING: this directive does monkey patching on MatFormField
// which means:
// 1. this may not work after upgrading @angular/material
// 2. this may not work properly with other features such as icon prefix
@Directive({
  selector: 'mat-form-field[currency]',
})
export class FormFieldCurrency implements AfterContentInit {
  private intlService = inject(IntlService);
  private matFormField = inject(MatFormField);

  constructor() {
    effect(() => {
      this.updatePrefix();
      this.updateSuffix();
    });
  }

  ngAfterContentInit(): void {
    const prefix = new MatPrefix();
    prefix._isText = true;
    this.matFormField._prefixChildren.reset([prefix]);

    const suffix = new MatSuffix();
    suffix._isText = true;
    this.matFormField._suffixChildren.reset([suffix]);

    this.matFormField['_initializePrefixAndSuffix']();

    Promise.resolve().then(() => {
      this.updatePrefix();
      this.updateSuffix();
    });
  }

  private updatePrefix() {
    const { currencyIndex, integerIndex, parts } = this.getParts();

    if (this.matFormField._textPrefixContainer === undefined) return;
    this.matFormField._textPrefixContainer.nativeElement.innerText =
      0 <= currencyIndex && currencyIndex < integerIndex ? parts[currencyIndex].value : '';
  }

  private updateSuffix() {
    const { currencyIndex, integerIndex, parts } = this.getParts();

    if (this.matFormField._textSuffixContainer === undefined) return;
    this.matFormField._textSuffixContainer.nativeElement.innerText =
      0 <= integerIndex && integerIndex < currencyIndex ? parts[currencyIndex].value : '';
  }

  private getParts() {
    const parts = formatCurrency(0, this.intlService.locale(), this.intlService.currency());
    const currencyIndex = parts.findIndex((part) => part.type === 'currency');
    const integerIndex = parts.findIndex((part) => part.type === 'integer');
    return { currencyIndex, integerIndex, parts };
  }
}
