import Matter from "matter-js";
import { isFruitBody } from "./FruitBody";

interface FailLineSystemOptions {
  readonly failLineY: number;
  readonly delayMs: number;
  readonly getBodies: () => readonly Matter.Body[];
  readonly onGameOver: () => void;
}

export class FailLineSystem {
  private readonly failLineY: number;
  private readonly delayMs: number;
  private readonly getBodies: () => readonly Matter.Body[];
  private readonly onGameOver: () => void;
  private dangerStartedAt?: number;

  constructor(options: FailLineSystemOptions) {
    this.failLineY = options.failLineY;
    this.delayMs = options.delayMs;
    this.getBodies = options.getBodies;
    this.onGameOver = options.onGameOver;
  }

  update(timestamp: number): void {
    const hasDanger = this.getBodies().some((body) => {
      if (!isFruitBody(body)) {
        return false;
      }

      const fruitAge = performance.now() - body.plugin.fruitFusion.createdAt;
      const isSettledEnough = fruitAge > 900 && Math.abs(body.velocity.y) < 1.25;
      const top = body.bounds.min.y;
      return isSettledEnough && top < this.failLineY;
    });

    if (!hasDanger) {
      this.dangerStartedAt = undefined;
      return;
    }

    this.dangerStartedAt ??= timestamp;

    if (timestamp - this.dangerStartedAt >= this.delayMs) {
      this.onGameOver();
    }
  }
}
