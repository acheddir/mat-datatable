import type { ColumnConfig, BaseColumnConfig, ColumnPropType, WithRequired } from "./types";

/**
 * Column creation options with optional propType and type-specific properties
 */
type ColumnCreationOptions = Partial<BaseColumnConfig> &
  Pick<BaseColumnConfig, "key"> & {
    propType?: ColumnPropType;
    format?: string;
    trueLabel?: string;
    falseLabel?: string;
    hrefProperty?: string;
    sanitize?: boolean;
  };

/**
 * Creates a column configuration with defaults applied
 *
 * @param options - Partial column configuration with key required
 * @returns Fully configured column
 */
export function createColumn(options: ColumnCreationOptions): ColumnConfig {
  const propType: ColumnPropType = options.propType ?? "String";

  const baseConfig: WithRequired<BaseColumnConfig, "key"> = {
    key: options.key,
    display: options.display,
    order: options.order ?? 0,
    hide: options.hide ?? false,
    disabled: options.disabled ?? false,
    canSort: options.canSort ?? false,
    sortFields: options.sortFields ?? [options.key],
    filter: options.filter,
    inputLabel: options.inputLabel,
    emptyLabel: options.emptyLabel ?? "---",
    templateName: options.templateName,
  };

  // Return discriminated union based on propType
  switch (propType) {
    case "Number":
      return {
        ...baseConfig,
        propType: "Number",
        format: options.format,
      };
    case "Boolean":
      return {
        ...baseConfig,
        propType: "Boolean",
        trueLabel: options.trueLabel,
        falseLabel: options.falseLabel,
      };
    case "Date":
      return {
        ...baseConfig,
        propType: "Date",
        format: options.format ?? "dd.MM.yy",
      };
    case "Percent":
      return {
        ...baseConfig,
        propType: "Percent",
        format: options.format ?? "1.2-2",
      };
    case "Link":
      return {
        ...baseConfig,
        propType: "Link",
        hrefProperty: options.hrefProperty,
      };
    case "html":
      return {
        ...baseConfig,
        propType: "html",
        sanitize: options.sanitize ?? true,
      };
    case "String":
    default:
      return {
        ...baseConfig,
        propType: "String",
      };
  }
}

/**
 * Type guard to check if column is a specific type
 */
export function isColumnType<T extends ColumnPropType>(
  column: ColumnConfig,
  type: T
): column is Extract<ColumnConfig, { propType: T }> {
  return column.propType === type;
}

// Re-export types for backward compatibility
export type { ColumnConfig, ColumnPropType, BaseColumnConfig };
