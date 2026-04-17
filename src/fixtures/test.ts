import { expect, test as base } from '@playwright/test';

import { ContactListApiClient } from '../api/contact-list-api';
import { authResponseSchema } from '../api/schemas';
import { resolveTestEnvironment } from '../config/test-environment';
import { buildUser, type UserInput } from '../test-data/users';

interface RegisteredUser {
  id: string;
  token: string;
  user: UserInput;
}

interface TestFixtures {
  apiClient: ContactListApiClient;
  registeredUser: RegisteredUser;
}

const environment = resolveTestEnvironment();

export const test = base.extend<TestFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ContactListApiClient(request, environment.apiBaseUrl));
  },

  registeredUser: async ({ apiClient }, use, testInfo) => {
    const user = buildUser(testInfo.title);
    const registerResponse = await apiClient.register(user);
    expect(registerResponse.response.status()).toBe(201);

    const auth = authResponseSchema.parse(registerResponse.body);

    let testError: unknown;
    let cleanupError: Error | undefined;

    try {
      await use({
        id: auth.user._id,
        token: auth.token,
        user,
      });
    } catch (error) {
      testError = error;
    } finally {
      const cleanupResponse = await apiClient.deleteCurrentUser(auth.token);
      const cleanupStatus = cleanupResponse.response.status();

      if (![200, 401, 404].includes(cleanupStatus)) {
        cleanupError = new Error(
          `Failed to clean up test user ${user.email}. Status: ${cleanupStatus}`,
        );
      }
    }

    if (testError) {
      throw testError;
    }

    if (cleanupError) {
      throw cleanupError;
    }
  },
});

export { expect };
