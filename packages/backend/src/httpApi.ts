import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
  BlockTemplate,
  CVBlockInfo,
  CVIOPortInfo,
} from "@challenge-cvedu/common";
import { configEndpoints } from "./utils/safeEndpoints";
import templates from "./templates";

function maskTemplates(templates: BlockTemplate<CVBlockInfo, CVIOPortInfo>[]) {
  return templates.map(template => ({
    ...template,
    solutionPassword: undefined,
    solution: undefined,
  }));
}

export function initApi() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  configEndpoints(app, {
    "GET /templates": (req, res) => {
      res.send({ status: "ok", data: maskTemplates(templates) });
    },
  });

  return app;
}
