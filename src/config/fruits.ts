export type FruitId =
  | "cherry"
  | "lemon"
  | "orange"
  | "apple"
  | "peach"
  | "pineapple"
  | "melon"
  | "watermelon";

export interface FruitConfig {
  readonly id: FruitId;
  readonly label: string;
  readonly level: number;
  readonly radius: number;
  readonly mass: number;
  readonly score: number;
  readonly color: string;
  readonly nextId?: FruitId;
}

export const fruitConfigs: readonly FruitConfig[] = [
  {
    id: "cherry",
    label: "樱",
    level: 0,
    radius: 15,
    mass: 0.3,
    score: 2,
    color: "#d93246",
    nextId: "lemon"
  },
  {
    id: "lemon",
    label: "柠",
    level: 1,
    radius: 20,
    mass: 0.5,
    score: 5,
    color: "#f4c84a",
    nextId: "orange"
  },
  {
    id: "orange",
    label: "橙",
    level: 2,
    radius: 25,
    mass: 0.8,
    score: 12,
    color: "#f58a35",
    nextId: "apple"
  },
  {
    id: "apple",
    label: "苹",
    level: 3,
    radius: 31,
    mass: 1.1,
    score: 24,
    color: "#e34f3f",
    nextId: "peach"
  },
  {
    id: "peach",
    label: "桃",
    level: 4,
    radius: 38,
    mass: 1.6,
    score: 48,
    color: "#ff9f8b",
    nextId: "pineapple"
  },
  {
    id: "pineapple",
    label: "菠",
    level: 5,
    radius: 46,
    mass: 2.3,
    score: 96,
    color: "#d8a126",
    nextId: "melon"
  },
  {
    id: "melon",
    label: "瓜",
    level: 6,
    radius: 55,
    mass: 3.4,
    score: 192,
    color: "#79b85b",
    nextId: "watermelon"
  },
  {
    id: "watermelon",
    label: "西",
    level: 7,
    radius: 66,
    mass: 5.2,
    score: 384,
    color: "#3d9d61"
  }
];

export const spawnableFruitIds: readonly FruitId[] = [
  "cherry",
  "lemon",
  "orange",
  "apple"
];

const configById = new Map<FruitId, FruitConfig>(
  fruitConfigs.map((config) => [config.id, config])
);

export function getFruitConfig(id: FruitId): FruitConfig {
  const config = configById.get(id);

  if (!config) {
    throw new Error(`Unknown fruit config: ${id}`);
  }

  return config;
}

export function getNextFruitConfig(id: FruitId): FruitConfig | undefined {
  const nextId = getFruitConfig(id).nextId;
  return nextId ? getFruitConfig(nextId) : undefined;
}
