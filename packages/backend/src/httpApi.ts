import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";

import { configEndpoints } from "./utils/safeEndpoints";
import { readCodeFile, readTemplates } from "./db";

function uuidv4() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Lol, no guessing!
const unlockPassword = uuidv4();

export function initApi() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../../../../frontend/build/")));
  app.use(morgan("combined"));

  configEndpoints(app, {
    "GET /templates": async (req, res) => {
      const templates = await readTemplates();
      res.send({ status: "ok", data: templates });
    },
    "GET /template/:type/code": async (req, res) => {
      const code = await readCodeFile(req.params.type, "codes");

      if (!code) {
        res.status(404).send({ status: "error", error: "no such template" });
      } else {
        res.send({ status: "ok", data: code || "" });
      }
    },
    "POST /template/:type/solution": async (req, res) => {
      const code = await readCodeFile(req.params.type, "solutions");

      if (code && unlockPassword === req.body.password) {
        res.send({ status: "ok", data: code || "" });
      } else {
        res.status(403).send({ status: "error", error: "wrong password" });
      }
    },
  });

  return app;
}
