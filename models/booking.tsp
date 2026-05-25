namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Booking made by a guest for a specific EventType/Slot window
  @example(#{id: "770e8400-e29b-41d4-a716-446655440002", eventTypeId: "550e8400-e29b-41d4-a716-446655440000", slotStart: "2025-06-01T10:00:00Z", slotEnd: "2025-06-01T10:30:00Z", guestName: "Иван Петров", guestContact: "ivan@example.com", createdAt: "2025-05-20T12:00:00Z"})
  model Booking {
    id: UUID;
    eventTypeId: UUID;
    slotStart: DateTime;
    slotEnd: DateTime;
    guestName?: string;
    guestContact?: string;
    createdAt: DateTime;
  }
}
