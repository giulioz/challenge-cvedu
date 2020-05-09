import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { configEndpoints } from "./utils/safeEndpoints";

export function initApi() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  configEndpoints(app, {
    "GET /test": (req, res) => {
      res.send({ status: "ok", data: "Hello World!" });
    },
  });

  return app;
}
