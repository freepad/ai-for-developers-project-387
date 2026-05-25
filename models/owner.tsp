namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Calendar owner (resource owner / host)
  model Owner {
    /// Unique identifier
    id: UUID;

    /// Owner name
    name: string;

    /// Contact email (optional)
    email?: string;
  }
}
