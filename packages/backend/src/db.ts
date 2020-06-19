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
  // Removes path traversal
  if (name.includes("../")) {
    name = name.replace("../", "");
  }

  const filePath = path.join(__dirname, basePath + `${folder}/`, name + ".ts");

  if (filePath.indexOf(path.join(__dirname, basePath)) !== 0) {
    throw new Error(
      `Cannot read file "${filePath}", outside of app root! Were you trying to perform a path traversal? We got path sanification.`
    );
  }

  try {
    console.log("Reading code file:", filePath);
    const content = await fs.promises.readFile(filePath, "utf-8");

    return content;
  } catch (err) {
    throw new Error(
      `No code found in path "${filePath}". Were you trying to perform a path traversal? We got path sanification.`
    );
  }
}
