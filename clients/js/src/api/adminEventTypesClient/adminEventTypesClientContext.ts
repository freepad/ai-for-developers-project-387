import { type Client, type ClientOptions, getClient } from "@typespec/ts-http-runtime";

export interface AdminEventTypesClientContext extends Client {

}export interface AdminEventTypesClientOptions extends ClientOptions {
  endpoint?: string;
}export function createAdminEventTypesClientContext(
  options?: AdminEventTypesClientOptions,
): AdminEventTypesClientContext {
  const params: Record<string, any> = {
    endpoint: options?.endpoint ?? "http://localhost:3000"
  };
  const resolvedEndpoint = "{endpoint}".replace(/{([^}]+)}/g, (_, key) =>
    key in params ? String(params[key]) : (() => { throw new Error(`Missing parameter: ${key}`); })()
  );;return getClient(resolvedEndpoint,{
    ...options
  })
}
