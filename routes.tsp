import "@typespec/http";
import "./models/common.tsp";
import "./models/owner.tsp";
import "./models/event-type.tsp";
import "./models/booking.tsp";

using TypeSpec.Http;
using Calendar.Domain;
using Calendar.Domain.Common;

@service(#{title: "Calendar API"})
@server("http://localhost:3000", "Development server")
namespace Calendar.API;

model NotFoundResponse {
  code: int32;
  message: string;
}

model ConflictResponse {
  code: int32;
  message: string;
}

model EventTypeCreateInput {
  name: string;
  description?: string;
  @minValue(1)
  @maxValue(120)
  durationMinutes: int32;
}

@example(#{name: "Консультация", description: "Индивидуальная консультация 30 минут", durationMinutes: 30})
model EventTypeCreateInputExample is EventTypeCreateInput;

model EventTypeUpdateInput {
  name?: string;
  description?: string;
  @minValue(1)
  @maxValue(120)
  durationMinutes?: int32;
}

@example(#{name: "Консультация (обновлённая)", durationMinutes: 45})
model EventTypeUpdateInputExample is EventTypeUpdateInput;

model BookingCreateInput {
  eventTypeId: UUID;
  slotStart: DateTime;
  slotEnd: DateTime;
  guestName?: string;
  guestContact?: string;
}

@example(#{
  eventTypeId: "550e8400-e29b-41d4-a716-446655440000",
  slotStart: "2025-06-01T10:00:00Z",
  slotEnd: "2025-06-01T10:30:00Z",
  guestName: "Иван Петров",
  guestContact: "ivan@example.com"
})
model BookingCreateInputExample is BookingCreateInput;

model ErrorResponse {
  code: int32;
  message: string;
}

@example(#{code: 404, message: "Resource not found"})
model ErrorResponseExample is ErrorResponse;

// ─── Public endpoints (guest) ─────────────────────────────────

@route("/api/event-types")
@tag("EventTypes")
interface EventTypes {
  @get list(): EventType[];

  @route("{id}")
  @get read(@path id: UUID): {
    @statusCode ok: 200;
    @body eventType: EventType;
  } | {
    @statusCode notFound: 404;
    @body error: NotFoundResponse;
  };
}

@route("/api/event-types/{eventTypeId}/slots")
@tag("Slots")
interface Slots {
  @get list(
    @path eventTypeId: UUID,
    @query from?: DateTime,
    @query to?: DateTime
  ): Slot[];
}

@route("/api/bookings")
@tag("Bookings")
interface Bookings {
  @post create(@body input: BookingCreateInput): {
    @statusCode ok: 200;
    @body booking: Booking;
  } | {
    @statusCode conflict: 409;
    @body error: ConflictResponse;
  };
  @get list(): Booking[];
}

// ─── Admin endpoints (owner) ──────────────────────────────────

@route("/api/owner")
@tag("Owner")
interface OwnerOps {
  @get get(): Owner;
}

@route("/api/admin/event-types")
@tag("AdminEventTypes")
interface AdminEventTypes {
  @post create(@body input: EventTypeCreateInput): EventType;

  @route("{id}")
  @patch update(
    @path id: UUID,
    @body input: EventTypeUpdateInput
  ): {
    @statusCode ok: 200;
    @body eventType: EventType;
  } | {
    @statusCode notFound: 404;
    @body error: NotFoundResponse;
  };
}