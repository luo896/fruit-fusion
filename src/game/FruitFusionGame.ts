import Matter from "matter-js";
import { EventBus } from "../core/EventBus";
import { GameStateMachine } from "../core/GameState";
import { createSeededRandom } from "../core/Random";
import { fruitConfigs, getFruitConfig, spawnableFruitIds } from "../config/fruits";
import type { FruitConfig, FruitId } from "../config/fruits";
import { FailLineSystem } from "../gameplay/FailLineSystem";
import { MergeSystem } from "../gameplay/MergeSystem";
import { ScoreSystem } from "../gameplay/ScoreSystem";
import { SpawnController } from "../gameplay/SpawnController";
import { Hud } from "../ui/Hud";

const WORLD_WIDTH = 420;
const WORLD_HEIGHT = 720;
const WALL_THICKNESS = 42;
const FAIL_LINE_Y = 118;

export interface GameEvents {
  scoreChanged: { score: number; bestScore: number };
  nextFruitChanged: { fruit: FruitConfig };
  gameOver: { score: number; bestScore: number };
  message: { text: string };
}

export class FruitFusionGame {
  private readonly bus = new EventBus<GameEvents>();
  private readonly stateMachine = new GameStateMachine();
  private readonly engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.04 }
  });
  private readonly render: Matter.Render;
  private readonly runner = Matter.Runner.create();
  private readonly stageElement: HTMLDivElement;
  private readonly hud: Hud;
  private readonly scoreSystem: ScoreSystem;
  private spawnController: SpawnController;
  private mergeSystem: MergeSystem;
  private failLineSystem: FailLineSystem;

  constructor(root: HTMLElement) {
    root.innerHTML = "";

    const shell = document.createElement("main");
    shell.className = "shell";

    this.stageElement = document.createElement("div");
    this.stageElement.className = "stage";

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    this.stageElement.append(overlay);

    const hudElement = document.createElement("aside");
    hudElement.className = "hud";

    shell.append(this.stageElement, hudElement);
    root.append(shell);

    this.render = Matter.Render.create({
      element: this.stageElement,
      engine: this.engine,
      options: {
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        background: "#fffdf6",
        wireframes: false,
        pixelRatio: window.devicePixelRatio
      }
    });

    this.hud = new Hud(hudElement, overlay, {
      onRestart: () => this.restart(),
      onPauseToggle: () => this.togglePause()
    });
    this.scoreSystem = new ScoreSystem(window.localStorage);
    this.spawnController = this.createSpawnController();
    this.mergeSystem = this.createMergeSystem();
    this.failLineSystem = this.createFailLineSystem();

    this.createWorldBounds();
    this.bindEvents();
    this.drawFailLine();
    this.stateMachine.setReady();
  }

  start(): void {
    this.stateMachine.start();
    Matter.Render.run(this.render);
    Matter.Runner.run(this.runner, this.engine);
    this.spawnController.prime();
    this.hud.updateScore(this.scoreSystem.score, this.scoreSystem.bestScore);
  }

  private restart(): void {
    Matter.Runner.stop(this.runner);
    Matter.Render.stop(this.render);
    Matter.Composite.clear(this.engine.world, false, true);
    Matter.Engine.clear(this.engine);

    this.scoreSystem.reset();
    this.stateMachine.setReady();
    this.createWorldBounds();
    this.drawFailLine();
    this.spawnController = this.createSpawnController();
    this.mergeSystem = this.createMergeSystem();
    this.failLineSystem = this.createFailLineSystem();
    this.bindCollisionEvents();
    this.hud.hideGameOver();
    this.start();
  }

  private togglePause(): void {
    if (this.stateMachine.current === "playing") {
      this.stateMachine.pause();
      Matter.Runner.stop(this.runner);
      this.hud.setPaused(true);
      return;
    }

    if (this.stateMachine.current === "paused") {
      this.stateMachine.resume();
      Matter.Runner.run(this.runner, this.engine);
      this.hud.setPaused(false);
    }
  }

  private createSpawnController(): SpawnController {
    const random = createSeededRandom(Date.now());
    return new SpawnController({
      engine: this.engine,
      stageElement: this.stageElement,
      worldWidth: WORLD_WIDTH,
      spawnY: 74,
      random,
      spawnableFruitIds,
      canDrop: () => this.stateMachine.canDrop(),
      onNextChanged: (fruit) => this.bus.emit("nextFruitChanged", { fruit })
    });
  }

  private createMergeSystem(): MergeSystem {
    return new MergeSystem({
      engine: this.engine,
      getFruitConfig,
      onMerged: (event) => {
        const score = this.scoreSystem.add(event.created.score);
        this.bus.emit("scoreChanged", {
          score,
          bestScore: this.scoreSystem.bestScore
        });
        this.bus.emit("message", {
          text: `${event.source.label} + ${event.source.label} -> ${event.created.label}`
        });
      }
    });
  }

  private createFailLineSystem(): FailLineSystem {
    return new FailLineSystem({
      failLineY: FAIL_LINE_Y,
      delayMs: 1800,
      getBodies: () => Matter.Composite.allBodies(this.engine.world),
      onGameOver: () => this.endGame()
    });
  }

  private createWorldBounds(): void {
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: {
        fillStyle: "#2f3b4d"
      }
    };
    const floor = Matter.Bodies.rectangle(
      WORLD_WIDTH / 2,
      WORLD_HEIGHT + WALL_THICKNESS / 2,
      WORLD_WIDTH + WALL_THICKNESS * 2,
      WALL_THICKNESS,
      wallOptions
    );
    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      WORLD_HEIGHT / 2,
      WALL_THICKNESS,
      WORLD_HEIGHT * 2,
      wallOptions
    );
    const rightWall = Matter.Bodies.rectangle(
      WORLD_WIDTH + WALL_THICKNESS / 2,
      WORLD_HEIGHT / 2,
      WALL_THICKNESS,
      WORLD_HEIGHT * 2,
      wallOptions
    );

    Matter.Composite.add(this.engine.world, [floor, leftWall, rightWall]);
  }

  private drawFailLine(): void {
    const failLine = Matter.Bodies.rectangle(
      WORLD_WIDTH / 2,
      FAIL_LINE_Y,
      WORLD_WIDTH - 28,
      2,
      {
        isStatic: true,
        isSensor: true,
        collisionFilter: { mask: 0 },
        render: {
          fillStyle: "#e5534b"
        }
      }
    );
    Matter.Composite.add(this.engine.world, failLine);
  }

  private bindEvents(): void {
    this.bus.on("scoreChanged", ({ score, bestScore }) => {
      this.hud.updateScore(score, bestScore);
    });
    this.bus.on("nextFruitChanged", ({ fruit }) => {
      this.hud.updateNextFruit(fruit);
    });
    this.bus.on("gameOver", ({ score, bestScore }) => {
      this.hud.showGameOver(score, bestScore);
    });
    this.bus.on("message", ({ text }) => {
      this.hud.showMessage(text);
    });

    Matter.Events.on(this.engine, "beforeUpdate", (event) => {
      this.failLineSystem.update(event.timestamp);
    });
    this.bindCollisionEvents();
  }

  private bindCollisionEvents(): void {
    Matter.Events.off(this.engine, "collisionStart");
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      this.mergeSystem.handleCollisionStart(event);
    });
  }

  private endGame(): void {
    if (this.stateMachine.current === "gameOver") {
      return;
    }

    this.stateMachine.gameOver();
    Matter.Runner.stop(this.runner);
    this.scoreSystem.commitBestScore();
    this.bus.emit("gameOver", {
      score: this.scoreSystem.score,
      bestScore: this.scoreSystem.bestScore
    });
  }
}

export const gameCatalog = {
  fruitConfigs,
  world: {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    failLineY: FAIL_LINE_Y
  }
};

export type { FruitId };
