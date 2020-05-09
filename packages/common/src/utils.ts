import { Endpoints } from "./interopTypes";

export type ParamsType<K extends keyof Endpoints> = Endpoints[K]["params"];
export type ResType<K extends keyof Endpoints> = Endpoints[K]["res"];
export type ReqType<K extends keyof Endpoints> = Endpoints[K]["req"];

export function withParameters<K extends keyof Endpoints>(
  endpoint: K,
  params: ParamsType<K>
) {
  const url = endpoint.split(" ").slice(1).join(" ");

  return url
    .split("/")
    .map((part) => {
      if (part.startsWith(":")) {
        return params[part.substring(1) as keyof ParamsType<K>];
      } else {
        return part;
      }
    })
    .join("/");
}
