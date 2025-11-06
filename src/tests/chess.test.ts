import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { moveUci } from "../lib/chess";

describe("chess utils", () => {
  it("plays a legal move", () => {
    const g = new Chess();
    const m = moveUci(g, "e2e4");
    expect(m).toBeTruthy();
    expect(g.history().length).toBe(1);
  });

  it("rejects illegal move", () => {
  const g = new Chess();
  let m;
  try {
    m = moveUci(g, "e2e5");
  } catch {
    m = false;
  }
  expect(m).toBeFalsy();
  expect(g.history().length).toBe(0);
});
