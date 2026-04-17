import type { Locator, Page } from '@playwright/test';

export class ContactListPage {
  readonly heading: Locator;
  readonly addContactButton: Locator;
  readonly logoutButton: Locator;
  readonly contactsTable: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Contact List' });
    this.addContactButton = page.locator('#add-contact');
    this.logoutButton = page.locator('#logout');
    this.contactsTable = page.locator('#myTable');
  }

  async openAddContact(): Promise<void> {
    await this.addContactButton.click();
  }

  contactRowByEmail(email: string): Locator {
    return this.page.locator('tr.contactTableBodyRow').filter({ hasText: email });
  }

  contactRowByName(fullName: string): Locator {
    return this.page.locator('tr.contactTableBodyRow').filter({ hasText: fullName });
  }
}
