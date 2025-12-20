import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from "@angular/material/table";
import { MatSort, MatSortHeader, Sort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet, PercentPipe } from "@angular/common";
import { ColumnConfig, TableMetadata, getTableMetadata } from "./models";
import type { DatatableOptions, SortDirection, FilterChangeEvent } from "./models";
import { deepClone, sortBy, orderBy } from "./utils/data-utils";
import { ColumnFilterComponent } from "./components/column-filter.component";

@Component({
  selector: "rs-mat-datatable",
  imports: [
    MatTable,
    MatSort,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatSortHeader,
    NgTemplateOutlet,
    PercentPipe,
    DatePipe,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    DecimalPipe,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    NgClass,
    ColumnFilterComponent,
  ],
  templateUrl: "./mat-datatable.html",
  styleUrls: ["./mat-datatable.scss"],
})
export class DatatableComponent<T extends object> implements AfterViewInit {
  @ViewChild(MatSort) public matSort!: MatSort;

  @Output() public sort = new EventEmitter<Sort>();
  @Output() public changePage = new EventEmitter<PageEvent>();
  @Output() public searchChange = new EventEmitter<string | undefined>();
  @Output() public filterChange = new EventEmitter<FilterChangeEvent>();

  @Input() public dataLength = 0;
  @Input() public templates: Readonly<Record<string, TemplateRef<unknown> | undefined>> = {};

