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
console.log("Unlock password is", unlockPassword);

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
    "GET /codes/:type": async (req, res) => {
      try {
        const code = await readCodeFile(req.params.type, "codes");
        res.send({ status: "ok", data: code });
      } catch (e) {
        res.status(500).send({ status: "error", error: e.toString() });
      }
    },
    "POST /solutions/:type": async (req, res) => {
      try {
        const code = await readCodeFile(req.params.type, "solutions");

        if (unlockPassword === req.body.password) {
          res.send({ status: "ok", data: code });
        } else {
          res.status(403).send({ status: "error", error: "Wrong password" });
        }
      } catch (e) {
        res.status(500).send({ status: "error", error: e.toString() });
      }
    },
  });

  return app;
}
