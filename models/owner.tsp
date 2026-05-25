namespace Calendar.Domain {

  using Calendar.Domain.Common;

  /// Calendar owner (resource owner / host)
  @example(#{id: "11111111-1111-1111-1111-111111111111", name: "Алексей Смирнов", email: "alexey@example.com"})
  model Owner {
    /// Unique identifier
    id: UUID;

    /// Owner name
    name: string;

    /// Contact email (optional)
    email?: string;
  }
}
