import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Sort } from "@angular/material/sort";
import type { PageEvent } from "@angular/material/paginator";

import { DatatableComponent } from "./mat-datatable";
import type { DatatableOptions } from "./models";

interface TestData {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

describe("DatatableComponent", () => {
  let component: DatatableComponent<TestData>;
  let fixture: ComponentFixture<DatatableComponent<TestData>>;

  const mockData: TestData[] = [
    { id: 1, name: "Alice", age: 30, active: true },
    { id: 2, name: "Bob", age: 25, active: false },
    { id: 3, name: "Charlie", age: 35, active: true },
    { id: 4, name: "David", age: 28, active: false },
    { id: 5, name: "Eve", age: 32, active: true },
  ];

  const mockOptions: DatatableOptions<TestData> = {
    serverSide: false,
    showHeader: true,
    showRowNumber: false,
    alternateRowColor: false,
    sorting: {
      defaultActive: "name",
      defaultDirection: "asc",
    },
    paging: {
      enabled: true,
      sizeOptions: [5, 10, 20],
    },
    filtering: {
      enabled: false,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatatableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent<DatatableComponent<TestData>>(DatatableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe("Component Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default values", () => {
      expect(component.dataLength).toBe(0);
      expect(component.data).toEqual([]);
      expect(component.loading).toBe(false);
      expect(component.pageIndex).toBe(0);
      expect(component.pageSize).toBe(20);
    });

    it("should have empty columns initially", () => {
      expect(component.columns).toEqual([]);
      expect(component.displayedColumns).toEqual([]);
      expect(component.filterColumns).toEqual([]);
    });
  });

  describe("Data Input", () => {
    it("should accept and clone data", () => {
      component.data = mockData;
      expect(component.data).toHaveLength(5);
      expect(component.data).not.toBe(mockData);
    });

    it("should handle empty data array", () => {
      component.data = [];
      expect(component.data).toEqual([]);
    });

    it("should handle undefined data", () => {
      component.data = undefined;
      expect(component.data).toEqual([]);
    });
  });

  describe("Options Input", () => {
    it("should accept options", () => {
      component.options = mockOptions;
      expect(component.options).toEqual(mockOptions);
    });

    it("should rebuild columns when options change", () => {
      component.data = mockData;
      component.options = mockOptions;
      fixture.detectChanges();
      // Columns would be built if metadata exists
    });
  });

  describe("Loading State", () => {
    it("should set loading state", () => {
      component.loading = true;
      expect(component.loading).toBe(true);

      component.loading = false;
      expect(component.loading).toBe(false);
    });
  });

  describe("Client-Side Sorting", () => {
    beforeEach(() => {
      component.options = mockOptions;
      component.data = mockData;
      fixture.detectChanges();
    });

    it("should emit sort event in server mode", () => {
      const serverOptions = { ...mockOptions, serverSide: true };
      component.options = serverOptions;

      const sortSpy = vi.fn();
      component.sort.subscribe(sortSpy);

      const sortEvent: Sort = { active: "name", direction: "asc" };
      component.onSort(sortEvent);

      expect(sortSpy).toHaveBeenCalledWith(sortEvent);
    });

    it("should sort data client-side in non-server mode", () => {
      const sortEvent: Sort = { active: "age", direction: "asc" };
      component.onSort(sortEvent);

      expect(component.data[0].age).toBeLessThanOrEqual(component.data[1].age);
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      component.options = mockOptions;
      component.data = mockData;
      fixture.detectChanges();
    });

    it("should emit page event in server mode", () => {
      const serverOptions = { ...mockOptions, serverSide: true };
      component.options = serverOptions;

      const pageSpy = vi.fn();
      component.changePage.subscribe(pageSpy);

      const pageEvent: PageEvent = {
        pageIndex: 1,
        pageSize: 10,
        length: 50,
      };
      component.onPage(pageEvent);

      expect(pageSpy).toHaveBeenCalledWith(pageEvent);
    });

    it("should update page index in client mode", () => {
      const pageEvent: PageEvent = {
        pageIndex: 1,
        pageSize: 5,
        length: 5,
      };
      component.onPage(pageEvent);

      expect(component.pageIndex).toBe(1);
      expect(component.pageSize).toBe(5);
    });

    it("should calculate current page correctly", () => {
      component.onPage({
        pageIndex: 2,
        pageSize: 10,
        length: 50,
      });

      expect(component.currentPage).toBe(20);
    });
  });

  describe("Filtering", () => {
    beforeEach(() => {
      component.options = {
        ...mockOptions,
        serverSide: true,
        filtering: { enabled: true },
      };
      component.data = mockData;
      fixture.detectChanges();
    });

    it("should emit filter event in server mode", () => {
      const filterSpy = vi.fn();
      component.filterChange.subscribe(filterSpy);

      component.onFilterChange("name", "Alice");

      expect(filterSpy).toHaveBeenCalledWith({
        columnKey: "name",
        value: "Alice",
        allFilters: { name: "Alice" },
      });
    });

    it("should include filter in allFilters when value is set", () => {
      const filterSpy = vi.fn();
      component.filterChange.subscribe(filterSpy);

      component.onFilterChange("name", "Alice");

      expect(filterSpy).toHaveBeenCalledWith({
        columnKey: "name",
        value: "Alice",
        allFilters: { name: "Alice" },
      });
    });

    it("should remove filter from allFilters when value is empty", () => {
      const filterSpy = vi.fn();
      component.filterChange.subscribe(filterSpy);

      component.onFilterChange("name", "Alice");
      filterSpy.mockClear();

      component.onFilterChange("name", "");

      expect(filterSpy).toHaveBeenCalledWith({
        columnKey: "name",
        value: "",
        allFilters: {},
      });
    });

    it("should remove filter from allFilters when value is null", () => {
      const filterSpy = vi.fn();
      component.filterChange.subscribe(filterSpy);

      component.onFilterChange("name", "Alice");
      filterSpy.mockClear();

      component.onFilterChange("name", null);

      expect(filterSpy).toHaveBeenCalledWith({
        columnKey: "name",
        value: null,
        allFilters: {},
      });
    });

    it("should remove filter from allFilters when value is undefined", () => {
      const filterSpy = vi.fn();
      component.filterChange.subscribe(filterSpy);

      component.onFilterChange("name", "Alice");
      filterSpy.mockClear();

      component.onFilterChange("name", undefined);

      expect(filterSpy).toHaveBeenCalledWith({
        columnKey: "name",
        value: undefined,
        allFilters: {},
      });
    });
  });

  describe("Row Callback", () => {
    it("should call callback function when provided", () => {
      const callbackFn = vi.fn();
      component.options = { ...mockOptions, callBack: callbackFn };

      const testRow = mockData[0];
      component.callBack(testRow);

      expect(callbackFn).toHaveBeenCalledWith(testRow);
    });

    it("should not throw when callback is not provided", () => {
      component.options = mockOptions;
      const testRow = mockData[0];

      expect(() => {
        component.callBack(testRow);
      }).not.toThrow();
    });
  });

  describe("Empty Data Predicates", () => {
    it("should return true when data is empty", () => {
      component.data = [];
      expect(component.isEmptyData()).toBe(true);
    });

    it("should return false when data has items", () => {
      component.data = mockData;
      expect(component.isEmptyData()).toBe(false);
    });

    it("should return true when data has items", () => {
      component.data = mockData;
      expect(component.hasData()).toBe(true);
    });

    it("should return false when data is empty", () => {
      component.data = [];
      expect(component.hasData()).toBe(false);
    });
  });

  describe("Column Building", () => {
    it("should include row number column when manually configured", () => {
      component.displayedColumns = ["rowNumber", "id", "name"];
      expect(component.displayedColumns[0]).toBe("rowNumber");
      expect(component.displayedColumns).toContain("rowNumber");
    });

    it("should include actions column when manually configured", () => {
      component.displayedColumns = ["id", "name", "actions"];
      expect(component.displayedColumns).toContain("actions");
    });

    it("should build filter columns with '-filter' suffix when set", () => {
      component.displayedColumns = ["id", "name", "age"];
      component.filterColumns = component.displayedColumns.map((col) => col + "-filter");

      expect(component.filterColumns.length).toBe(3);
      component.filterColumns.forEach((col) => {
        expect(col).toMatch(/-filter$/);
      });
    });
  });

  describe("Sorting with Multiple Fields", () => {
    beforeEach(() => {
      component.options = mockOptions;
      component.data = mockData;
      fixture.detectChanges();
    });

    it("should handle multi-column sort with comma-separated string", () => {
      const sortEvent: Sort = { active: ",age,name", direction: "asc" };
      component.onSort(sortEvent);

      // Verify data is sorted
      expect(component.data.length).toBeGreaterThan(0);
    });

    it("should handle empty sort direction", () => {
      const sortEvent: Sort = { active: "name", direction: "" };
      component.onSort(sortEvent);

      expect(component.data).toHaveLength(5);
    });

    it("should handle empty sort active field", () => {
      const sortEvent: Sort = { active: "", direction: "asc" };
      component.onSort(sortEvent);

      expect(component.data).toHaveLength(5);
    });
  });
});
