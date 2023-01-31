import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, EMPTY, Subject } from 'rxjs';
import { ProductService } from '../product.service';
import { getShowProductCode, State } from '../state/product.reducer';
import * as ProductActions from '../state/product.actions';
import { Product } from '../product';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit
// implements OnInit, OnDestroy here is implemented declarative pattern insted of proceduralApproach
{
  pageTitle = 'Products';
  displayCode!: Boolean;

  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();
  // selectedProductId = 0; this method works fine but i ll implement obervable
  products$ = this.productService.productsWithCategories$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService,
    private store: Store<State>) { }


  ngOnInit(): void {
    this.store.select(getShowProductCode)
      .subscribe(showProductCode =>
        this.displayCode = showProductCode
      )
  }

  //the same issue like in list component
  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts().subscribe({
  //     next: products => this.products = products,
  //     error: err => this.errorMessage = err
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    // this.selectedProductId = productId; this method works fine but i ll implement obervable
    this.productService.selectedProductChange(productId);
  }

  checkChanged(): void {
    this.store.dispatch(ProductActions.toggleProductCode());
  }

  addNewProduct(): void {
    this.store.dispatch(ProductActions.initializeCurrentProduct());
  }

  selectProduct(product: Product): void {
    this.store.dispatch(ProductActions.setCurrentProduct({product}));
  }
}
