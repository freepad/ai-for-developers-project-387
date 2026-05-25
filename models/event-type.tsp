namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Type of event that can be booked (e.g., Consultation)
  @example(#{id: "550e8400-e29b-41d4-a716-446655440000", name: "Консультация", description: "Индивидуальная консультация", durationMinutes: 30, ownerId: "11111111-1111-1111-1111-111111111111"})
  model EventType {
    id: UUID;
    name: string;
    description?: string;
    @minValue(1)
    @maxValue(120)
    durationMinutes: int32;
    ownerId: UUID;
  }

  /// Available time slot for an EventType
  @example(#{id: "660e8400-e29b-41d4-a716-446655440001", eventTypeId: "550e8400-e29b-41d4-a716-446655440000", startAt: "2025-06-01T10:00:00Z", endAt: "2025-06-01T10:30:00Z", status: "free"})
  model Slot {
    id: UUID;
    eventTypeId: UUID;
    startAt: DateTime;
    endAt: DateTime;
    status: SlotStatus;
  }
}
