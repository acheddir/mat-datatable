/**
 * Strict type definitions for the datatable library
 */

import { TemplateRef } from "@angular/core";

// ============================================================================
// Column Property Types
// ============================================================================

/**
 * Supported column data types
 */
export type ColumnPropType = "String" | "Number" | "Boolean" | "Date" | "Percent" | "Link" | "html";

/**
 * Sort direction for columns
 * Includes empty string for unsorted state (Angular Material compatibility)
 */
export type SortDirection = "asc" | "desc" | "";

// ============================================================================
// Branded Types for Type Safety
// ============================================================================

/**
 * Branded type for column keys to ensure type safety
 */
export type ColumnKey<T = string> = T & { readonly __brand: "ColumnKey" };

/**
 * Helper to create a column key
 */
export function columnKey<T extends string>(key: T): ColumnKey<T> {
  return key as ColumnKey<T>;
}

// ============================================================================
// Base Column Configuration
// ============================================================================

/**
 * Filter input type for a column
 */
export type FilterType = "text" | "number" | "date" | "select" | "boolean";

/**
 * Filter configuration for a column
 */
export interface ColumnFilterConfig {
  /** Whether this column is filterable */
  readonly enabled: boolean;

  /** Type of filter input to show */
  readonly type?: FilterType;

  /** Placeholder text for filter input */
  readonly placeholder?: string;

  /** Options for select filter */
  readonly options?: readonly { label: string; value: unknown }[];

  /** Custom filter function for complex filtering */
  readonly customFilter?: (value: unknown, filterValue: unknown) => boolean;
}

/**
 * Base properties shared by all column types
 */
export interface BaseColumnConfig {
  /** Unique identifier for the column */
  readonly key: string;

  /** Display name for the column header */
  readonly display?: string;

  /** Column order in the table */
  readonly order?: number;

  /** Whether to hide this column */
  readonly hide?: boolean;

  /** Whether to disable interactions on this column */
  readonly disabled?: boolean;

  /** Whether this column is sortable */
  readonly canSort?: boolean;

  /** Custom sort fields (for multi-field sorting) */
  readonly sortFields?: readonly string[];

  /** Filter configuration for this column */
  readonly filter?: ColumnFilterConfig;

  /** Label for filter input (deprecated - use filter.placeholder) */
  readonly inputLabel?: string;

  /** Label to show when value is empty/null */
  readonly emptyLabel?: string;

  /** Custom template name for rendering */
  readonly templateName?: string;
}

// ============================================================================
// Discriminated Union for Column Types
// ============================================================================

export interface StringColumnConfig extends BaseColumnConfig {
  readonly propType: "String";
}

export interface NumberColumnConfig extends BaseColumnConfig {
  readonly propType: "Number";
  /** Number format (e.g., '1.0-2' for decimals) */
  readonly format?: string;
}

export interface BooleanColumnConfig extends BaseColumnConfig {
  readonly propType: "Boolean";
  /** Custom labels for true/false values */
  readonly trueLabel?: string;
  readonly falseLabel?: string;
}

export interface DateColumnConfig extends BaseColumnConfig {
  readonly propType: "Date";
  /** Date format (Angular DatePipe format) */
  readonly format?: string;
}

export interface PercentColumnConfig extends BaseColumnConfig {
  readonly propType: "Percent";
  /** Percent format (e.g., '1.2-2') */
  readonly format?: string;
}

export interface LinkColumnConfig extends BaseColumnConfig {
  readonly propType: "Link";
  /** URL property name (if different from display value) */
  readonly hrefProperty?: string;
}

export interface HtmlColumnConfig extends BaseColumnConfig {
  readonly propType: "html";
  /** Whether to sanitize HTML */
  readonly sanitize?: boolean;
}

/**
 * Discriminated union of all column types
 */
export type ColumnConfig =
  | StringColumnConfig
  | NumberColumnConfig
  | BooleanColumnConfig
  | DateColumnConfig
  | PercentColumnConfig
  | LinkColumnConfig
  | HtmlColumnConfig;

// ============================================================================
// Datatable Options
// ============================================================================

/**
 * Required sorting configuration
 */
export interface SortingConfig {
  /** Default active sort column key */
  readonly defaultActive: string;

  /** Default sort direction */
  readonly defaultDirection: SortDirection;
}

/**
 * Optional paging configuration
 */
export interface PagingConfig {
  /** Whether pagination is enabled */
  readonly enabled: boolean;

  /** Default page size */
  readonly defaultSize?: number;

  /** Available page size options */
  readonly sizeOptions?: readonly number[];
}

/**
 * Filtering configuration
 */
export interface FilteringConfig {
  /** Whether filtering is enabled globally */
  readonly enabled: boolean;

  /** Debounce time for text inputs in milliseconds */
  readonly debounceTime?: number;

  /** Whether to show filter row */
  readonly showFilterRow?: boolean;
}

/**
 * Column filter values (key-value pairs)
 */
export type ColumnFilters = Readonly<Record<string, unknown>>;

/**
 * Filter change event
 */
export interface FilterChangeEvent {
  /** Column key that was filtered */
  readonly columnKey: string;

  /** New filter value */
  readonly value: unknown;

  /** All active filters */
  readonly allFilters: ColumnFilters;
}

/**
 * Required datatable options
 */
export interface RequiredDatatableOptions {
  /** Sorting configuration (required) */
  readonly sorting: SortingConfig;
}

/**
 * Optional datatable options
 */
export interface OptionalDatatableOptions<T = unknown> {
  /** Pagination configuration */
  readonly paging?: PagingConfig;

  /** Filtering configuration */
  readonly filtering?: FilteringConfig;

  /** Whether to use server-side data operations */
  readonly serverSide?: boolean;

  /** Message to display when no data */
  readonly empty?: string;

  /** Whether to alternate row colors */
  readonly alternateRowColor?: boolean;

  /** Callback when row is clicked */
  readonly callBack?: (row: T) => void;

  /** Whether to show row numbers */
  readonly showRowNumber?: boolean;

  /** Template for actions column */
  readonly actionsTemplate?: TemplateRef<unknown>;

  /** Title for actions column */
  readonly actionsTitle?: string;

  /** Whether to show table header */
  readonly showHeader?: boolean;
}

/**
 * Complete datatable options (required + optional)
 */
export type DatatableOptions<T = unknown> = RequiredDatatableOptions & OptionalDatatableOptions<T>;

// ============================================================================
// Table Metadata
// ============================================================================

/**
 * Symbol for storing table metadata on class prototypes
 */
export const TABLE_METADATA_KEY = Symbol("table-metadata");

/**
 * Table metadata stored on decorated classes
 */
export interface TableMetadata {
  /** Column configurations */
  readonly columns: readonly ColumnConfig[];
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Extract keys of type T that match a specific column type
 */
export type KeysOfType<T, PropType extends ColumnPropType> = {
  [K in keyof T]: T[K] extends InferColumnType<PropType> ? K : never;
}[keyof T];

/**
 * Infer TypeScript type from column property type
 */
type InferColumnType<T extends ColumnPropType> = T extends "String"
  ? string
  : T extends "Number"
    ? number
    : T extends "Boolean"
      ? boolean
      : T extends "Date"
        ? Date
        : T extends "Percent"
          ? number
          : T extends "Link"
            ? string
            : T extends "html"
              ? string
              : never;

/**
 * Utility type to make specific properties required
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
