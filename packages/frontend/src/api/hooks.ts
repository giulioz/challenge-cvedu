import { useEffect, useState } from "react";
import { useAutoMemo } from "hooks.macro";

import {
  Endpoints,
  ResType,
  ParamsType,
  BlockTemplate,
  CVBlockInfo,
  CVIOPortInfo,
  IOPortTemplate,
} from "@challenge-cvedu/common";
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

export function useTemplates(
  templatesInitial: BlockTemplate<
    CVBlockInfo,
    CVIOPortInfo,
    IOPortTemplate<CVIOPortInfo>
  >[]
) {
  const [templates, setTemplates] = useState<
    BlockTemplate<CVBlockInfo, CVIOPortInfo, IOPortTemplate<CVIOPortInfo>>[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const receivedTemplates = await apiCall("GET /templates", {
        params: {},
        body: null,
      });
      if (receivedTemplates.status === "error") {
        return;
      }

      const codes = await Promise.all(
        receivedTemplates.data
          .map(template => template.type)
          .map(type =>
            apiCall("GET /template/:type/code", {
              params: { type },
              body: null,
            })
          )
      );

      setTemplates(
        receivedTemplates.data.map((r, i) => {
          const res = codes[i];
          return res.status === "ok"
            ? {
                ...r,
                code: res.data,
              }
            : r;
        })
      );
    }

    loadData();
  }, []);

  return useAutoMemo([...templatesInitial, ...templates]);
}
