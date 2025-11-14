import { Component } from '@angular/core';
import { Intl } from './intl/intl';
import { Transactions } from './transactions/transactions';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  imports: [MatDivider, Intl, Transactions],
  templateUrl: './app.html',
})
export class App {}
