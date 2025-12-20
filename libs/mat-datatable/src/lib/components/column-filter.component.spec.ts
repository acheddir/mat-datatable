import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { ColumnFilterComponent } from "./column-filter.component";
import type { ColumnConfig } from "../models";

describe("ColumnFilterComponent", () => {
  let component: ColumnFilterComponent;
  let fixture: ComponentFixture<ColumnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnFilterComponent);
    component = fixture.componentInstance;
  });

  describe("Component Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default debounce time", () => {
      expect(component.debounceTime).toBe(300);
    });

    it("should initialize with text filter type by default", () => {
      expect(component.filterType).toBe("text");
    });

    it("should have empty select options by default", () => {
      expect(component.selectOptions).toEqual([]);
    });
  });

  describe("Filter Type Detection", () => {
    it("should detect text filter for String propType", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("text");
    });

    it("should detect number filter for Number propType", () => {
      const column: ColumnConfig = {
        key: "age",
        display: "Age",
        propType: "Number",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("number");
    });

    it("should detect date filter for Date propType", () => {
      const column: ColumnConfig = {
        key: "birthDate",
        display: "Birth Date",
        propType: "Date",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("date");
    });

    it("should detect boolean filter for Boolean propType", () => {
      const column: ColumnConfig = {
        key: "active",
        display: "Active",
        propType: "Boolean",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("boolean");
    });

    it("should use select filter when explicitly specified with options", () => {
      const column: ColumnConfig = {
        key: "status",
        display: "Status",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: {
          enabled: true,
          type: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
        },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("select");
      expect(component.selectOptions).toHaveLength(2);
    });

    it("should use custom filter type when specified", () => {
      const column: ColumnConfig = {
        key: "custom",
        display: "Custom",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: {
          enabled: true,
          type: "number",
        },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("number");
    });
  });

  describe("Placeholder Generation", () => {
    it("should use custom placeholder when provided", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: {
          enabled: true,
          placeholder: "Search by name",
        },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.placeholder).toBe("Search by name");
    });

    it("should use inputLabel when placeholder not provided", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        inputLabel: "Enter name",
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.placeholder).toBe("Enter name");
    });

    it("should generate placeholder from display name", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Full Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.placeholder).toBe("Filter Full Name");
    });

    it("should generate placeholder from key when display not provided", () => {
      const column: ColumnConfig = {
        key: "username",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.placeholder).toBe("Filter username");
    });
  });

  describe("Filter Value Changes", () => {
    beforeEach(() => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.debounceTime = 0;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it("should emit filter change when value changes", () =>
      new Promise<void>((done) => {
        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        component.filterControl.setValue("test");

        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith("test");
          done();
        }, 50);
      }));

    it.skip("should debounce filter changes", async () => {
      // Create fresh component for this test to avoid interference
      const freshFixture = TestBed.createComponent(ColumnFilterComponent);
      const freshComponent = freshFixture.componentInstance;

      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      freshComponent.column = column;
      freshComponent.debounceTime = 100;

      const filterSpy = vi.fn();
      freshComponent.filterChange.subscribe(filterSpy);

      freshComponent.ngOnInit();
      await freshFixture.whenStable();

      freshComponent.filterControl.setValue("a");
      freshComponent.filterControl.setValue("ab");
      freshComponent.filterControl.setValue("abc");

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledTimes(1);
          expect(filterSpy).toHaveBeenCalledWith("abc");
          freshComponent.ngOnDestroy();
          resolve();
        }, 150);
      });
    });

    it("should emit empty string for empty value", () =>
      new Promise<void>((done) => {
        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        component.filterControl.setValue("");

        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith("");
          done();
        }, 50);
      }));
  });

  describe("Component Cleanup", () => {
    it("should not emit filter changes after destroy", () =>
      new Promise<void>((done) => {
        const column: ColumnConfig = {
          key: "name",
          display: "Name",
          propType: "String",
          order: 1,
          canSort: false,
          hide: false,
          filter: { enabled: true },
        };
        component.column = column;
        component.debounceTime = 0;
        component.ngOnInit();

        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        component.filterControl.setValue("before");

        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith("before");
          filterSpy.mockClear();

          component.ngOnDestroy();
          component.filterControl.setValue("after");

          setTimeout(() => {
            expect(filterSpy).not.toHaveBeenCalled();
            done();
          }, 50);
        }, 50);
      }));
  });

  describe("Disabled Filters", () => {
    it("should not initialize when filter is not enabled", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: false },
      };
      component.column = column;
      component.ngOnInit();

      // filterType should remain at default "text"
      expect(component.filterType).toBe("text");
      expect(component.placeholder).toBe("");
    });

    it("should not initialize when filter is undefined", () => {
      const column: ColumnConfig = {
        key: "name",
        display: "Name",
        propType: "String",
        order: 1,
        canSort: false,
        hide: false,
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("text");
      expect(component.placeholder).toBe("");
    });
  });

  describe("Debounce Behavior", () => {
    it("should not debounce select filter changes", () =>
      new Promise<void>((done) => {
        const column: ColumnConfig = {
          key: "status",
          display: "Status",
          propType: "String",
          order: 1,
          canSort: false,
          hide: false,
          filter: {
            enabled: true,
            type: "select",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        };
        component.column = column;
        component.debounceTime = 300;
        component.ngOnInit();
        fixture.detectChanges();

        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        component.filterControl.setValue("active");

        // Select should emit immediately (0ms debounce)
        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith("active");
          done();
        }, 50);
      }));

    it("should not debounce date filter changes", () =>
      new Promise<void>((done) => {
        const column: ColumnConfig = {
          key: "birthDate",
          display: "Birth Date",
          propType: "Date",
          order: 1,
          canSort: false,
          hide: false,
          filter: { enabled: true },
        };
        component.column = column;
        component.debounceTime = 300;
        component.ngOnInit();
        fixture.detectChanges();

        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        const testDate = new Date("2025-01-01");
        component.filterControl.setValue(testDate);

        // Date should emit immediately (0ms debounce)
        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith(testDate);
          done();
        }, 50);
      }));

    it("should not debounce boolean filter changes", () =>
      new Promise<void>((done) => {
        const column: ColumnConfig = {
          key: "active",
          display: "Active",
          propType: "Boolean",
          order: 1,
          canSort: false,
          hide: false,
          filter: { enabled: true },
        };
        component.column = column;
        component.debounceTime = 300;
        component.ngOnInit();
        fixture.detectChanges();

        const filterSpy = vi.fn();
        component.filterChange.subscribe(filterSpy);

        component.filterControl.setValue(true);

        // Boolean should emit immediately (0ms debounce)
        setTimeout(() => {
          expect(filterSpy).toHaveBeenCalledWith(true);
          done();
        }, 50);
      }));
  });

  describe("Filter Type Inference", () => {
    it("should infer text filter for Link propType", () => {
      const column: ColumnConfig = {
        key: "website",
        display: "Website",
        propType: "Link",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("text");
    });

    it("should infer text filter for html propType", () => {
      const column: ColumnConfig = {
        key: "description",
        display: "Description",
        propType: "html",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("text");
    });

    it("should infer number filter for Percent propType", () => {
      const column: ColumnConfig = {
        key: "completion",
        display: "Completion",
        propType: "Percent",
        order: 1,
        canSort: false,
        hide: false,
        filter: { enabled: true },
      };
      component.column = column;
      component.ngOnInit();

      expect(component.filterType).toBe("number");
    });
  });
});
