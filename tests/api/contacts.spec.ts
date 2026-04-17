import { expectApiResponseTime } from '../../src/assertions/api-assertions';
import { apiErrorSchema, contactListSchema, contactSchema } from '../../src/api/schemas';
import { expect, test } from '../../src/fixtures/test';
import { buildContact, invalidContactCases } from '../../src/test-data/contacts';

test.describe('API contacts', () => {
  test('gets a resource list and validates the response schema', async ({
    apiClient,
    registeredUser,
  }) => {
    const contact = buildContact('api-list');
    const createResponse = await apiClient.createContact(registeredUser.token, contact);
    expect(createResponse.response.status()).toBe(201);

    const createdContact = contactSchema.parse(createResponse.body);

    const listResponse = await apiClient.getContacts(registeredUser.token);
    expect(listResponse.response.status()).toBe(200);
    expectApiResponseTime(listResponse.durationMs);

    const contacts = contactListSchema.parse(listResponse.body);
    expect(contacts.map((item) => item._id)).toContain(createdContact._id);
  });

  test('creates a resource, verifies it appears, deletes it, and verifies removal', async ({
    apiClient,
    registeredUser,
  }) => {
    const contact = buildContact('api-create');

    const createResponse = await apiClient.createContact(registeredUser.token, contact);
    expect(createResponse.response.status()).toBe(201);
    expectApiResponseTime(createResponse.durationMs);

    const createdContact = contactSchema.parse(createResponse.body);
    expect(createdContact).toMatchObject({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
    });

    const listResponse = await apiClient.getContacts(registeredUser.token);
    expect(listResponse.response.status()).toBe(200);
    expectApiResponseTime(listResponse.durationMs);

    const contacts = contactListSchema.parse(listResponse.body);
    expect(contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: createdContact._id,
          email: contact.email,
        }),
      ]),
    );

    const deleteResponse = await apiClient.deleteContact(registeredUser.token, createdContact._id);
    expect(deleteResponse.response.status()).toBe(200);
    expectApiResponseTime(deleteResponse.durationMs);

    const listAfterDeleteResponse = await apiClient.getContacts(registeredUser.token);
    expect(listAfterDeleteResponse.response.status()).toBe(200);
    expectApiResponseTime(listAfterDeleteResponse.durationMs);

    const contactsAfterDelete = contactListSchema.parse(listAfterDeleteResponse.body);
    expect(contactsAfterDelete.map((item) => item._id)).not.toContain(createdContact._id);
  });

  for (const invalidContactCase of invalidContactCases) {
    test(`rejects invalid contact payload: ${invalidContactCase.name}`, async ({
      apiClient,
      registeredUser,
    }) => {
      const createResponse = await apiClient.createContact(
        registeredUser.token,
        invalidContactCase.contact,
      );

      expect(createResponse.response.status()).toBe(400);
      expectApiResponseTime(createResponse.durationMs);

      const apiError = apiErrorSchema.parse(createResponse.body);
      expect(apiError.message).toMatch(invalidContactCase.expectedMessage);
    });
  }
});
