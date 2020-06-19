/*
  All the types that are needed as envelopes for transport, both REST and WebSocket.
  If we type every message that we exchange, we won't need to validate the schema!
  (...hopefully)
*/

import { BlockTemplate } from "./BlockTypes";
import { CVBlockInfo, CVIOPortInfo } from "./CVBlockInfo";

export type ResponseStatus<T = null, E extends string = string> =
  | { status: "error"; error: E }
  | { status: "ok"; data: T };

export interface Endpoints {
  "GET /templates": {
    params: {};
    res: ResponseStatus<BlockTemplate<CVBlockInfo, CVIOPortInfo>[]>;
    req: null;
  };
  "GET /codes/:type": {
    params: { type: string };
    res: ResponseStatus<string>;
    req: {};
  };
  "POST /solutions/:type": {
    params: { type: string };
    res: ResponseStatus<string>;
    req: { password: string };
  };
}
