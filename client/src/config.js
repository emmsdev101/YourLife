export const MY_API =
  process.env.NODE_ENV === "development" ? "http://localhost:4001" : "";
export const SOCKET_URL = MY_API;
