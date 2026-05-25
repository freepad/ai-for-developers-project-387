import { type AdminEventTypesClientContext, type AdminEventTypesClientOptions, createAdminEventTypesClientContext } from "./api/adminEventTypesClient/adminEventTypesClientContext.js";
import { create as create_2, type CreateOptions as CreateOptions_2, update, type UpdateOptions } from "./api/adminEventTypesClient/adminEventTypesClientOperations.js";
import { type ApiClientContext, type ApiClientOptions, createApiClientContext } from "./api/apiClientContext.js";
import { type BookingsClientContext, type BookingsClientOptions, createBookingsClientContext } from "./api/bookingsClient/bookingsClientContext.js";
import { create, type CreateOptions, list as list_3, type ListOptions as ListOptions_3 } from "./api/bookingsClient/bookingsClientOperations.js";
import { createEventTypesClientContext, type EventTypesClientContext, type EventTypesClientOptions } from "./api/eventTypesClient/eventTypesClientContext.js";
import { list, type ListOptions, read, type ReadOptions } from "./api/eventTypesClient/eventTypesClientOperations.js";
import { createOwnerOpsClientContext, type OwnerOpsClientContext, type OwnerOpsClientOptions } from "./api/ownerOpsClient/ownerOpsClientContext.js";
import { get, type GetOptions } from "./api/ownerOpsClient/ownerOpsClientOperations.js";
import { createSlotsClientContext, type SlotsClientContext, type SlotsClientOptions } from "./api/slotsClient/slotsClientContext.js";
import { list as list_2, type ListOptions as ListOptions_2 } from "./api/slotsClient/slotsClientOperations.js";
import type { BookingCreateInput, EventTypeCreateInput, EventTypeUpdateInput } from "./models/models.js";

export class ApiClient {
  #context: ApiClientContext
  eventTypesClient: EventTypesClient;
  slotsClient: SlotsClient;
  bookingsClient: BookingsClient;
  ownerOpsClient: OwnerOpsClient;
  adminEventTypesClient: AdminEventTypesClient
  constructor(options?: ApiClientOptions) {
    this.#context = createApiClientContext(options);
    this.eventTypesClient = new EventTypesClient(options);;this
      .slotsClient = new SlotsClient(options);;this
      .bookingsClient = new BookingsClient(options);;this
      .ownerOpsClient = new OwnerOpsClient(options);;this
      .adminEventTypesClient = new AdminEventTypesClient(options);
  }
}
export class AdminEventTypesClient {
  #context: AdminEventTypesClientContext
  constructor(options?: AdminEventTypesClientOptions) {
    this.#context = createAdminEventTypesClientContext(options);

  }
  async create(input: EventTypeCreateInput, options?: CreateOptions_2) {
    return create_2(this.#context, input, options);
  };
  async update(
    id: string,
    input: EventTypeUpdateInput,
    options?: UpdateOptions,
  ) {
    return update(this.#context, id, input, options);
  }
}
export class OwnerOpsClient {
  #context: OwnerOpsClientContext
  constructor(options?: OwnerOpsClientOptions) {
    this.#context = createOwnerOpsClientContext(options);

  }
  async get(options?: GetOptions) {
    return get(this.#context, options);
  }
}
export class BookingsClient {
  #context: BookingsClientContext
  constructor(options?: BookingsClientOptions) {
    this.#context = createBookingsClientContext(options);

  }
  async create(input: BookingCreateInput, options?: CreateOptions) {
    return create(this.#context, input, options);
  };
  async list(options?: ListOptions_3) {
    return list_3(this.#context, options);
  }
}
export class SlotsClient {
  #context: SlotsClientContext
  constructor(options?: SlotsClientOptions) {
    this.#context = createSlotsClientContext(options);

  }
  async list(eventTypeId: string, options?: ListOptions_2) {
    return list_2(this.#context, eventTypeId, options);
  }
}
export class EventTypesClient {
  #context: EventTypesClientContext
  constructor(options?: EventTypesClientOptions) {
    this.#context = createEventTypesClientContext(options);

  }
  async list(options?: ListOptions) {
    return list(this.#context, options);
  };
  async read(id: string, options?: ReadOptions) {
    return read(this.#context, id, options);
  }
}
