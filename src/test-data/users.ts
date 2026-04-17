import { randomUUID } from 'crypto';

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type LoginCredentials = Pick<UserInput, 'email' | 'password'>;

export const defaultPassword = 'Password123!';

export function buildUser(label = 'user', overrides: Partial<UserInput> = {}): UserInput {
  return {
    firstName: 'QA',
    lastName: 'Automation',
    email: buildUniqueEmail(label),
    password: defaultPassword,
    ...overrides,
  };
}

export function buildUniqueEmail(label = 'user'): string {
  const normalizedLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);
  const suffix = `${Date.now()}-${randomUUID().slice(0, 8)}`;

  return `qa-${normalizedLabel || 'user'}-${suffix}@example.com`;
}
