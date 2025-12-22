import { Component, OnInit, inject } from "@angular/core";
import { DatatableComponent, DatatableOptions } from "@acheddir/mat-datatable";
import { MockDataService } from "../../services/mock-data.service";
import { Product } from "../../models/product.model";

@Component({
  selector: "app-basic-example",
  standalone: true,
  imports: [DatatableComponent],
  template: `
    <div class="example-container">
      <h2 class="text-2xl font-bold mb-4">Basic Example</h2>
      <p class="mb-4 text-gray-600">
        Simple datatable with 10 products, sorting enabled, pagination disabled.
      </p>

      <mat-datatable
        [data]="products"
        [modelClass]="Product"
        [options]="datatableOptions"
        [dataLength]="products.length"
      />
    </div>
  `,
  styles: [
    `
      .example-container {
        padding: 20px;
      }
    `,
  ],
})
export class BasicExampleComponent implements OnInit {
  public Product = Product; // Expose Product class to template
  public products: Product[] = [];
  public datatableOptions: DatatableOptions = {
    sorting: {
      defaultActive: "name",
      defaultDirection: "asc",
    },
    paging: {
      enabled: false,
    },
    serverSide: false,
    showHeader: true,
    empty: "No products available",
  };

  private readonly mockDataService = inject(MockDataService);

  public ngOnInit(): void {
    this.products = [];
  }
}
