import type { Page } from '@playwright/test';

import { contactSchema } from '../../src/api/schemas';
import { AddContactPage } from '../../src/pages/add-contact.page';
import { ContactListPage } from '../../src/pages/contact-list.page';
import { LoginPage } from '../../src/pages/login.page';
import { expect, test } from '../../src/fixtures/test';
import { buildContact, invalidContactCases } from '../../src/test-data/contacts';

test.describe('UI contact management', () => {
  test('navigates from contact list to add contact and back', async ({ page, registeredUser }) => {
    const contactListPage = await loginThroughUi(
      page,
      registeredUser.user.email,
      registeredUser.user.password,
    );
    const addContactPage = new AddContactPage(page);

    await contactListPage.openAddContact();
    await expect(addContactPage.heading).toBeVisible();

    await addContactPage.cancel();
    await expect(contactListPage.heading).toBeVisible();
  });

  test('adds a contact through the UI with valid form data', async ({ page, registeredUser }) => {
    const contact = buildContact('ui-create');
    const contactListPage = await loginThroughUi(
      page,
      registeredUser.user.email,
      registeredUser.user.password,
    );
    const addContactPage = new AddContactPage(page);

    await contactListPage.openAddContact();
    await addContactPage.fill(contact);
    await addContactPage.submit();

    await expect(page).toHaveURL(/\/contactList$/);
    await expect(contactListPage.contactRowByEmail(contact.email!)).toContainText(
      `${contact.firstName} ${contact.lastName}`,
    );
  });

  for (const invalidContactCase of invalidContactCases) {
    test(`shows contact form validation for ${invalidContactCase.name}`, async ({
      page,
      registeredUser,
    }) => {
      const contactListPage = await loginThroughUi(
        page,
        registeredUser.user.email,
        registeredUser.user.password,
      );
      const addContactPage = new AddContactPage(page);

      await contactListPage.openAddContact();
      await addContactPage.fill(invalidContactCase.contact);
      await addContactPage.submit();

      await expect(addContactPage.errorMessage).toContainText(invalidContactCase.expectedMessage);
      await expect(page).toHaveURL(/\/addContact$/);
    });
  }

  test('renders a contact created through the API in the UI list', async ({
    apiClient,
    page,
    registeredUser,
  }) => {
    const apiContact = buildContact('api-to-ui');
    const createResponse = await apiClient.createContact(registeredUser.token, apiContact);
    expect(createResponse.response.status()).toBe(201);
    const createdContact = contactSchema.parse(createResponse.body);

    const contactListPage = await loginThroughUi(
      page,
      registeredUser.user.email,
      registeredUser.user.password,
    );

    await expect(contactListPage.contactRowByEmail(createdContact.email!)).toContainText(
      `${createdContact.firstName} ${createdContact.lastName}`,
    );
  });
});

async function loginThroughUi(
  page: Page,
  email: string,
  password: string,
): Promise<ContactListPage> {
  const loginPage = new LoginPage(page);
  const contactListPage = new ContactListPage(page);

  await loginPage.goto();
  await loginPage.login(email, password);
  await expect(contactListPage.heading).toBeVisible();

  return contactListPage;
}
