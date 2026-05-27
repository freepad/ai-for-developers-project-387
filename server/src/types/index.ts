import type { components, paths } from "./api.js";

export type {
  components as ApiComponents,
  paths as ApiPaths,
};

export type UUID = string;
export type DateTime = string;
export type SlotStatus = "free" | "booked";

export type Owner = components["schemas"]["Calendar.Domain.Owner"];
export type EventType = components["schemas"]["Calendar.Domain.EventType"];
export type Slot = components["schemas"]["Calendar.Domain.Slot"];
export type Booking = components["schemas"]["Calendar.Domain.Booking"];

export type EventTypeCreateInput = components["schemas"]["EventTypeCreateInput"];
export type EventTypeUpdateInput = components["schemas"]["EventTypeUpdateInput"];
export type BookingCreateInput = components["schemas"]["BookingCreateInput"];

export type ErrorResponse = components["schemas"]["ErrorResponse"];