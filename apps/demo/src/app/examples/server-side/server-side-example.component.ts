import { Component, OnInit, inject } from "@angular/core";
import { DatatableComponent, DatatableOptions } from "@acheddir/mat-datatable";
import { MockDataService } from "../../services/mock-data.service";
import { User } from "../../models/user.model";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-server-side-example",
  standalone: true,
  imports: [DatatableComponent],
  template: `
    <div class="example-container">
      <h2 class="text-2xl font-bold mb-4">Server-Side Example</h2>
      <p class="mb-4 text-gray-600">
        Data fetched from mock API on demand. Only current page is loaded (simulated 500ms delay).
      </p>

      <div class="mb-4 text-sm text-gray-500">
        Total Users: {{ totalUsers }} | Current Page: {{ currentPage + 1 }}
      </div>

      <mat-datatable
        [data]="users"
        [options]="datatableOptions"
        [dataLength]="totalUsers"
        [loading]="loading"
        (sort)="onSort($event)"
        (changePage)="onPageChange($event)"
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
export class ServerSideExampleComponent implements OnInit {
  public users: User[] = [];
  public totalUsers = 0;
  public currentPage = 0;
  public pageSize = 10;
  public loading = false;

  public datatableOptions: DatatableOptions = {
    sorting: {
      defaultActive: "id",
      defaultDirection: "asc",
    },
    paging: {
      enabled: true,
      defaultSize: 10,
      sizeOptions: [5, 10, 25],
    },
    serverSide: true,
    showHeader: true,
    showRowNumber: true,
    alternateRowColor: true,
    empty: "No users available",
  };

  private readonly mockDataService = inject(MockDataService);

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.loading = true;
    this.mockDataService
      .getUsersServerSide({
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.users = result.data;
          this.totalUsers = result.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error("Error loading users:", err);
          this.loading = false;
        },
      });
  }

  public onSort(_sort: Sort): void {
    // In real scenario, you would call loadData() with sort params
  }

  public onPageChange(page: PageEvent): void {
    this.currentPage = page.pageIndex;
    this.pageSize = page.pageSize;
    this.loadData();
  }
}
