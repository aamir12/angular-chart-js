import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prdouct } from '../_model/product';
import { Sales } from '../_model/sales';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  url = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  loadProducts() {
    return this.http.get<Prdouct[]>(`${this.url}/products`);
  }

  loadSales() {
    return this.http.get<Sales[]>(`${this.url}/sales`);
  }
}
