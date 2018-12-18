import { Db } from "mongodb";

interface Globals {
  db?: Db;
}

const globals: Globals = {};

export function get(key: keyof Globals) {
  return globals[key];
}

export function set(key: keyof Globals, value: any) {
  if (!globals[key]) return;
  globals[key] = value;
}
