import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { MychartComponent } from './components/mychart/mychart.component';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'chart',
    component: MychartComponent
  }
];
