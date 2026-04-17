import { expectApiResponseTime } from '../../src/assertions/api-assertions';
import { authResponseSchema } from '../../src/api/schemas';
import { expect, test } from '../../src/fixtures/test';
import { buildUniqueEmail, defaultPassword } from '../../src/test-data/users';

test.describe('API authorization', () => {
  test('authorizes a registered user and returns a valid token', async ({
    apiClient,
    registeredUser,
  }) => {
    const loginResponse = await apiClient.login({
      email: registeredUser.user.email,
      password: registeredUser.user.password,
    });

    expect(loginResponse.response.status()).toBe(200);
    expectApiResponseTime(loginResponse.durationMs);

    const auth = authResponseSchema.parse(loginResponse.body);
    expect(auth.user.email).toBe(registeredUser.user.email);
    expect(auth.token).toEqual(expect.any(String));
  });

  test('rejects a registered user with an incorrect password', async ({
    apiClient,
    registeredUser,
  }) => {
    const loginResponse = await apiClient.login({
      email: registeredUser.user.email,
      password: 'WrongPassword123!',
    });

    expect(loginResponse.response.status()).toBe(401);
    expectApiResponseTime(loginResponse.durationMs);
    expect(loginResponse.body).toBeUndefined();
  });

  const invalidLoginCases = [
    {
      name: 'unknown account',
      email: () => buildUniqueEmail('unknown-api-login'),
      password: defaultPassword,
    },
    {
      name: 'malformed email',
      email: () => 'not-an-email',
      password: defaultPassword,
    },
  ];

  for (const invalidLoginCase of invalidLoginCases) {
    test(`rejects invalid authorization for ${invalidLoginCase.name}`, async ({ apiClient }) => {
      const loginResponse = await apiClient.login({
        email: invalidLoginCase.email(),
        password: invalidLoginCase.password,
      });

      expect(loginResponse.response.status()).toBe(401);
      expectApiResponseTime(loginResponse.durationMs);
    });
  }
});
