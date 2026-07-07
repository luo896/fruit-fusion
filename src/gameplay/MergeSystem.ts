import Matter from "matter-js";
import type { FruitConfig, FruitId } from "../config/fruits";
import { createFruitBody, isFruitBody } from "./FruitBody";

interface MergeSystemOptions {
  readonly engine: Matter.Engine;
  readonly getFruitConfig: (id: FruitId) => FruitConfig;
  readonly onMerged: (event: MergeEvent) => void;
}

export interface MergeEvent {
  readonly source: FruitConfig;
  readonly created: FruitConfig;
  readonly position: Matter.Vector;
}

export class MergeSystem {
  private readonly engine: Matter.Engine;
  private readonly getFruitConfig: (id: FruitId) => FruitConfig;
  private readonly onMerged: (event: MergeEvent) => void;
  private readonly lockedBodyIds = new Set<number>();

  constructor(options: MergeSystemOptions) {
    this.engine = options.engine;
    this.getFruitConfig = options.getFruitConfig;
    this.onMerged = options.onMerged;
  }

  handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>): void {
    for (const pair of event.pairs) {
      this.tryMerge(pair.bodyA, pair.bodyB);
    }
  }

  private tryMerge(bodyA: Matter.Body, bodyB: Matter.Body): void {
    if (!isFruitBody(bodyA) || !isFruitBody(bodyB)) {
      return;
    }

    if (this.lockedBodyIds.has(bodyA.id) || this.lockedBodyIds.has(bodyB.id)) {
      return;
    }

    const fruitId = bodyA.plugin.fruitFusion.fruitId;
    if (fruitId !== bodyB.plugin.fruitFusion.fruitId) {
      return;
    }

    const source = this.getFruitConfig(fruitId);
    if (!source.nextId) {
      return;
    }

    const created = this.getFruitConfig(source.nextId);
    const position = {
      x: (bodyA.position.x + bodyB.position.x) / 2,
      y: (bodyA.position.y + bodyB.position.y) / 2
    };

    this.lockedBodyIds.add(bodyA.id);
    this.lockedBodyIds.add(bodyB.id);
    Matter.Composite.remove(this.engine.world, [bodyA, bodyB], true);

    const mergedBody = createFruitBody(created, position, performance.now());
    Matter.Body.setVelocity(mergedBody, {
      x: (bodyA.velocity.x + bodyB.velocity.x) * 0.35,
      y: Math.min((bodyA.velocity.y + bodyB.velocity.y) * 0.25, 2)
    });
    Matter.Composite.add(this.engine.world, mergedBody);

    queueMicrotask(() => {
      this.lockedBodyIds.delete(bodyA.id);
      this.lockedBodyIds.delete(bodyB.id);
    });

    this.onMerged({ source, created, position });
  }
}
