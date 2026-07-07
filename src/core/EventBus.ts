type Handler<T> = (payload: T) => void;

export class EventBus<EventMap extends object> {
  private readonly handlers = new Map<keyof EventMap, Set<Handler<unknown>>>();

  on<Key extends keyof EventMap>(
    eventName: Key,
    handler: Handler<EventMap[Key]>
  ): () => void {
    const bucket = this.handlers.get(eventName) ?? new Set<Handler<unknown>>();
    bucket.add(handler as Handler<unknown>);
    this.handlers.set(eventName, bucket);

    return () => {
      bucket.delete(handler as Handler<unknown>);
    };
  }

  emit<Key extends keyof EventMap>(eventName: Key, payload: EventMap[Key]): void {
    const bucket = this.handlers.get(eventName);

    if (!bucket) {
      return;
    }

    for (const handler of bucket) {
      handler(payload);
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
