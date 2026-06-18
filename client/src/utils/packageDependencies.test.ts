import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Tests that validate the dependency versions declared in package.json
 * match the intentional version bumps introduced in this PR.
 *
 * PR changes:
 *   - @google-cloud/storage: ^7.19.0 → ^7.21.0
 *   - express:               ^4.22.1 → ^4.22.2
 *   - ws:                    ^8.18.0 → ^8.21.0
 *   - @vitest/ui:            ^4.0.17 → ^4.1.9  (devDependency)
 *   - drizzle-kit:           ^0.31.4 → ^0.31.10 (devDependency)
 *   - vite:                  ^7.3.2  → ^7.3.5  (devDependency)
 *   - vitest:                ^4.0.17 → ^4.1.9  (devDependency)
 */

const pkgPath = resolve(__dirname, '../../../package.json');

interface PackageJson {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

function readPackageJson(): PackageJson {
  const raw = readFileSync(pkgPath, 'utf-8');
  return JSON.parse(raw) as PackageJson;
}

describe('package.json – runtime dependency versions (PR bump)', () => {
  it('specifies @google-cloud/storage at ^7.21.0', () => {
    const pkg = readPackageJson();
    expect(pkg.dependencies['@google-cloud/storage']).toBe('^7.21.0');
  });

  it('specifies express at ^4.22.2', () => {
    const pkg = readPackageJson();
    expect(pkg.dependencies['express']).toBe('^4.22.2');
  });

  it('specifies ws at ^8.21.0', () => {
    const pkg = readPackageJson();
    expect(pkg.dependencies['ws']).toBe('^8.21.0');
  });

  it('@google-cloud/storage version is greater than the previous ^7.19.0 floor', () => {
    const pkg = readPackageJson();
    const version = pkg.dependencies['@google-cloud/storage'];
    // Extract numeric minimum, e.g. "^7.21.0" → [7, 21, 0]
    const match = version.replace('^', '').split('.').map(Number);
    const [major, minor] = match;
    expect(major).toBe(7);
    expect(minor).toBeGreaterThanOrEqual(21);
  });

  it('express version is greater than the previous ^4.22.1 floor', () => {
    const pkg = readPackageJson();
    const version = pkg.dependencies['express'];
    const [, , patch] = version.replace('^', '').split('.').map(Number);
    expect(patch).toBeGreaterThanOrEqual(2);
  });

  it('ws version is greater than the previous ^8.18.0 floor', () => {
    const pkg = readPackageJson();
    const version = pkg.dependencies['ws'];
    const [, minor] = version.replace('^', '').split('.').map(Number);
    expect(minor).toBeGreaterThanOrEqual(21);
  });

  it('retains express-rate-limit in dependencies', () => {
    const pkg = readPackageJson();
    expect(pkg.dependencies['express-rate-limit']).toBeDefined();
  });
});

describe('package.json – devDependency versions (PR bump)', () => {
  it('specifies @vitest/ui at ^4.1.9', () => {
    const pkg = readPackageJson();
    expect(pkg.devDependencies['@vitest/ui']).toBe('^4.1.9');
  });

  it('specifies drizzle-kit at ^0.31.10', () => {
    const pkg = readPackageJson();
    expect(pkg.devDependencies['drizzle-kit']).toBe('^0.31.10');
  });

  it('specifies vite at ^7.3.5', () => {
    const pkg = readPackageJson();
    expect(pkg.devDependencies['vite']).toBe('^7.3.5');
  });

  it('specifies vitest at ^4.1.9', () => {
    const pkg = readPackageJson();
    expect(pkg.devDependencies['vitest']).toBe('^4.1.9');
  });

  it('@vitest/ui and vitest versions are in sync', () => {
    const pkg = readPackageJson();
    // Both should share the same semver constraint after the bump
    expect(pkg.devDependencies['@vitest/ui']).toBe(pkg.devDependencies['vitest']);
  });

  it('drizzle-kit minor version is greater than the previous 0.31.4 floor', () => {
    const pkg = readPackageJson();
    const version = pkg.devDependencies['drizzle-kit'];
    const [, , patch] = version.replace('^', '').split('.').map(Number);
    expect(patch).toBeGreaterThanOrEqual(10);
  });

  it('vite patch version is greater than the previous 7.3.2 floor', () => {
    const pkg = readPackageJson();
    const version = pkg.devDependencies['vite'];
    const [, , patch] = version.replace('^', '').split('.').map(Number);
    expect(patch).toBeGreaterThanOrEqual(5);
  });
});

describe('package.json – structural sanity', () => {
  it('has a name field', () => {
    const pkg = readPackageJson();
    expect(typeof pkg.name).toBe('string');
    expect(pkg.name.length).toBeGreaterThan(0);
  });

  it('has a dependencies object', () => {
    const pkg = readPackageJson();
    expect(pkg.dependencies).toBeDefined();
    expect(typeof pkg.dependencies).toBe('object');
  });

  it('has a devDependencies object', () => {
    const pkg = readPackageJson();
    expect(pkg.devDependencies).toBeDefined();
    expect(typeof pkg.devDependencies).toBe('object');
  });

  it('all bumped runtime deps use caret (^) semver ranges', () => {
    const pkg = readPackageJson();
    const bumpedDeps = ['@google-cloud/storage', 'express', 'ws'];
    for (const dep of bumpedDeps) {
      expect(pkg.dependencies[dep]).toMatch(/^\^/);
    }
  });

  it('all bumped devDeps use caret (^) semver ranges', () => {
    const pkg = readPackageJson();
    const bumpedDevDeps = ['@vitest/ui', 'drizzle-kit', 'vite', 'vitest'];
    for (const dep of bumpedDevDeps) {
      expect(pkg.devDependencies[dep]).toMatch(/^\^/);
    }
  });

  it('does not include uuid as a direct dependency (removed from @google-cloud/storage transitive deps)', () => {
    const pkg = readPackageJson();
    // uuid was a transitive dep of the old @google-cloud/storage; it should not
    // appear as a *direct* dependency of this project
    expect(pkg.dependencies['uuid']).toBeUndefined();
  });

  it('bumped runtime deps are parseable semver strings', () => {
    const pkg = readPackageJson();
    const semverPattern = /^\^?\d+\.\d+\.\d+$/;
    const bumpedDeps = ['@google-cloud/storage', 'express', 'ws'];
    for (const dep of bumpedDeps) {
      expect(pkg.dependencies[dep]).toMatch(semverPattern);
    }
  });

  it('bumped devDeps are parseable semver strings', () => {
    const pkg = readPackageJson();
    const semverPattern = /^\^?\d+\.\d+\.\d+$/;
    const bumpedDevDeps = ['@vitest/ui', 'drizzle-kit', 'vite', 'vitest'];
    for (const dep of bumpedDevDeps) {
      expect(pkg.devDependencies[dep]).toMatch(semverPattern);
    }
  });
});
