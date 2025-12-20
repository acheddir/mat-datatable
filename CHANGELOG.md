# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-20

### Added

#### Core Features
- **DatatableComponent**: Main datatable component with full Material Design integration
- **Dual-Mode Support**: Client-side and server-side data processing modes
- **Column Filtering**: Per-column filters with support for multiple input types
  - Text filters with debouncing (300ms default)
  - Number filters for numeric data
  - Date filters with Material datepicker
  - Boolean filters with checkbox
  - Select filters with dropdown options
  - Custom filter functions for complex scenarios
- **Sorting**: Material sort headers with single and multi-column support
- **Pagination**: Material paginator with configurable page sizes
- **@Column() Decorator**: Type-safe decorator for defining column metadata
  - Automatic propType detection
  - Display name configuration
  - Sort enable/disable
  - Filter configuration
  - Column ordering
  - Column visibility control

#### Components
- **ColumnFilterComponent**: Reusable filter component with automatic type inference
- **Custom Templates**: Support for custom column and action templates
- **Row Click Handling**: Callback function for row click events
- **Loading States**: Built-in loading indicator support

#### Configuration
- **DatatableOptions**: Comprehensive configuration interface
  - Server-side vs client-side mode toggle
  - Header visibility control
  - Row numbering option
  - Alternate row coloring
  - Sorting configuration with defaults
  - Pagination configuration
  - Filtering configuration
- **Type-Safe API**: Full TypeScript support with generics for compile-time safety

#### Utilities
- **deepClone**: Deep cloning utility for immutable data operations
- **sortBy**: Multi-field sorting function (ascending only)
- **orderBy**: Multi-field sorting with direction control (asc/desc)

#### Developer Experience
- **Strict TypeScript**: 100% TypeScript with strict mode enabled
- **ESLint Configuration**: Strict linting rules with Angular best practices
- **Prettier Integration**: Automatic code formatting
- **Comprehensive Tests**: 75+ unit tests with Vitest
  - DatatableComponent: 31 tests
  - ColumnFilterComponent: 26 tests (1 skipped)
  - Utility functions: 19 tests
- **Test Coverage**: 51% overall, 92.7% for ColumnFilterComponent, 86.4% for utilities
- **pnpm Workspace**: Monorepo structure with pnpm 10.x
- **Angular CLI Integration**: Built-in Vitest support via `@angular/build:unit-test`

### Technical Details

#### Supported Data Types
- `String`: Text data with case-insensitive filtering
- `Number`: Numeric data with exact match filtering
- `Date`: Date values with datepicker filtering
- `Boolean`: Boolean values with checkbox filtering
- `Percent`: Percentage values (treated as numbers)
- `Link`: URL/link data
- `html`: HTML content

#### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

#### Requirements
- Angular 21.x
- Angular Material 21.x
- Angular CDK 21.x
- Angular Forms 21.x
- RxJS 7.8+
- TypeScript 5.7+
- Node.js 20.x LTS

### Architecture

- **Decorator-Based Metadata**: Column configuration using TypeScript decorators
- **Immutable Data Operations**: All data operations preserve original data
- **Event-Driven**: Observable-based event system for server-side mode
- **Debounced Inputs**: Optimized filter inputs to reduce API calls
- **Material Design**: Full Angular Material integration for consistent UI

### Package Information

- **Package Name**: `@redsen/mat-datatable`
- **Version**: 1.0.0
- **License**: MIT
- **Bundle Format**: ESM2022
- **Side Effects**: None
- **Tree Shakeable**: Yes

### Documentation

- Comprehensive README with:
  - Installation instructions for Azure Artifacts
  - Quick start guide
  - Complete API reference
  - Usage examples for both client and server modes
  - Custom template examples
  - TypeScript usage patterns
  - Configuration best practices

### Testing

- **Test Framework**: Vitest 4.x with Angular CLI integration
- **Test Files**: 3 test suites
- **Total Tests**: 76 (75 passing, 1 skipped)
- **Coverage Thresholds**: Configured but not enforced (target: 80%)
- **CI Integration**: Ready for GitHub Actions

### Known Limitations

- Client-side filtering for decorated classes requires proper metadata setup
- Date filter compares by day only (ignores time component)
- Boolean false values are treated as "no filter" in filter state
- Template HTML has minimal test coverage due to Angular testing constraints

### Development Tools

- **Build Tool**: ng-packagr via Angular CLI
- **Linter**: ESLint 9.x with flat config
- **Formatter**: Prettier 3.x
- **Package Manager**: pnpm 10.x
- **Monorepo**: pnpm workspaces

### Scripts

- `pnpm build:lib`: Build the library
- `pnpm test`: Run unit tests
- `pnpm test:coverage`: Run tests with coverage report
- `pnpm lint`: Run ESLint
- `pnpm lint:fix`: Auto-fix linting issues
- `pnpm format`: Format code with Prettier
- `pnpm format:check`: Check code formatting
- `pnpm check`: Run linting, formatting, and tests in one command
- `pnpm pack:lib`: Create distributable package

### Future Roadmap

Potential enhancements for future versions:
- Row selection (single/multi)
- Column reordering (drag & drop)
- Column visibility toggle
- Export to CSV/Excel
- Inline editing
- Row expansion (master-detail)
- Virtual scrolling for large datasets
- Saved user preferences
- Global search across all columns
- Advanced filters (date ranges, multi-select)

---

## Release Notes

### v1.0.0 - Initial Release

This is the first production-ready release of `@redsen/mat-datatable`, providing a comprehensive, type-safe Angular 21 Material datatable solution for enterprise applications.

**Highlights:**
- ✅ Dual-mode support (client/server)
- ✅ Full TypeScript support
- ✅ Comprehensive filtering
- ✅ Material Design integration
- ✅ Production-ready quality (75+ tests, strict linting)

**Installation:**
```bash
pnpm add @redsen/mat-datatable
```

**Quick Start:**
See [README.md](./libs/mat-datatable/README.md) for detailed installation and usage instructions.

---

[1.0.0]: https://pkgs.dev.azure.com/YOUR_ORG/_packaging/YOUR_FEED/npm/package/@redsen/mat-datatable/version/1.0.0
