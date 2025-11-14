import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CurrencyPipe } from '../currency-pipe';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { IntlService } from '../intl-service';
import { FormFieldCurrency } from '../form-field-currency';
import { MatFormFieldModule } from '@angular/material/form-field';
import { formatCurrency } from '../format-currency';
import { MatDividerModule } from '@angular/material/divider';

interface Transaction {
  item: string;
  cost: number;
}

const transactions: Transaction[] = [
  { item: 'Beach ball', cost: 4 },
  { item: 'Towel', cost: 5 },
  { item: 'Frisbee', cost: 2 },
  { item: 'Sunscreen', cost: 4 },
  { item: 'Cooler', cost: 25 },
  { item: 'Swim suit', cost: 15 },
];

@Component({
  selector: 'app-transactions',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormFieldCurrency,
    CurrencyPipe,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions {
  displayedColumns: string[] = ['item', 'cost'];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild('input')
  inputElement!: ElementRef<HTMLInputElement>;

  intlService = inject(IntlService);

  constructor() {
    this.dataSource = new MatTableDataSource(transactions);
    this.dataSource.filterPredicate = (data, filter) => {
      return data.cost >= parseInt(filter, 10);
    };
  }

  getTotalCost() {
    return formatCurrency(
      this.dataSource.filteredData.map((t) => t.cost).reduce((acc, value) => acc + value, 0),
      this.intlService.locale(),
      this.intlService.currency(),
    )
      .map((part) => part.value)
      .join('');
  }

  isTotalCostNotZero() {
    return (
      formatCurrency(0, this.intlService.locale(), this.intlService.currency())
        .map((part) => part.value)
        .join('') !== this.getTotalCost()
    );
  }

  applyFilter() {
    this.dataSource.filter = this.inputElement!.nativeElement.value;
  }
}
