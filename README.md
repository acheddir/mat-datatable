# Angular Material Datatable

[![CI](https://github.com/acheddir/mat-datatable/actions/workflows/ci.yml/badge.svg)](https://github.com/acheddir/mat-datatable/actions/workflows/ci.yml)
[![npm](https://badge.fury.io/js/@acheddir%2Fmat-datatable.svg)](https://www.npmjs.com/package/@acheddir/mat-datatable)
[![Angular](https://img.shields.io/badge/Angular-21.x-red.svg)](https://angular.io/)
[![downloads](https://img.shields.io/npm/dm/@acheddir/mat-datatable.svg)](https://www.npmjs.com/package/@acheddir/mat-datatable)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready Angular Material datatable library with built-in support for pagination, sorting, and column filtering. Works seamlessly with both client-side and server-side data sources.

## Features

- ✅ **Dual-Mode Data Handling**: Client-side and server-side data processing
- ✅ **Column Filtering**: Per-column filters with support for text, number, date, boolean, and select inputs
- ✅ **Sorting**: Single and multi-column sorting with Material Design UI
- ✅ **Pagination**: Configurable page sizes with Material paginator
- ✅ **Type-Safe**: Full TypeScript support with generics
- ✅ **Decorator-Based**: Simple `@Column()` decorator for metadata
- ✅ **Customizable**: Template slots for custom columns and actions
- ✅ **Debounced Filters**: Optimized filter input with configurable debounce time
- ✅ **Accessibility**: Built on Angular Material for WCAG compliance
- ✅ **Production Ready**: 75+ unit tests, strict linting, and 51% code coverage

## Features Roadmap

- Row selection (single/multi)
- Column reordering (drag & drop)
- Column visibility toggle
- Export to CSV/Excel
- Inline editing
- Row expansion (master-detail)
- Virtual scrolling for large datasets
- Saved user preferences
- Global search across all columns
- Advanced filters (date ranges, multi-select)

## Installation

### From npm

```bash
npm install @acheddir/mat-datatable
```

Or with pnpm:

```bash
pnpm add @acheddir/mat-datatable
```

### Peer Dependencies

Ensure you have the required peer dependencies installed:

```bash
npm install @angular/common@^21.0.0 @angular/core@^21.0.0 \
            @angular/material@^21.0.0 @angular/cdk@^21.0.0 \
            @angular/forms@^21.0.0 rxjs@^7.8.0
```

## Quick Start

### 1. Define Your Model

```typescript
import { Column } from "@acheddir/mat-datatable";

export class User {
  @Column({ display: "ID", propType: "Number", order: 1 })
  id!: number;

  @Column({ display: "Name", propType: "String", order: 2, filter: { enabled: true } })
  name!: string;

  @Column({ display: "Email", propType: "String", order: 3, filter: { enabled: true } })
  email!: string;

  @Column({ display: "Active", propType: "Boolean", order: 4, filter: { enabled: true } })
  active!: boolean;

  @Column({ display: "Created Date", propType: "Date", order: 5 })
  createdAt!: Date;
}
```

### 2. Configure the Datatable

```typescript
import { Component } from "@angular/core";
import { DatatableComponent, DatatableOptions } from "@acheddir/mat-datatable";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [DatatableComponent],
  template: `
    <mat-datatable [data]="users" [options]="tableOptions" [modelClass]="userModelClass" />
  `,
})
export class UsersComponent {
  userModelClass = User;
  users: User[] = [
    { id: 1, name: "Alice", email: "alice@example.com", active: true, createdAt: new Date() },
    { id: 2, name: "Bob", email: "bob@example.com", active: false, createdAt: new Date() },
  ];

  tableOptions: DatatableOptions<User> = {
    serverSide: false,
    showHeader: true,
    showRowNumber: true,
    alternateRowColor: true,
    sorting: {
      defaultActive: "name",
      defaultDirection: "asc",
    },
    paging: {
      enabled: true,
      sizeOptions: [10, 25, 50, 100],
    },
    filtering: {
      enabled: true,
    },
  };
}
```

## API Reference

### DatatableComponent

The main datatable component that renders your data in a Material table.

#### Inputs

| Input        | Type                          | Description                                        |
| ------------ | ----------------------------- | -------------------------------------------------- |
| `data`       | `T[]`                         | Array of data to display (required)                |
| `options`    | `DatatableOptions<T>`         | Configuration options (required)                   |
| `modelClass` | `new () => T`                 | Model class constructor for metadata extraction    |
| `dataLength` | `number`                      | Total number of items (for server-side pagination) |
| `loading`    | `boolean`                     | Loading state indicator                            |
| `templates`  | `Record<string, TemplateRef>` | Custom column templates                            |

#### Outputs

| Output         | Type                              | Description                                    |
| -------------- | --------------------------------- | ---------------------------------------------- |
| `sort`         | `EventEmitter<Sort>`              | Emitted when sort changes (server-side mode)   |
| `changePage`   | `EventEmitter<PageEvent>`         | Emitted when page changes (server-side mode)   |
| `filterChange` | `EventEmitter<FilterChangeEvent>` | Emitted when filter changes (server-side mode) |

### DatatableOptions<T>

Configuration interface for the datatable component.

```typescript
interface DatatableOptions<T> {
  // Data source mode
  serverSide: boolean;

  // Display options
  showHeader?: boolean;
  showRowNumber?: boolean;
  alternateRowColor?: boolean;

  // Sorting configuration
  sorting: SortingConfig;

  // Pagination configuration
  paging?: PagingConfig;

  // Filtering configuration
  filtering?: FilteringConfig;

  // Custom templates
  actionsTemplate?: TemplateRef<unknown>;

  // Row click callback
  callBack?: (row: T) => void;
}
```

### @Column() Decorator

Decorator for defining column metadata on model properties.

```typescript
@Column({
  key?: string;              // Column key (defaults to property name)
  display?: string;          // Display header text
  propType: PropType;        // Data type: 'String' | 'Number' | 'Date' | 'Boolean' | 'Percent' | 'Link' | 'html'
  order: number;             // Display order (required)
  canSort?: boolean;         // Enable sorting (default: true)
  hide?: boolean;            // Hide column (default: false)
  inputLabel?: string;       // Fallback placeholder for filter input
  filter?: FilterConfig;     // Column filter configuration
})
```

### FilterConfig

Configuration for column filtering.

```typescript
interface FilterConfig {
  enabled: boolean;
  type?: FilterType; // 'text' | 'number' | 'date' | 'boolean' | 'select'
  placeholder?: string; // Custom placeholder text
  options?: Array<{ label: string; value: unknown }>; // Options for select filter
  customFilter?: (rowValue: unknown, filterValue: unknown) => boolean;
}
```

## Usage Examples

### Client-Side Mode

Process all data operations (filtering, sorting, pagination) in the browser.

```typescript
@Component({
  selector: 'app-client-side-table',
  template: `
    <mat-datatable
      [data]="products"
      [options]="options"
      [modelClass]="productClass"
    />
  `,
})
export class ClientSideTableComponent {
  productClass = Product;
  products: Product[] = [...]; // Your full dataset

  options: DatatableOptions<Product> = {
    serverSide: false,  // Client-side processing
    showHeader: true,
    sorting: {
      defaultActive: 'name',
      defaultDirection: 'asc',
    },
    paging: {
      enabled: true,
      sizeOptions: [10, 25, 50],
    },
    filtering: {
      enabled: true,
    },
  };
}
```

### Server-Side Mode

Delegate data operations to your backend API.

```typescript
@Component({
  selector: "app-server-side-table",
  template: `
    <mat-datatable
      [data]="products"
      [dataLength]="totalCount"
      [loading]="loading"
      [options]="options"
      [modelClass]="productClass"
      (sort)="onSort($event)"
      (changePage)="onPageChange($event)"
      (filterChange)="onFilterChange($event)"
    />
  `,
})
export class ServerSideTableComponent implements OnInit {
  productClass = Product;
  products: Product[] = [];
  totalCount = 0;
  loading = false;

  options: DatatableOptions<Product> = {
    serverSide: true, // Server-side processing
    showHeader: true,
    sorting: {
      defaultActive: "name",
      defaultDirection: "asc",
    },
    paging: {
      enabled: true,
      sizeOptions: [10, 25, 50],
    },
    filtering: {
      enabled: true,
    },
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSort(sort: Sort): void {
    this.loadData({ sort });
  }

  onPageChange(page: PageEvent): void {
    this.loadData({ page });
  }

  onFilterChange(filter: FilterChangeEvent): void {
    this.loadData({ filters: filter.allFilters });
  }

  private loadData(params?: {
    sort?: Sort;
    page?: PageEvent;
    filters?: Record<string, unknown>;
  }): void {
    this.loading = true;
    this.productService.getProducts(params).subscribe({
      next: (result) => {
        this.products = result.data;
        this.totalCount = result.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
```

### Custom Column Templates

Add custom rendering for specific columns.

```typescript
@Component({
  template: `
    <ng-template #actionsTemplate let-row>
      <button mat-icon-button (click)="edit(row)">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button (click)="delete(row)">
        <mat-icon>delete</mat-icon>
      </button>
    </ng-template>

    <mat-datatable [data]="users" [options]="options" [templates]="{ actions: actionsTemplate }" />
  `,
})
export class CustomTemplateComponent {
  @ViewChild("actionsTemplate") actionsTemplate!: TemplateRef<unknown>;

  options: DatatableOptions<User> = {
    serverSide: false,
    actionsTemplate: this.actionsTemplate, // Assigned after view init
    // ... other options
  };

  edit(user: User): void {
    console.log("Edit", user);
  }

  delete(user: User): void {
    console.log("Delete", user);
  }
}
```

### Filter Types

The library supports multiple filter input types, automatically inferred from `propType` or explicitly configured.

```typescript
export class Product {
  @Column({
    display: "Name",
    propType: "String",
    order: 1,
    filter: { enabled: true }, // Auto-detects 'text' filter
  })
  name!: string;

  @Column({
    display: "Price",
    propType: "Number",
    order: 2,
    filter: { enabled: true }, // Auto-detects 'number' filter
  })
  price!: number;

  @Column({
    display: "Release Date",
    propType: "Date",
    order: 3,
    filter: { enabled: true }, // Auto-detects 'date' filter
  })
  releaseDate!: Date;

  @Column({
    display: "In Stock",
    propType: "Boolean",
    order: 4,
    filter: { enabled: true }, // Auto-detects 'boolean' filter (checkbox)
  })
  inStock!: boolean;

  @Column({
    display: "Category",
    propType: "String",
    order: 5,
    filter: {
      enabled: true,
      type: "select", // Explicit 'select' filter
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Food", value: "food" },
      ],
    },
  })
  category!: string;
}
```

### Row Click Handling

Handle row clicks with a callback function.

```typescript
options: DatatableOptions<User> = {
  serverSide: false,
  callBack: (user: User) => {
    console.log("Row clicked:", user);
    this.router.navigate(["/users", user.id]);
  },
  // ... other options
};
```

## TypeScript Support

This library is fully typed with TypeScript generics for type-safe data handling.

```typescript
// Type-safe datatable
const options: DatatableOptions<User> = { /* ... */ };

// Type-safe events
onFilterChange(event: FilterChangeEvent): void {
  const filters: Record<string, unknown> = event.allFilters;
  const columnKey: string = event.columnKey;
  const value: unknown = event.value;
}
```

## Configuration Best Practices

### Debounce Time for Filters

Adjust debounce time for filter inputs (default: 300ms):

```typescript
@Column({
  display: 'Search',
  propType: 'String',
  order: 1,
  filter: {
    enabled: true,
    placeholder: 'Type to search...',
    // Note: debounceTime is set on ColumnFilterComponent, not in decorator
  },
})
```

### Custom Filter Logic

Implement custom filtering logic for complex scenarios:

```typescript
@Column({
  display: 'Price Range',
  propType: 'Number',
  order: 1,
  filter: {
    enabled: true,
    customFilter: (rowValue: unknown, filterValue: unknown) => {
      const price = Number(rowValue);
      const maxPrice = Number(filterValue);
      return price <= maxPrice;
    },
  },
})
price!: number;
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Requirements

- Angular 21.x
- Angular Material 21.x
- TypeScript 5.7+
- Node.js 20.x LTS or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](https://github.com/acheddir/mat-datatable/blob/main/LICENSE) file for details

## Changelog

See [CHANGELOG.md](https://github.com/acheddir/mat-datatable/blob/main/CHANGELOG.md) for version history and release notes.

## Support

For questions or issues:

- **GitHub Issues**: https://github.com/acheddir/mat-datatable/issues
- **Email**: acheddir@outlook.fr

## Demo

Check out the [demo application](https://github.com/acheddir/mat-datatable/tree/main/apps/demo) for examples of all features.
