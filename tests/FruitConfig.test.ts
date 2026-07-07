import { describe, expect, it } from "vitest";
import {
  fruitConfigs,
  getFruitConfig,
  getNextFruitConfig
} from "../src/config/fruits";

describe("fruitConfigs", () => {
  it("defines a strictly increasing merge chain", () => {
    for (const config of fruitConfigs) {
      const next = getNextFruitConfig(config.id);

      if (!next) {
        continue;
      }

      expect(next.level).toBe(config.level + 1);
      expect(next.radius).toBeGreaterThan(config.radius);
      expect(next.score).toBeGreaterThan(config.score);
    }
  });

  it("rejects unknown fruit ids", () => {
    expect(() => getFruitConfig("missing" as never)).toThrow("Unknown fruit");
  });
});
