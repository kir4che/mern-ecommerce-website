import "@testing-library/jest-dom";
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from "util";

const g = globalThis as typeof globalThis & {
  TextEncoder?: typeof globalThis.TextEncoder;
  TextDecoder?: typeof globalThis.TextDecoder;
};

if (typeof g.TextEncoder === "undefined")
  g.TextEncoder = NodeTextEncoder as unknown as typeof globalThis.TextEncoder;

if (typeof g.TextDecoder === "undefined")
  g.TextDecoder = NodeTextDecoder as unknown as typeof globalThis.TextDecoder;

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
