import { Column } from "@acheddir/mat-datatable";

export class User {
  @Column({
    order: 1,
    display: "ID",
    canSort: true,
  })
  public id!: number;

  @Column({
    order: 2,
    display: "Full Name",
    canSort: true,
  })
  public name!: string;

  @Column({
    order: 3,
    display: "Email",
    canSort: true,
  })
  public email!: string;

  @Column({
    order: 4,
    display: "Role",
    canSort: true,
  })
  public role!: string;

  @Column({
    order: 5,
    display: "Status",
    canSort: true,
  })
  public status!: string;

  @Column({
    order: 6,
    display: "Join Date",
    propType: "Date",
    canSort: true,
  })
  public joinDate!: Date;
}
