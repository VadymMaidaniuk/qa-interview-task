import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Expected a 24-character MongoDB ObjectId');

const jwtSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Expected a JWT token');

export const userSchema = z
  .object({
    _id: objectIdSchema,
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    __v: z.number().optional(),
  })
  .passthrough();

export const authResponseSchema = z.object({
  user: userSchema,
  token: jwtSchema,
});

export const contactSchema = z
  .object({
    _id: objectIdSchema,
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthdate: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    stateProvince: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    owner: objectIdSchema.optional(),
    __v: z.number().optional(),
  })
  .passthrough();

export const contactListSchema = z.array(contactSchema);

export const apiErrorSchema = z
  .object({
    message: z.string().optional(),
    _message: z.string().optional(),
    errors: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export type AuthResponse = z.infer<typeof authResponseSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type ContactList = z.infer<typeof contactListSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
