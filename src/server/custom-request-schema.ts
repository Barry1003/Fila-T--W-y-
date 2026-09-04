import { z } from 'zod';

/**
 * What a customer sends when asking for a bespoke piece.
 *
 * Kept separate from the Prisma model on purpose: this is the shape of the
 * form, and it is validated on the server before anything is written. The
 * console fills in the rest — quote, status, estimated completion.
 */

export const GARMENT_TYPES = [
  'Filà (cap)',
  'Gele',
  'Ipele',
  'Agbada / Kaftan',
  'Senator suit',
  'Aso-ebi set (group order)',
  'Something else',
] as const;

/** Asked for by garment, because a cap and a kaftan need different numbers. */
export const MEASUREMENT_FIELDS: Record<string, string[]> = {
  'Filà (cap)': ['Head circumference'],
  Gele: ['Preferred yards'],
  Ipele: ['Length', 'Width'],
  'Agbada / Kaftan': ['Chest', 'Waist', 'Sleeve', 'Length'],
  'Senator suit': ['Chest', 'Waist', 'Sleeve', 'Trouser length'],
  'Aso-ebi set (group order)': ['Number of people'],
  'Something else': [],
};

export const customRequestSchema = z.object({
  name: z.string().trim().min(2, 'Tell us your name.').max(120),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  location: z.string().trim().max(120).optional().or(z.literal('')),

  garmentType: z.string().trim().min(1, 'Choose what you would like made.').max(120),
  occasion: z.string().trim().max(200).optional().or(z.literal('')),

  /** Kept as a string: an empty date input submits "", which coerces to epoch. */
  neededBy: z.string().trim().max(40).optional().or(z.literal('')),

  fabricPreference: z.string().trim().max(200).optional().or(z.literal('')),
  colorPreference: z.string().trim().max(200).optional().or(z.literal('')),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),

  measurements: z.array(z.object({ label: z.string().max(80), value: z.string().max(80) })).max(12),
});

export type CustomRequestInput = z.infer<typeof customRequestSchema>;
