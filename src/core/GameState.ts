export type GameState = "boot" | "ready" | "playing" | "paused" | "gameOver";

export class GameStateMachine {
  private state: GameState = "boot";

  get current(): GameState {
    return this.state;
  }

  canDrop(): boolean {
    return this.state === "playing";
  }

  setReady(): void {
    this.state = "ready";
  }

  start(): void {
    this.state = "playing";
  }

  pause(): void {
    if (this.state === "playing") {
      this.state = "paused";
    }
  }

  resume(): void {
    if (this.state === "paused") {
      this.state = "playing";
    }
  }

  gameOver(): void {
    this.state = "gameOver";
  }
}
