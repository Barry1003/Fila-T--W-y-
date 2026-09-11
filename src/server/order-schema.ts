import { z } from 'zod';

/**
 * What the checkout sends when someone places an order.
 *
 * Note what is *not* here: prices. The browser sends what was chosen — product,
 * size, quantity — and the server looks up what those cost. A checkout that
 * accepted prices from the client would let anyone buy an agbada for a penny by
 * editing localStorage.
 */

export const SHIPPING_ZONES = ['canada-us', 'uk', 'nigeria', 'rest-of-world'] as const;
export const SHIPPING_SPEEDS = ['standard', 'express'] as const;

export const orderLineSchema = z.object({
  productId: z.string().trim().min(1),
  size: z.string().trim().min(1).max(60),
  // A line is a product in a specific size and colour; the server matches the
  // variant on both before pricing and claiming stock.
  color: z.string().trim().min(1).max(60),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.').max(20, 'That is more than we can ship in one order.'),
});

export const placeOrderSchema = z.object({
  // Contact
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  fullName: z.string().trim().min(2, 'Enter the name for delivery.').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),

  // Where it goes
  line1: z.string().trim().min(3, 'Enter a street address.').max(200),
  line2: z.string().trim().max(200).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'Enter a city.').max(120),
  state: z.string().trim().max(120).optional().or(z.literal('')),
  postal: z.string().trim().min(1, 'Enter a postal or ZIP code.').max(40),
  country: z.string().trim().min(2, 'Choose a country.').max(60),

  // How it gets there
  shippingZone: z.enum(SHIPPING_ZONES),
  shippingSpeed: z.enum(SHIPPING_SPEEDS),

  /** Optional, and verified against the database rather than trusted. */
  promoCode: z.string().trim().max(40).optional().or(z.literal('')),

  notes: z.string().trim().max(2000).optional().or(z.literal('')),

  lines: z.array(orderLineSchema).min(1, 'Your cart is empty.').max(40),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type OrderLineInput = z.infer<typeof orderLineSchema>;
