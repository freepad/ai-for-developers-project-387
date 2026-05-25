namespace Calendar.Domain.Common {

  // Shared scalars and enums

  /// UUID string (e.g. RFC 4122)
  alias UUID = string;

  /// ISO 8601 timestamp
  alias DateTime = string;

  /// Status of a slot
  alias SlotStatus = "free" | "booked";

}