  @Input()
  public set modelClass(value: (new () => T) | undefined) {
    this._modelClass = value;
    // If we have an empty data array and now we have a modelClass, extract the table metadata
    if (value !== undefined && this._data.length === 0 && this._tableMetadata === undefined) {
      this._tableMetadata = getTableMetadata(value.prototype as Record<symbol, unknown>);
      // Build columns if we have options
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this._options !== undefined) {
        this.buildColumns();
      }
    }
  }

  public get modelClass(): (new () => T) | undefined {
    return this._modelClass;
  }

  @Input()
  public set options(value: DatatableOptions<T>) {
    this._options = value;
    // Rebuild columns if we have table metadata
    if (this._tableMetadata) {
      this.buildColumns();
      // Only initialize data if we have actual data
      if (this._data.length > 0) {
        this.initializeClientSideData(this._originalData);
      }
    }
  }

  public get options(): DatatableOptions<T> {
    return this._options;
  }

  @Input()
  public set data(values: T[] | undefined) {
    if (values) {
      this._data = deepClone(values);

      // Get table metadata from prototype (works even with empty arrays!)
      if (values.length > 0) {
        // Read from first instance's prototype
        this._tableMetadata = getTableMetadata(
          Object.getPrototypeOf(values[0]) as Record<symbol, unknown>
        );
      } else if (this.modelClass !== undefined) {
        // Read from provided model class prototype
        this._tableMetadata = getTableMetadata(
          this.modelClass.prototype as Record<symbol, unknown>
        );
      }

      // Build columns if we have table metadata
      if (this._tableMetadata !== undefined) {
        this.buildColumns();
      }

      this._originalData = deepClone(this._data);

      // Initialize client-side operations if options is available
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.options !== undefined && values.length > 0) {
        this.initializeClientSideData(values);
      }
    } else {
      this._data = [];
    }
  }

  public get data(): T[] {
    return this._data;
  }

  @Input()
  public set loading(value: boolean) {
    this._loading = value;
  }

  public get loading(): boolean {
    return this._loading;
  }

  private _data: T[] = [];
  private _loading = false;
  private _originalData: T[] = [];
  private _filteredData: T[] = [];
  private _tableMetadata?: TableMetadata;
  private _options!: DatatableOptions<T>;
  private _modelClass?: new () => T;

  private sortEvent: Sort | null = null;
  private pageEvent: PageEvent | null = null;
  private columnFilters: Record<string, unknown> = {};

  public pageIndex = 0;
  public pageSize = 20;

  public columns: readonly ColumnConfig[] = [];
  public displayedColumns: readonly string[] = [];
  public filterColumns: readonly string[] = [];

  public ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.matSort !== undefined) {
      this.matSort.active = this.options.sorting.defaultActive;
      this.matSort.direction = this.options.sorting.defaultDirection;
    }
  }

  private buildColumns(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this._tableMetadata?.columns === undefined || this.options === undefined) return;

    // Sort columns by order and convert to array
    this.columns = sortBy([...this._tableMetadata.columns], ["order"]);

    // Get non-hidden column keys
    const nonHiddenColumns: readonly string[] = this.columns
      .filter((c) => !c.hide)
      .map((col) => col.key);

    // Add actions column if template provided
    let displayedCols = this.options.actionsTemplate
      ? [...nonHiddenColumns, "actions"]
      : [...nonHiddenColumns];

    // Add row number column if enabled
    displayedCols = this.options.showRowNumber ? ["rowNumber", ...displayedCols] : displayedCols;

    this.displayedColumns = displayedCols;

    // Build filter columns (add '-filter' suffix to each column)
    this.filterColumns = displayedCols.map((col) => col + "-filter");
  }

  private initializeClientSideData(values: T[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.options === undefined || this.options.serverSide === true) return;

    this.dataLength = values.length;

    const pageIndex = this.pageIndex;
    const pageSize = this.pageSize;

    this.internalPageAndSort(
      pageIndex,
      pageSize,
      this.options.sorting.defaultDirection,
      this.options.sorting.defaultActive
    );

    this.sortEvent = {
      active: this.options.sorting.defaultActive,
      direction: this.options.sorting.defaultDirection,
    };
  }

  public onSort(params: Sort): void {
    this.sortEvent = params;

    if (this.options.serverSide) {
      this.sort.emit(params);
    } else {
      const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : this.pageIndex;
      const pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;

      this.internalPageAndSort(pageIndex, pageSize, params.direction, params.active);
    }
  }

  public onPage(params: PageEvent): void {
    this.pageEvent = params;

    if (this.options.serverSide) {
      this.changePage.emit(params);
    } else {
      this.pageIndex = params.pageIndex;
      this.pageSize = params.pageSize;

      this.internalPageAndSort(
        params.pageIndex,
        params.pageSize,
        this.sortEvent?.direction,
        this.sortEvent?.active
      );
    }
  }

  public internalPageAndSort(
    pageIndex: number,
    take: number,
    direction?: SortDirection,
    active?: string
  ): void {
    // Use filtered data if filters are active, otherwise use original data
    const sourceData =
      Object.keys(this.columnFilters).length > 0 ? this._filteredData : this._originalData;

    let activeSortColumns: string[] = [];

    if (active !== undefined && active !== "") {
      activeSortColumns =
        active.split(",").length > 1 ? active.split(",").slice(1) : active.split(",");
    }

    const sortedData =
      direction !== undefined && direction !== "" && activeSortColumns.length > 0
        ? orderBy(sourceData, activeSortColumns as (keyof T)[], [direction])
        : sourceData;

    const skip = pageIndex * take;

    this._data = [...sortedData.slice(skip, skip + take)];
  }

  public get currentPage(): number {
    return (this.pageEvent?.pageIndex ?? 0) * (this.pageEvent?.pageSize ?? 1);
  }

  public callBack(row: T): void {
    this.options.callBack?.(row);
  }

  public onFilterChange(columnKey: string, value: unknown): void {
    // Find the column to check its type
    const column = this.columns.find((c) => c.key === columnKey);

    // For boolean filters, treat false as "no filter" (unchecked checkbox)
    const shouldRemoveFilter =
      value === null ||
      value === undefined ||
      value === "" ||
      (column?.propType === "Boolean" && value === false);

    // Update column filters
    if (shouldRemoveFilter) {
      // Create a new object without the key instead of using delete
      const { [columnKey]: _removed, ...remaining } = this.columnFilters;
      this.columnFilters = remaining;
    } else {
      this.columnFilters[columnKey] = value;
    }

    const filterEvent: FilterChangeEvent = {
      columnKey,
      value,
      allFilters: { ...this.columnFilters },
    };

    if (this.options.serverSide) {
      // Emit filter event for server-side handling
      this.filterChange.emit(filterEvent);
    } else {
      // Apply filters client-side
      this.applyFiltersAndRefresh();
    }
  }

  private applyFiltersAndRefresh(): void {
    // Apply filters to original data
    this._filteredData = this.applyFilters(this._originalData);
    this.dataLength = this._filteredData.length;

    // Reset to first page when filter changes
    this.pageIndex = 0;
    if (this.pageEvent !== null) {
      this.pageEvent = {
        pageIndex: 0,
        pageSize: this.pageEvent.pageSize,
        length: this.pageEvent.length,
        previousPageIndex: this.pageEvent.previousPageIndex,
      };
    }

    // Reapply sorting and paging
    const pageSize = this.pageSize;
    this.internalPageAndSort(0, pageSize, this.sortEvent?.direction, this.sortEvent?.active);
  }

  private applyFilters(data: T[]): T[] {
    if (Object.keys(this.columnFilters).length === 0) {
      return data;
    }

    return data.filter((row) => {
      return Object.entries(this.columnFilters).every(([columnKey, filterValue]) => {
        const column = this.columns.find((c) => c.key === columnKey);
        if (!column) return true;

        const rowValue = (row as Record<string, unknown>)[columnKey];

        // Use custom filter if provided
        if (column.filter?.customFilter) {
          return column.filter.customFilter(rowValue, filterValue);
        }

        // Default filtering logic based on column type
        return this.defaultFilter(rowValue, filterValue, column);
      });
    });
  }

  private defaultFilter(rowValue: unknown, filterValue: unknown, column: ColumnConfig): boolean {
    // Handle null/undefined row values
    if (rowValue === null || rowValue === undefined) {
      return false;
    }

    switch (column.propType) {
      case "String":
      case "Link":
      case "html": {
        const rowStr =
          typeof rowValue === "string" ||
          typeof rowValue === "number" ||
          typeof rowValue === "boolean"
            ? String(rowValue)
            : "";
        const filterStr =
          typeof filterValue === "string" ||
          typeof filterValue === "number" ||
          typeof filterValue === "boolean"
            ? String(filterValue)
            : "";
        return rowStr.toLowerCase().includes(filterStr.toLowerCase());
      }

      case "Number":
      case "Percent":
        return Number(rowValue) === Number(filterValue);

      case "Boolean":
        return Boolean(rowValue) === Boolean(filterValue);

      case "Date": {
        // Compare dates by day (ignore time)
        const rowDate = new Date(rowValue as string | number | Date);
        const filterDate = new Date(filterValue as string | number | Date);
        return (
          rowDate.getFullYear() === filterDate.getFullYear() &&
          rowDate.getMonth() === filterDate.getMonth() &&
          rowDate.getDate() === filterDate.getDate()
        );
      }

      default: {
        const rowStr =
          typeof rowValue === "string" ||
          typeof rowValue === "number" ||
          typeof rowValue === "boolean"
            ? String(rowValue)
            : "";
        const filterStr =
          typeof filterValue === "string" ||
          typeof filterValue === "number" ||
          typeof filterValue === "boolean"
            ? String(filterValue)
            : "";
        return rowStr.toLowerCase().includes(filterStr.toLowerCase());
      }
    }
  }

  // Predicate functions for row templates
  public isEmptyData = (): boolean => {
    return this.data.length === 0;
  };

  public hasData = (): boolean => {
    return this.data.length > 0;
  };
}
