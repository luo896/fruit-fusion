import Matter from "matter-js";
import { getFruitConfig } from "../config/fruits";
import type { FruitConfig, FruitId } from "../config/fruits";
import { pickOne, type RandomSource } from "../core/Random";
import { createFruitBody } from "./FruitBody";

interface SpawnControllerOptions {
  readonly engine: Matter.Engine;
  readonly stageElement: HTMLElement;
  readonly worldWidth: number;
  readonly spawnY: number;
  readonly random: RandomSource;
  readonly spawnableFruitIds: readonly FruitId[];
  readonly canDrop: () => boolean;
  readonly onNextChanged: (fruit: FruitConfig) => void;
}

export class SpawnController {
  private readonly engine: Matter.Engine;
  private readonly stageElement: HTMLElement;
  private readonly worldWidth: number;
  private readonly spawnY: number;
  private readonly random: RandomSource;
  private readonly spawnableFruitIds: readonly FruitId[];
  private readonly canDrop: () => boolean;
  private readonly onNextChanged: (fruit: FruitConfig) => void;
  private pointerX: number;
  private nextFruitId: FruitId;
  private lastDropAt = 0;

  constructor(options: SpawnControllerOptions) {
    this.engine = options.engine;
    this.stageElement = options.stageElement;
    this.worldWidth = options.worldWidth;
    this.spawnY = options.spawnY;
    this.random = options.random;
    this.spawnableFruitIds = options.spawnableFruitIds;
    this.canDrop = options.canDrop;
    this.onNextChanged = options.onNextChanged;
    this.pointerX = this.worldWidth / 2;
    this.nextFruitId = this.pickFruitId();
    this.bindPointerEvents();
  }

  prime(): void {
    this.onNextChanged(getFruitConfig(this.nextFruitId));
  }

  private bindPointerEvents(): void {
    this.stageElement.addEventListener("pointermove", (event) => {
      this.pointerX = this.toWorldX(event.clientX);
    });
    this.stageElement.addEventListener("pointerdown", (event) => {
      this.pointerX = this.toWorldX(event.clientX);
      this.drop();
    });
  }

  private drop(): void {
    if (!this.canDrop()) {
      return;
    }

    const now = performance.now();
    if (now - this.lastDropAt < 380) {
      return;
    }

    const config = getFruitConfig(this.nextFruitId);
    const x = Math.min(
      this.worldWidth - config.radius - 8,
      Math.max(config.radius + 8, this.pointerX)
    );
    const body = createFruitBody(config, { x, y: this.spawnY }, now);

    Matter.Composite.add(this.engine.world, body);
    this.lastDropAt = now;
    this.nextFruitId = this.pickFruitId();
    this.onNextChanged(getFruitConfig(this.nextFruitId));
  }

  private pickFruitId(): FruitId {
    return pickOne(this.spawnableFruitIds, this.random);
  }

  private toWorldX(clientX: number): number {
    const rect = this.stageElement.getBoundingClientRect();
    const normalized = (clientX - rect.left) / rect.width;
    return normalized * this.worldWidth;
  }
}
