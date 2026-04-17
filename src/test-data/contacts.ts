import { randomUUID } from 'crypto';

export interface ContactInput {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export function buildContact(
  label = 'contact',
  overrides: Partial<ContactInput> = {},
): ContactInput {
  const suffix = randomUUID().slice(0, 8);
  const normalizedLabel = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20);

  return {
    firstName: 'Ada',
    lastName: `Lovelace ${suffix}`,
    birthdate: '1815-12-10',
    email: `${normalizedLabel || 'contact'}-${suffix}@example.com`,
    phone: '8005551212',
    street1: '1 Algorithm Way',
    city: 'London',
    stateProvince: 'London',
    postalCode: 'N1',
    country: 'United Kingdom',
    ...overrides,
  };
}

export const invalidContactCases = [
  {
    name: 'missing required names',
    contact: {},
    expectedMessage: /Contact validation failed/,
  },
  {
    name: 'malformed email',
    contact: {
      firstName: 'Bad',
      lastName: 'Email',
      email: 'not-an-email',
    },
    expectedMessage: /Email is invalid/,
  },
] as const;
