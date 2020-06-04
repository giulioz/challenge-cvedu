import fs from "fs";
import path from "path";

const basePath = process.env.NODE_ENV === "production" ? "../../../" : "../";

export async function readTemplates() {
  const fileNames = await fs.promises.readdir(
    path.join(__dirname, basePath + "templates/")
  );
  const filePaths = fileNames.map(file =>
    path.join(__dirname, basePath + "templates/", file)
  );
  const fileContents = await Promise.all(
    filePaths.map(path => fs.promises.readFile(path, "utf-8"))
  );
  const jsons = fileContents.map(s => JSON.parse(s));

  return jsons;
}

export async function readCodeFile(name: string, folder: string) {
  try {
    const p = path.join(__dirname, basePath + `${folder}/`, name + ".ts");
    console.log("Reading code file:", p);
    const content = await fs.promises.readFile(p, "utf-8");

    return content;
  } catch (err) {
    return null;
  }
}
