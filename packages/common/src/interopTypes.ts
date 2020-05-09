/*
  All the types that are needed as envelopes for transport, both REST and WebSocket.
  If we type every message that we exchange, we won't need to validate the schema!
  (...hopefully)
*/

export type ResponseStatus<T = null, E extends string = string> =
  | { status: "error"; error: E }
  | { status: "ok"; data: T };

export interface Endpoints {
  "GET /test": {
    params: {};
    res: ResponseStatus<string>;
    req: null;
  };
}
