import type { ColumnConfig, TableMetadata } from "./types";

/**
 * Symbol for storing table metadata on class prototypes
 * Re-exported from types for backward compatibility
 */
export const tableSymbol = Symbol("table-metadata");

/**
 * Creates table metadata with column configurations
 *
 * @param columns - Array of column configurations
 * @returns Table metadata object
 */
export function createTableMetadata(columns: readonly ColumnConfig[] = []): TableMetadata {
  return { columns };
}

/**
 * Adds a column to existing table metadata
 *
 * @param metadata - Existing table metadata
 * @param column - Column configuration to add
 * @returns New table metadata with column added
 */
export function addColumnToMetadata(metadata: TableMetadata, column: ColumnConfig): TableMetadata {
  return {
    columns: [...metadata.columns, column],
  };
}

/**
 * Gets table metadata from a class prototype
 *
 * @param prototype - Class prototype to read from
 * @returns Table metadata or undefined if not found
 */
export function getTableMetadata(prototype: Record<symbol, unknown>): TableMetadata | undefined {
  return prototype[tableSymbol] as TableMetadata | undefined;
}

/**
 * Sets table metadata on a class prototype
 *
 * @param prototype - Class prototype to write to
 * @param metadata - Table metadata to set
 */
export function setTableMetadata(
  prototype: Record<symbol, unknown>,
  metadata: TableMetadata
): void {
  prototype[tableSymbol] = metadata;
}

// Re-export types
export type { TableMetadata, ColumnConfig };
