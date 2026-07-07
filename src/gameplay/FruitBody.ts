import Matter from "matter-js";
import type { FruitConfig } from "../config/fruits";

export interface FruitBodyMeta {
  readonly kind: "fruit";
  readonly fruitId: FruitConfig["id"];
  readonly createdAt: number;
}

export type FruitBody = Matter.Body & {
  plugin: Matter.Body["plugin"] & {
    fruitFusion?: FruitBodyMeta;
  };
};

export function isFruitBody(body: Matter.Body): body is FruitBody {
  return (body as FruitBody).plugin?.fruitFusion?.kind === "fruit";
}

export function createFruitBody(
  config: FruitConfig,
  position: Matter.Vector,
  createdAt: number
): FruitBody {
  const body = Matter.Bodies.circle(position.x, position.y, config.radius, {
    restitution: 0.18,
    friction: 0.38,
    frictionAir: 0.012,
    density: config.mass / 1000,
    label: `fruit:${config.id}`,
    render: {
      fillStyle: config.color,
      strokeStyle: "rgba(25, 31, 42, 0.18)",
      lineWidth: 2
    }
  }) as FruitBody;

  body.plugin.fruitFusion = {
    kind: "fruit",
    fruitId: config.id,
    createdAt
  };

  return body;
}
