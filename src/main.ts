import { FruitFusionGame } from "./game/FruitFusionGame";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing #app root.");
}

const game = new FruitFusionGame(app);
game.start();
