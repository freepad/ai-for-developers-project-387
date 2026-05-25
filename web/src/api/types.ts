// Generated types from TypeSpec models

export interface EventType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  ownerId: string;
}

export interface Slot {
  id: string;
  eventTypeId: string;
  startAt: string;
  endAt: string;
  status: "free" | "booked";
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

export interface BookingCreateInput {
  eventTypeId: string;
  slotStart: string;
  slotEnd: string;
  guestName?: string;
  guestContact?: string;
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
