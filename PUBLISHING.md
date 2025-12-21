# Publishing Guide

This guide explains how to publish `@acheddir/mat-datatable` to npm.

## Current Version

**Latest**: v1.0.2 (published to npm)

### Version History

- **v1.0.2** (2025-12-21): Fixed modelClass setter input order dependency
- **v1.0.1** (2025-12-21): Fixed data setter to prioritize modelClass over instance prototype
- **v1.0.0** (2025-12-20): Initial release

## Prerequisites

### 1. npm Account Setup

1. Create an account at [npmjs.com](https://www.npmjs.com/) if you don't have one
2. Verify your email address

### 2. Generate npm Access Token

1. Log in to [npmjs.com](https://www.npmjs.com/)
2. Click on your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select token type:
   - **Automation** (recommended for CI/CD)
   - Give it a descriptive name like "GitHub Actions - mat-datatable"
5. Copy the token immediately (you won't see it again!)

### 3. Add Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/acheddir/mat-datatable
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

## Publishing to npm & GitHub Packages

### Manual Publish via GitHub Actions

1. Go to **Actions** tab in your GitHub repository
2. Select **Publish Package** workflow from the left sidebar
3. Click **Run workflow** button
4. Fill in the options:
   - **Version**: Leave empty to use current version, or specify new version (e.g., `1.0.1`, `1.1.0`)
   - **Tag**: Select the npm dist-tag:
     - `latest` - Production release (default)
     - `beta` - Beta release
     - `next` - Next/canary release
     - `alpha` - Alpha release
5. Click **Run workflow**

The workflow will:

- ✅ Run linting
- ✅ Run all tests
- ✅ Build the library
- ✅ Update version (if specified)
- ✅ Publish to npm with provenance
- ✅ Publish to GitHub Packages
- ✅ Create Git tag (if version specified)
- ✅ Create GitHub Release (if version specified)

### Publish from Local Machine

If you prefer to publish manually from your local machine:

```bash
# Login to npm
npm login

# Build the library
pnpm build:lib

# Navigate to dist folder
cd dist/mat-datatable

# Publish to npm
npm publish --access public

# Or publish with a specific tag
npm publish --access public --tag beta
```

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (x.0.0): Incompatible API changes
- **MINOR** version (0.x.0): New functionality, backward compatible
- **PATCH** version (0.0.x): Bug fixes, backward compatible

### Pre-release Versions

For pre-releases, use tags:

- **Alpha**: `1.0.0-alpha.1` with tag `alpha`
- **Beta**: `1.0.0-beta.1` with tag `beta`
- **RC**: `1.0.0-rc.1` with tag `next`

Example workflow run for beta release:

- Version: `1.1.0-beta.1`
- Tag: `beta`

Users can then install with:

```bash
npm install @acheddir/mat-datatable@beta
```

## Post-Publish Checklist

After publishing:

1. ✅ Verify package on npm: https://www.npmjs.com/package/@acheddir/mat-datatable
2. ✅ Verify package on GitHub Packages: https://github.com/acheddir/mat-datatable/pkgs/npm/mat-datatable
3. ✅ Test installation from npm:
   ```bash
   npm install @acheddir/mat-datatable
   ```
4. ✅ Test installation from GitHub Packages:
   ```bash
   npm install @acheddir/mat-datatable --registry=https://npm.pkg.github.com
   ```
5. ✅ Update CHANGELOG.md with release notes
6. ✅ Announce the release (if needed)

## Troubleshooting

### "You must be logged in to publish packages"

- Ensure `NPM_TOKEN` secret is properly set in GitHub
- Token must have "Automation" or "Publish" permissions

### "Package already exists"

- Version number must be unique
- If you need to republish, increment the version

### "403 Forbidden"

- Check if package name `@acheddir/mat-datatable` is available
- Verify you have permission to publish to `@acheddir` scope
- Ensure package is set to public access

### Version Conflicts

- Always increment version before publishing
- Check current version on npm: https://www.npmjs.com/package/@acheddir/mat-datatable

## Installing from GitHub Packages

To install the package from GitHub Packages, users need to configure their npm client:

### Using .npmrc (Recommended)

Create or edit `.npmrc` in your project root:

```
@acheddir:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install normally:

```bash
npm install @acheddir/mat-datatable
```

### One-time Install

Without configuring `.npmrc`:

```bash
npm install @acheddir/mat-datatable --registry=https://npm.pkg.github.com
```

**Note**: GitHub Packages requires authentication even for public packages. Users need a GitHub Personal Access Token with `read:packages` permission.

## npm Package Scope

The package is published under the `@acheddir` scope. To publish to this scope:

1. The scope must match your npm username OR
2. You must have permission to publish to an organization scope

If `@acheddir` scope doesn't exist, you can either:

- Publish without scope: Change package name to `mat-datatable` (not recommended)
- Create npm organization: Go to npmjs.com → Organizations → Create Organization

## Security Best Practices

1. **Never commit** your npm token to git
2. **Rotate tokens** periodically (every 90-180 days)
3. **Use automation tokens** for CI/CD (not classic tokens)
4. **Enable 2FA** on your npm account
5. **Review permissions** regularly

## Support

For issues with publishing:

- Check [npm documentation](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- Review GitHub Actions logs
- Contact: acheddir@outlook.fr
