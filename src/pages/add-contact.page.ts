import type { Locator, Page } from '@playwright/test';

import type { ContactInput } from '../test-data/contacts';

export class AddContactPage {
  readonly heading: Locator;
  readonly errorMessage: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly birthdateInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly street1Input: Locator;
  private readonly street2Input: Locator;
  private readonly cityInput: Locator;
  private readonly stateProvinceInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly countryInput: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Add Contact' });
    this.errorMessage = page.locator('#error');
    this.submitButton = page.locator('#submit');
    this.cancelButton = page.locator('#cancel');

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.birthdateInput = page.locator('#birthdate');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phone');
    this.street1Input = page.locator('#street1');
    this.street2Input = page.locator('#street2');
    this.cityInput = page.locator('#city');
    this.stateProvinceInput = page.locator('#stateProvince');
    this.postalCodeInput = page.locator('#postalCode');
    this.countryInput = page.locator('#country');
  }

  async fill(contact: ContactInput): Promise<void> {
    await this.firstNameInput.fill(contact.firstName ?? '');
    await this.lastNameInput.fill(contact.lastName ?? '');
    await this.birthdateInput.fill(contact.birthdate ?? '');
    await this.emailInput.fill(contact.email ?? '');
    await this.phoneInput.fill(contact.phone ?? '');
    await this.street1Input.fill(contact.street1 ?? '');
    await this.street2Input.fill(contact.street2 ?? '');
    await this.cityInput.fill(contact.city ?? '');
    await this.stateProvinceInput.fill(contact.stateProvince ?? '');
    await this.postalCodeInput.fill(contact.postalCode ?? '');
    await this.countryInput.fill(contact.country ?? '');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
