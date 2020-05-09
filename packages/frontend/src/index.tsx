import React from "react";
import ReactDOM from "react-dom";

import { useRemoteData, emptyParams } from "./api/hooks";

function App() {
  const value = useRemoteData("GET /test", emptyParams);

  return <h1>{value?.status === "ok" && value.data}</h1>;
}

ReactDOM.render(<App />, document.getElementById("root"));
