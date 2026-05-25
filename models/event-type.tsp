namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Type of event that can be booked (e.g., Consultation)
  model EventType {
    id: UUID;
    name: string;
    description?: string;
    durationMinutes: int32;
    ownerId: UUID;
  }

  /// Available time slot for an EventType
  model Slot {
    id: UUID;
    eventTypeId: UUID;
    startAt: DateTime;
    endAt: DateTime;
    status: SlotStatus;
  }
}
