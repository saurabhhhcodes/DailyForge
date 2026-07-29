import assert from "node:assert/strict";
import test from "node:test";

import { verifyFirebaseIdToken } from "./firebaseAuth.js";

function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function makeFakeJwt(payload) {
  const header = { alg: "RS256", typ: "JWT", kid: "test" };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.signature`;
}

function withEnv(overrides, fn) {
  const prev = { ...process.env };
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  });
  return Promise.resolve()
    .then(fn)
    .catch(err => console.error(err))