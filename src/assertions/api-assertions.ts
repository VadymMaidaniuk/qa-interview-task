import { expect } from '@playwright/test';

import { resolveTestEnvironment } from '../config/test-environment';

const environment = resolveTestEnvironment();

export function expectApiResponseTime(durationMs: number): void {
  expect(
    durationMs,
    `Expected API response within ${environment.maxApiResponseTimeMs} ms, got ${durationMs} ms`,
  ).toBeLessThanOrEqual(environment.maxApiResponseTimeMs);
}
