import { config as loadDotEnv } from 'dotenv';

loadDotEnv({ quiet: true });

export type TestEnvironmentName = 'dev' | 'staging' | 'prod';

export interface TestEnvironment {
  name: TestEnvironmentName;
  baseUrl: string;
  apiBaseUrl: string;
  maxApiResponseTimeMs: number;
}

const defaultBaseUrl = 'https://thinking-tester-contact-list.herokuapp.com';
const environmentNames: TestEnvironmentName[] = ['dev', 'staging', 'prod'];

function readUrl(primaryKey: string, fallbackKey: string): string {
  return trimTrailingSlash(process.env[primaryKey] ?? process.env[fallbackKey] ?? defaultBaseUrl);
}

function readNumber(key: string, fallback: number): number {
  const rawValue = process.env[key];

  if (!rawValue) {
    return fallback;
  }

  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive number. Received: ${rawValue}`);
  }

  return parsed;
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function assertKnownEnvironment(value: string): asserts value is TestEnvironmentName {
  if (!environmentNames.includes(value as TestEnvironmentName)) {
    throw new Error(
      `Unsupported TEST_ENV "${value}". Expected one of: ${environmentNames.join(', ')}.`,
    );
  }
}

export function resolveTestEnvironment(): TestEnvironment {
  const selectedEnvironment = process.env.TEST_ENV ?? 'dev';
  assertKnownEnvironment(selectedEnvironment);

  const upperName = selectedEnvironment.toUpperCase();

  return {
    name: selectedEnvironment,
    baseUrl: readUrl(`${upperName}_BASE_URL`, 'BASE_URL'),
    apiBaseUrl: readUrl(`${upperName}_API_BASE_URL`, 'API_BASE_URL'),
    maxApiResponseTimeMs: readNumber('MAX_API_RESPONSE_TIME_MS', 10_000),
  };
}
