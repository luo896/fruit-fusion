import { describe, expect, it } from "vitest";
import { createSeededRandom, pickOne } from "../src/core/Random";

describe("createSeededRandom", () => {
  it("returns a reproducible sequence", () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);

    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });
});

describe("pickOne", () => {
  it("throws for empty arrays", () => {
    expect(() => pickOne([], Math.random)).toThrow("empty array");
  });
});
