/**
 * A sequence of textual characters.
 */
export type String = string;
export interface EventType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  ownerId: string;
}
/**
 * A 32-bit integer. (`-2,147,483,648` to `2,147,483,647`)
 */
export type Int32 = number;
/**
 * A 64-bit integer. (`-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`)
 */
export type Int64 = bigint;
/**
 * A whole number. This represent any `integer` value possible.
 * It is commonly represented as `BigInteger` in some languages.
 */
export type Integer = number;
/**
 * A numeric type
 */
export type Numeric = number;
export interface Slot {
  id: string;
  eventTypeId: string;
  startAt: string;
  endAt: string;
  status: "free" | "booked";
}
export interface BookingCreateInput {
  eventTypeId: string;
  slotStart: string;
  slotEnd: string;
  guestName?: string;
  guestContact?: string;
}
export interface Booking {
  id: string;
  eventTypeId: string;
  slotStart: string;
  slotEnd: string;
  guestName?: string;
  guestContact?: string;
  createdAt: string;
}
export interface Owner {
  id: string;
  name: string;
  email?: string;
}
export interface EventTypeCreateInput {
  name: string;
  description?: string;
  durationMinutes: number;
}
export interface EventTypeUpdateInput {
  name?: string;
  description?: string;
  durationMinutes?: number;
}
