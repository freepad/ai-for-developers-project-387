namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Booking made by a guest for a specific EventType/Slot window
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
