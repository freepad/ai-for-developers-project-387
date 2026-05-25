import type {
  EventType,
  Slot,
  Booking,
  Owner,
  BookingCreateInput,
  EventTypeCreateInput,
  EventTypeUpdateInput,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4010";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  // EventTypes (public)
  listEventTypes: () => fetchJson<EventType[]>("/api/event-types"),
  getEventType: (id: string) => fetchJson<EventType>(`/api/event-types/${id}`),

  // Slots (public)
  listSlots: (eventTypeId: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    return fetchJson<Slot[]>(`/api/event-types/${eventTypeId}/slots${query}`);
  },

  // Bookings (public)
  listBookings: () => fetchJson<Booking[]>("/api/bookings"),
  createBooking: (input: BookingCreateInput) =>
    fetchJson<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(input) }),

  // Owner (admin)
  getOwner: () => fetchJson<Owner>("/api/owner"),

  // Admin EventTypes
  createEventType: (input: EventTypeCreateInput) =>
    fetchJson<EventType>("/api/admin/event-types", { method: "POST", body: JSON.stringify(input) }),
  updateEventType: (id: string, input: EventTypeUpdateInput) =>
    fetchJson<EventType>(`/api/admin/event-types/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
};
