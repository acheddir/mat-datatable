import { Column } from "@acheddir/mat-datatable";

export class Product {
  @Column({
    order: 1,
    display: "Product ID",
    canSort: true,
    hide: false,
  })
  public id!: number;

  @Column({
    order: 2,
    display: "Product Name",
    canSort: true,
    filter: {
      enabled: true,
      type: "text",
      placeholder: "Search name...",
    },
  })
  public name!: string;

  @Column({
    order: 3,
    display: "Category",
    canSort: true,
    filter: {
      enabled: true,
      type: "select",
      placeholder: "Select category...",
      options: [], // Will be populated dynamically
    },
  })
  public category!: string;

  @Column({
    order: 4,
    display: "Price",
    propType: "Number",
    canSort: true,
    sortFields: ["price"],
    filter: {
      enabled: true,
      type: "number",
      placeholder: "Filter price...",
    },
  })
  public price!: number;

  @Column({
    order: 5,
    display: "Stock",
    propType: "Number",
    canSort: true,
    filter: {
      enabled: true,
      type: "number",
      placeholder: "Filter stock...",
    },
  })
  public stock!: number;

  @Column({
    order: 6,
    display: "Available",
    propType: "Boolean",
    canSort: true,
    filter: {
      enabled: true,
      type: "boolean",
      placeholder: "Show available only",
    },
  })
  public available!: boolean;

  @Column({
    order: 7,
    display: "Discount",
    propType: "Percent",
    canSort: true,
    emptyLabel: "No discount",
  })
  public discount!: number;

  @Column({
    order: 8,
    display: "Last Updated",
    propType: "Date",
    canSort: true,
    filter: {
      enabled: true,
      type: "date",
      placeholder: "Filter by date...",
    },
  })
  public lastUpdated!: Date;
}
