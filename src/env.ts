import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { env as lumeEnv } from "lume/core/utils/env.ts";

const assertExists = <T extends string | boolean>(
  value: T | undefined,
  message: string,
): T => {
  assert(typeof value !== "undefined", message);
  return value;
};

const assertIfExists = <T>(
  value: T | undefined,
  predicate: (value: T) => string | false,
): T | undefined => {
  if (typeof value === "undefined") {
    return undefined;
  }
  const error = predicate(value);
  assert(error === false, String(error));
  return value;
};

const PORT = lumeEnv<string>("PORT");

const env = {
  SITE_URL: assertExists(
    lumeEnv<string>("SITE_URL"),
    "SITE_URL is required",
  ),
  PORT: assertIfExists(
    typeof PORT === "string" ? Number.parseInt(PORT) : undefined,
    (value) => {
      if (isNaN(value)) {
        return "PORT must be a valid number";
      }
      if (value <= 0) {
        return "PORT must be a positive number";
      }
      return false;
    },
  ),
  CMS_USERNAME: assertIfExists(
    lumeEnv<string>("CMS_USERNAME"),
    (value) => {
      if (value.length === 0) {
        return "CMS_USERNAME is empty";
      }
      return false;
    },
  ),
  CMS_PASSWORD: assertIfExists(
    lumeEnv<string>("CMS_PASSWORD"),
    (value) => {
      if (value.length === 0) {
        return "CMS_PASSWORD is empty";
      }
      return false;
    },
  ),
};

export default env;
