import type { FruitConfig } from "../config/fruits";

interface HudActions {
  readonly onRestart: () => void;
  readonly onPauseToggle: () => void;
}

export class Hud {
  private readonly scoreValue = document.createElement("strong");
  private readonly bestScoreValue = document.createElement("strong");
  private readonly nextFruit = document.createElement("div");
  private readonly pauseButton = document.createElement("button");
  private readonly message = document.createElement("p");
  private readonly overlay: HTMLElement;
  private readonly actions: HudActions;

  constructor(container: HTMLElement, overlay: HTMLElement, actions: HudActions) {
    this.overlay = overlay;
    this.actions = actions;
    container.append(
      this.createHeaderPanel(),
      this.createNextPanel(),
      this.createActionPanel(),
      this.createNotesPanel()
    );
  }

  updateScore(score: number, bestScore: number): void {
    this.scoreValue.textContent = String(score);
    this.bestScoreValue.textContent = String(bestScore);
  }

  updateNextFruit(fruit: FruitConfig): void {
    this.nextFruit.textContent = fruit.label;
    this.nextFruit.style.background = fruit.color;
    this.nextFruit.style.width = `${Math.max(34, fruit.radius * 1.45)}px`;
    this.nextFruit.style.height = `${Math.max(34, fruit.radius * 1.45)}px`;
  }

  showMessage(text: string): void {
    this.message.textContent = text;
  }

  setPaused(isPaused: boolean): void {
    this.pauseButton.textContent = isPaused ? "继续" : "暂停";
  }

  showGameOver(score: number, bestScore: number): void {
    this.overlay.innerHTML = "";
    this.overlay.classList.add("is-visible");

    const dialog = document.createElement("div");
    dialog.className = "dialog";

    const title = document.createElement("h2");
    title.textContent = "Game Over";

    const copy = document.createElement("p");
    copy.textContent = `本局 ${score} 分，最高 ${bestScore} 分。`;

    const restartButton = document.createElement("button");
    restartButton.className = "button";
    restartButton.textContent = "重新开始";
    restartButton.addEventListener("click", () => this.actions.onRestart());

    dialog.append(title, copy, restartButton);
    this.overlay.append(dialog);
  }

  hideGameOver(): void {
    this.overlay.classList.remove("is-visible");
    this.overlay.innerHTML = "";
  }

  private createHeaderPanel(): HTMLElement {
    const panel = document.createElement("section");
    panel.className = "panel";

    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = "Fruit Fusion";

    const stats = document.createElement("div");
    stats.className = "stats";
    stats.append(
      this.createStat("本局分数", this.scoreValue),
      this.createStat("最高分", this.bestScoreValue)
    );

    panel.append(title, stats);
    return panel;
  }

  private createNextPanel(): HTMLElement {
    const panel = document.createElement("section");
    panel.className = "panel";

    const row = document.createElement("div");
    row.className = "next-fruit";

    this.nextFruit.className = "fruit-preview";

    const text = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = "下一个水果";
    const hint = document.createElement("p");
    hint.className = "log";
    hint.textContent = "移动鼠标或手指选择落点，点击容器掉落。";
    text.append(label, hint);

    row.append(this.nextFruit, text);
    panel.append(row);
    return panel;
  }

  private createActionPanel(): HTMLElement {
    const panel = document.createElement("section");
    panel.className = "panel actions";

    this.pauseButton.className = "button secondary";
    this.pauseButton.textContent = "暂停";
    this.pauseButton.addEventListener("click", () => this.actions.onPauseToggle());

    const restartButton = document.createElement("button");
    restartButton.className = "button";
    restartButton.textContent = "重开";
    restartButton.addEventListener("click", () => this.actions.onRestart());

    panel.append(this.pauseButton, restartButton);
    return panel;
  }

  private createNotesPanel(): HTMLElement {
    const panel = document.createElement("section");
    panel.className = "panel";
    this.message.className = "log";
    this.message.textContent = "目标：让相同水果碰撞，合成更大的水果。";
    panel.append(this.message);
    return panel;
  }

  private createStat(labelText: string, value: HTMLElement): HTMLElement {
    const stat = document.createElement("div");
    stat.className = "stat";
    const label = document.createElement("span");
    label.textContent = labelText;
    value.textContent = "0";
    stat.append(label, value);
    return stat;
  }
}
