import { LoginPage } from '../../src/pages/login.page';
import { expect, test } from '../../src/fixtures/test';
import { buildUniqueEmail, defaultPassword } from '../../src/test-data/users';

test.describe('UI authorization', () => {
  test('logs in with a registered user', async ({ page, registeredUser }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(registeredUser.user.email, registeredUser.user.password);

    await expect(page).toHaveURL(/\/contactList$/);
    await expect(page.getByRole('heading', { name: 'Contact List' })).toBeVisible();
  });

  test('shows an error when a registered user enters the wrong password', async ({
    page,
    registeredUser,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(registeredUser.user.email, 'WrongPassword123!');

    await expect(loginPage.errorMessage).toHaveText('Incorrect username or password');
    await expect(page).not.toHaveURL(/\/contactList$/);
  });

  const invalidLoginCases = [
    {
      name: 'unknown account',
      email: () => buildUniqueEmail('unknown-ui-login'),
      password: defaultPassword,
    },
    {
      name: 'malformed email',
      email: () => 'not-an-email',
      password: defaultPassword,
    },
  ];

  for (const invalidLoginCase of invalidLoginCases) {
    test(`shows an error for unsuccessful login: ${invalidLoginCase.name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.login(invalidLoginCase.email(), invalidLoginCase.password);

      await expect(loginPage.errorMessage).toHaveText('Incorrect username or password');
      await expect(page).not.toHaveURL(/\/contactList$/);
    });
  }
});
