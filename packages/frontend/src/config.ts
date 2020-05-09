const prodSettings = {
  baseURL: "https://" + window.location.host,
  apiURL: "",
};

const devSettings = {
  baseURL: "http://localhost:8080",
  apiURL: "http://localhost:8080",
};

const settings =
  process.env.NODE_ENV === "production" ? prodSettings : devSettings;

export default settings;
