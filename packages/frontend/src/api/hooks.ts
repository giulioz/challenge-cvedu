import { useEffect, useState } from "react";

import { Endpoints, ResType, ParamsType } from "@challenge-cvedu/common";
import apiCall from "./apiCall";

export const emptyParams = {};

export function useRemoteData<K extends keyof Endpoints>(
  endpoint: K,
  params: ParamsType<K>
) {
  const [data, setData] = useState<ResType<K> | null>(null);

  useEffect(() => {
    async function loadData() {
      const received = await apiCall(endpoint, {
        params,
        body: null,
      });
      setData(received);
    }

    loadData();
  }, [endpoint, params]);

  return data;
}
