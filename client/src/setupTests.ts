import "@testing-library/jest-dom";

// Add TextEncoder polyfill
if (typeof TextEncoder === "undefined")
  global.TextEncoder = require("util").TextEncoder;

if (typeof TextDecoder === "undefined")
  global.TextDecoder = require("util").TextDecoder;

const globalProcess = (
  globalThis as {
    process?: { env?: Record<string, string | undefined> };
  }
).process;

if (globalProcess) {
  globalProcess.env = globalProcess.env ?? {};
  if (!globalProcess.env.VITE_API_URL)
    globalProcess.env.VITE_API_URL = "http://localhost:3000";
}
