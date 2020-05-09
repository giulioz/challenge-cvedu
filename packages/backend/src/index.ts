import { initApi } from "./httpApi";

require("dotenv").config();
const host = process.env.SERVER_HOST ? process.env.SERVER_HOST : "0.0.0.0";
const port = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT, 10)
  : 8080;

const app = initApi();

app.listen(port, host, () => {
  console.log(`Listening on ${host}:${port}`);
});
