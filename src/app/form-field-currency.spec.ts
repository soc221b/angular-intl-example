import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormFieldCurrency } from './form-field-currency';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IntlService } from './intl-service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

@Component({
  template: `
    <mat-form-field currency floatLabel="always">
      <mat-label></mat-label>
      <input matInput />
    </mat-form-field>
  `,
  imports: [MatFormFieldModule, MatInputModule, FormFieldCurrency],
})
class FormFieldHarnessTest {}

describe('FormFieldCurrency', () => {
  let intlService: IntlService;
  let fixture: ComponentFixture<FormFieldHarnessTest>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormFieldHarnessTest, MatDatepickerModule],
      providers: [provideZonelessChangeDetection(), IntlService],
    });

    intlService = TestBed.inject(IntlService);
    fixture = TestBed.createComponent(FormFieldHarnessTest);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should add prefix', async () => {
    spyOn(intlService, 'locale').and.returnValue('en-US');
    spyOn(intlService, 'currency').and.returnValue('USD');
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    const prefixTexts = await parallel(() => formFields.map((f) => f.getPrefixText()));
    const suffixTexts = await parallel(() => formFields.map((f) => f.getSuffixText()));

    expect(prefixTexts).toEqual(['$']);
    expect(suffixTexts).toEqual(['']);
  });

  it('should add suffix', async () => {
    spyOn(intlService, 'locale').and.returnValue('fi-FI');
    spyOn(intlService, 'currency').and.returnValue('EUR');
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    const prefixTexts = await parallel(() => formFields.map((f) => f.getPrefixText()));
    const suffixTexts = await parallel(() => formFields.map((f) => f.getSuffixText()));

    expect(prefixTexts).toEqual(['']);
    expect(suffixTexts).toEqual(['€']);
  });
});
