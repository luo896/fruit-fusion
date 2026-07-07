const BEST_SCORE_KEY = "fruit-fusion.best-score";

export class ScoreSystem {
  private currentScore = 0;
  private highScore = 0;
  private readonly storage: Pick<Storage, "getItem" | "setItem">;

  constructor(storage: Pick<Storage, "getItem" | "setItem">) {
    this.storage = storage;
    this.highScore = Number(storage.getItem(BEST_SCORE_KEY) ?? 0);
  }

  get score(): number {
    return this.currentScore;
  }

  get bestScore(): number {
    return Math.max(this.highScore, this.currentScore);
  }

  add(points: number): number {
    this.currentScore += points;
    return this.currentScore;
  }

  reset(): void {
    this.currentScore = 0;
  }

  commitBestScore(): void {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      this.storage.setItem(BEST_SCORE_KEY, String(this.highScore));
    }
  }
}
