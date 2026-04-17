import type { APIRequestContext, APIResponse } from '@playwright/test';

import type { ApiError, AuthResponse, Contact, ContactList } from './schemas';
import type { ContactInput } from '../test-data/contacts';
import type { LoginCredentials, UserInput } from '../test-data/users';

export interface TimedApiResponse<TBody> {
  response: APIResponse;
  body: TBody;
  durationMs: number;
}

type JsonBody = Record<string, unknown> | unknown[] | string | number | boolean | null | undefined;

export class ContactListApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiBaseUrl: string,
  ) {}

  async register(user: UserInput): Promise<TimedApiResponse<AuthResponse>> {
    return this.timedRequest(() => this.request.post(this.url('/users'), { data: user }));
  }

  async login(credentials: LoginCredentials): Promise<TimedApiResponse<AuthResponse | undefined>> {
    return this.timedRequest(() =>
      this.request.post(this.url('/users/login'), { data: credentials }),
    );
  }

  async getContacts(token: string): Promise<TimedApiResponse<ContactList>> {
    return this.timedRequest(() =>
      this.request.get(this.url('/contacts'), {
        headers: this.authorizationHeader(token),
      }),
    );
  }

  async createContact(
    token: string,
    contact: ContactInput,
  ): Promise<TimedApiResponse<Contact | ApiError>> {
    return this.timedRequest(() =>
      this.request.post(this.url('/contacts'), {
        data: contact,
        headers: this.authorizationHeader(token),
      }),
    );
  }

  async deleteContact(
    token: string,
    contactId: string,
  ): Promise<TimedApiResponse<string | undefined>> {
    return this.timedRequest(() =>
      this.request.delete(this.url(`/contacts/${contactId}`), {
        headers: this.authorizationHeader(token),
      }),
    );
  }

  async deleteCurrentUser(token: string): Promise<TimedApiResponse<undefined>> {
    return this.timedRequest(() =>
      this.request.delete(this.url('/users/me'), {
        headers: this.authorizationHeader(token),
      }),
    );
  }

  private authorizationHeader(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private url(path: string): string {
    return new URL(path, `${this.apiBaseUrl}/`).toString();
  }

  private async timedRequest<TBody>(
    operation: () => Promise<APIResponse>,
  ): Promise<TimedApiResponse<TBody>> {
    const startedAt = Date.now();
    const response = await operation();
    const durationMs = Date.now() - startedAt;
    const body = await this.parseBody<TBody>(response);

    return {
      response,
      body,
      durationMs,
    };
  }

  private async parseBody<TBody>(response: APIResponse): Promise<TBody> {
    const text = await response.text();

    if (!text) {
      return undefined as TBody;
    }

    const contentType = response.headers()['content-type'] ?? '';

    if (!contentType.includes('application/json')) {
      return text as TBody;
    }

    return JSON.parse(text) as JsonBody as TBody;
  }
}
