import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import type { ColumnConfig, FilterType } from "../models/types";

/**
 * Column filter component
 * Renders different input types based on column configuration
 * Emits debounced filter value changes
 */
@Component({
  selector: "rs-column-filter",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="column-filter">
      @if (filterType === "text") {
        <mat-form-field class="filter-field" subscriptSizing="dynamic">
          <input matInput [formControl]="filterControl" [placeholder]="placeholder" type="text" />
        </mat-form-field>
      }

      @if (filterType === "number") {
        <mat-form-field class="filter-field" subscriptSizing="dynamic">
          <input matInput [formControl]="filterControl" [placeholder]="placeholder" type="number" />
        </mat-form-field>
      }

      @if (filterType === "date") {
        <mat-form-field class="filter-field filter-field-date" subscriptSizing="dynamic">
          <input
            matInput
            [matDatepicker]="datePicker"
            [formControl]="filterControl"
            [placeholder]="placeholder"
            readonly
          />
          @if (filterControl.value) {
            <button
              mat-icon-button
              matIconSuffix
              (click)="filterControl.setValue(null); $event.stopPropagation()"
              type="button"
              class="datepicker-clear-btn"
              aria-label="Clear date"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
          <button
            mat-icon-button
            matIconSuffix
            (click)="datePicker.open()"
            type="button"
            class="datepicker-toggle-btn"
          >
            <mat-icon>calendar_today</mat-icon>
          </button>
          <mat-datepicker #datePicker />
        </mat-form-field>
      }

      @if (filterType === "select" && selectOptions && selectOptions.length > 0) {
        <mat-form-field class="filter-field" subscriptSizing="dynamic">
          <mat-select [formControl]="filterControl" [placeholder]="placeholder">
            <mat-option [value]="null">All</mat-option>
            @for (option of selectOptions; track option.value) {
              <mat-option [value]="option.value">{{ option.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }

      @if (filterType === "boolean") {
        <mat-checkbox [formControl]="filterControl" class="filter-checkbox" />
      }
    </div>
  `,
  styles: [
    `
      .column-filter {
        padding: 2px 4px;
        width: 100%;
        max-width: 100%;
        display: flex;
        align-items: center;
        overflow: visible;
      }

      .filter-field {
        width: 100% !important;
        max-width: 100% !important;
        font-size: 13px !important;
        min-width: 0 !important;
        flex: 1;
        --mat-form-field-container-text-size: 13px;
        --mat-form-field-container-text-line-height: 1.2;
      }

      .filter-field ::ng-deep .mat-mdc-form-field {
        width: 100% !important;
      }

      .filter-field ::ng-deep .mat-mdc-text-field-wrapper {
        padding: 0 !important;
      }

      .filter-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .filter-field ::ng-deep .mat-mdc-form-field-infix {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 32px !important;
        height: 32px !important;
        padding: 0 8px !important;
        display: flex !important;
        align-items: center !important;
      }

      /* Ensure all inputs have consistent font-size and line-height */
      .filter-field ::ng-deep input.mat-mdc-input-element {
        font-size: 13px !important;
        line-height: 1.2 !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .filter-field ::ng-deep .mat-mdc-input-element::placeholder {
        font-size: 13px !important;
        line-height: 1.2 !important;
      }

      /* Fix select width and density to match other inputs */
      .filter-field ::ng-deep .mat-mdc-select {
        width: 100% !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
      }

      .filter-field ::ng-deep .mat-mdc-select-trigger {
        width: 100% !important;
        min-height: 32px !important;
        height: 32px !important;
        font-size: 13px !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 !important;
      }

      .filter-field ::ng-deep .mat-mdc-select-value {
        max-width: 100% !important;
        width: 100% !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .filter-field ::ng-deep .mat-mdc-select-value-text {
        font-size: 13px !important;
        line-height: 1.2 !important;
      }

      .filter-field ::ng-deep .mat-mdc-select-placeholder {
        font-size: 13px !important;
        line-height: 1.2 !important;
      }

      .filter-field ::ng-deep .mat-mdc-select-arrow-wrapper {
        height: 32px !important;
        display: flex !important;
        align-items: center !important;
      }

      .filter-field ::ng-deep .mat-mdc-form-field-focus-overlay {
        background-color: transparent;
      }

      /* Remove icon suffix padding to save space */
      .filter-field ::ng-deep .mat-mdc-form-field-icon-prefix,
      .filter-field ::ng-deep .mat-mdc-form-field-icon-suffix {
        padding: 0 !important;
      }

      .filter-field-date {
        flex: 1;
        min-width: 0;
        max-width: 100%;
      }

      .filter-field-date ::ng-deep .mat-mdc-text-field-wrapper {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .filter-field-date ::ng-deep input {
        padding-right: 32px !important;
        text-overflow: ellipsis;
      }

      .filter-field-date ::ng-deep .datepicker-toggle-btn {
        width: 24px !important;
        height: 24px !important;
        padding: 0 !important;
        margin: 0 !important;
        position: absolute !important;
        right: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }

      .filter-field-date ::ng-deep .datepicker-toggle-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
      }

      .filter-field-date ::ng-deep .datepicker-clear-btn {
        width: 20px !important;
        height: 20px !important;
        padding: 0 !important;
        margin: 0 !important;
        position: absolute !important;
        right: 26px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
      }

      .filter-field-date ::ng-deep .datepicker-clear-btn mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      .filter-field-date ::ng-deep .mat-mdc-form-field-infix {
        padding-left: 8px !important;
        padding-right: 32px !important;
        position: relative;
      }

      .filter-field-date ::ng-deep .mat-mdc-icon-button .mat-mdc-button-touch-target {
        width: 24px !important;
        height: 24px !important;
      }

      .filter-field-date ::ng-deep .mat-mdc-form-field-icon-suffix {
        padding: 0 4px 0 0;
      }

      .filter-checkbox {
        font-size: 13px;
        display: block;
        /* Override the state layer size to remove padding calculations */
        --mat-checkbox-state-layer-size: 18px;
      }

      /* With the variable set to 18px, the padding calc becomes 0 automatically */
      .filter-checkbox ::ng-deep .mdc-checkbox {
        margin: 0 !important;
      }

      .filter-checkbox ::ng-deep .mat-mdc-checkbox {
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .filter-checkbox ::ng-deep .mdc-form-field {
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .filter-checkbox ::ng-deep .mat-internal-form-field {
        padding: 0 !important;
        margin: 0 !important;
      }

      /* Hide label but keep checkbox structure intact */
      .filter-checkbox ::ng-deep .mdc-label {
        display: none !important;
      }
    `,
  ],
})
export class ColumnFilterComponent implements OnInit, OnDestroy {
  @Input() public column!: ColumnConfig;
  @Input() public debounceTime = 300;

  @Output() public filterChange = new EventEmitter<unknown>();

  public filterControl = new FormControl();
  public filterType: FilterType = "text";
  public placeholder = "";
  public selectOptions: readonly { label: string; value: unknown }[] = [];

  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    if (!this.column.filter?.enabled) {
      return;
    }

    // Determine filter type
    this.filterType = this.column.filter.type ?? this.inferFilterType();

    // Set placeholder
    this.placeholder =
      this.column.filter.placeholder ??
      this.column.inputLabel ??
      `Filter ${this.column.display ?? this.column.key}`;

    // Set select options if available
    if (this.filterType === "select" && this.column.filter.options) {
      this.selectOptions = this.column.filter.options;
    }

    // Subscribe to value changes with debouncing
    this.filterControl.valueChanges
      .pipe(
        debounceTime(
          this.filterType === "text" || this.filterType === "number" ? this.debounceTime : 0
        ),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.filterChange.emit(value);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Infer filter type from column propType
   */
  private inferFilterType(): FilterType {
    switch (this.column.propType) {
      case "Number":
      case "Percent":
        return "number";
      case "Date":
        return "date";
      case "Boolean":
        return "boolean";
      case "Link":
      case "html":
      case "String":
      default:
        return "text";
    }
  }
}
