import { createColumn } from "../models/column.model";
import {
  tableSymbol,
  createTableMetadata,
  addColumnToMetadata,
  getTableMetadata,
  setTableMetadata,
} from "../models/table.model";
import type { BaseColumnConfig, ColumnPropType } from "../models/types";

/**
 * Column decorator to define table column metadata on model properties
 *
 * @param options - Column configuration options
 * @returns Property decorator
 *
 * @example
 * ```typescript
 * class Product {
 *   @Column({
 *     order: 1,
 *     display: 'Product Name',
 *     canSort: true
 *   })
 *   name!: string;
 *
 *   @Column({
 *     order: 2,
 *     display: 'Price',
 *     propType: 'Number',
 *     canSort: true
 *   })
 *   price!: number;
 * }
 * ```
 */
export function Column<T extends object>(
  options: Partial<BaseColumnConfig> & { propType?: ColumnPropType } = {}
): (target: T, propertyKey: keyof T & string) => void {
  return (target: T, propertyKey: keyof T & string): void => {
    // Get existing metadata or create new
    const targetPrototype = target as unknown as Record<symbol, unknown>;
    let metadata = getTableMetadata(targetPrototype);

    if (!metadata) {
      metadata = createTableMetadata([]);
      setTableMetadata(targetPrototype, metadata);
    }

    // Create column configuration with property key
    const columnConfig = createColumn({
      ...options,
      key: options.key ?? propertyKey,
    });

    // Add column to metadata (immutably)
    const updatedMetadata = addColumnToMetadata(metadata, columnConfig);
    setTableMetadata(targetPrototype, updatedMetadata);
  };
}

// Re-export for convenience
export { tableSymbol };
