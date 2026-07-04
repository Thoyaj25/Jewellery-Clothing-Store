import tls from "node:tls";
import { URL } from "node:url";

const url = new URL(process.env.DATABASE_URL);

const socket = tls.connect({
  host: url.hostname,
  port: Number(url.port || 5432),
  servername: url.hostname,
  family: 4,
  timeout: 10000,
});

socket.on("secureConnect", () => {
  console.log("TLS URL SUCCESS");
  socket.end();
});

socket.on("timeout", () => {
  console.log("TLS TIMEOUT");
  socket.destroy();
});

socket.on("error", console.error);