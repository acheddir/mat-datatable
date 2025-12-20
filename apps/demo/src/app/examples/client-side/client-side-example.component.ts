import { Component, OnInit, inject } from "@angular/core";
import {
  DatatableComponent,
  DatatableOptions,
  FilterChangeEvent,
  getTableMetadata,
} from "@acheddir/mat-datatable";
import { MockDataService } from "../../services/mock-data.service";
import { Product } from "../../models/product.model";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-client-side-example",
  standalone: true,
  imports: [DatatableComponent],
  template: `
    <div class="example-container">
      <h2 class="text-2xl font-bold mb-4">Client-Side Example with Filtering</h2>
      <p class="mb-4 text-gray-600">
        Full dataset loaded in browser (50 products). Sorting, filtering, and pagination handled
        client-side. Try filtering by name, category, price, or stock.
      </p>

      <div class="mb-4 text-sm text-gray-500">
        <strong>Total Products:</strong> {{ products.length }}
        @if (activeFilterCount > 0) {
          <span class="ml-4 text-blue-600">
            <strong>Active Filters:</strong> {{ activeFilterCount }}
          </span>
        }
      </div>

      <rs-mat-datatable
        [data]="products"
        [options]="datatableOptions"
        [dataLength]="products.length"
        [modelClass]="Product"
        (sort)="onSort($event)"
        (changePage)="onPageChange($event)"
        (filterChange)="onFilterChange($event)"
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
export class ClientSideExampleComponent implements OnInit {
  public Product = Product;
  public products: Product[] = [];
  public activeFilterCount = 0;

  public datatableOptions: DatatableOptions<Product> = {
    sorting: {
      defaultActive: "id",
      defaultDirection: "asc",
    },
    paging: {
      enabled: true,
      defaultSize: 10,
      sizeOptions: [5, 10, 25, 50],
    },
    filtering: {
      enabled: true,
      debounceTime: 300,
      showFilterRow: true,
    },
    serverSide: false,
    showHeader: true,
    alternateRowColor: true,
    empty: "No products available",
  };

  private readonly mockDataService = inject(MockDataService);

  public ngOnInit(): void {
    // Load data (could be from API or Redux store)
    this.products = this.mockDataService.generateProducts(50);

    // Populate filter options dynamically
    this.populateCategoryFilterOptions();
  }

  private populateCategoryFilterOptions(): void {
    // Extract unique categories from data
    const uniqueCategories = [...new Set(this.products.map((p) => p.category))];

    // Build filter options
    const categoryOptions = uniqueCategories.map((cat) => ({
      label: cat,
      value: cat,
    }));

    // Update the column metadata
    const metadata = getTableMetadata(Product.prototype);
    if (metadata) {
      const categoryColumn = metadata.columns.find((col) => col.key === "category");
      if (categoryColumn?.filter) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (categoryColumn.filter as any).options = categoryOptions;
      }
    }
  }

  public onSort(_sort: Sort): void {
    // Sort handling managed by datatable component
  }

  public onPageChange(_page: PageEvent): void {
    // Page change handling managed by datatable component
  }

  public onFilterChange(event: FilterChangeEvent): void {
    this.activeFilterCount = Object.keys(event.allFilters).length;
  }
}
