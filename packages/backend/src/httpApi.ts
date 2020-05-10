import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

import {
  BlockTemplate,
  CVBlockInfo,
  CVIOPortInfo,
} from "@challenge-cvedu/common";
import { configEndpoints } from "./utils/safeEndpoints";

function maskTemplates(templates: BlockTemplate<CVBlockInfo, CVIOPortInfo>[]) {
  return templates.map(template => ({
    ...template,
    solutionPassword: undefined,
    solution: undefined,
    code: undefined,
  }));
}

async function readTemplates() {
  const files = await fs.promises.readdir(
    path.join(__dirname, "../templates/")
  );
  const paths = files.map(file => path.join(__dirname, "../templates/", file));
  const contents = await Promise.all(
    paths.map(path => fs.promises.readFile(path, "utf-8"))
  );
  const jsons = contents.map(s => JSON.parse(s));

  return jsons;
}

async function readTemplate(name: string) {
  try {
    const p = path.join(__dirname, `../templates/`, name + ".json");
    const content = await fs.promises.readFile(p, "utf-8");
    const json = JSON.parse(content);

    return json;
  } catch (err) {
    return null;
  }
}

async function readCodeFile(name: string, folder: string) {
  try {
    const p = path.join(__dirname, `../${folder}/`, name + ".ts");
    const content = await fs.promises.readFile(p, "utf-8");

    return content;
  } catch (err) {
    return null;
  }
}

export function initApi() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  configEndpoints(app, {
    "GET /templates": async (req, res) => {
      const templates = await readTemplates();
      res.send({ status: "ok", data: maskTemplates(templates) });
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
      const template = await readTemplate(req.params.type);
      const code = await readCodeFile(req.params.type, "codes");

      if (!template) {
        res.status(404).send({ status: "error", error: "no such template" });
      }

      if (template && code && template.solutionPassword === req.body.password) {
        res.send({ status: "ok", data: code || "" });
      } else {
        res.status(403).send({ status: "error", error: "wrong password" });
      }
    },
  });

  return app;
}
