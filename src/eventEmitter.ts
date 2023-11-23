/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_EVENTS = {
  'testFailure': 'testFailure'
} as const;

class EventEmitter {
  private listeners: Record<string, ((...args: unknown[])=>unknown)[]>;

  constructor() {
    this.listeners = {};
  }

  on(event: keyof typeof DEFAULT_EVENTS, listener: (...args: unknown[]) => unknown) {
    if (!this.listeners[event]) {
      throw new Error(`"${event}" event does not exist`);
    }

    this.listeners[event].push(listener);
  }

  emit(event: keyof typeof DEFAULT_EVENTS, ...args: unknown[]) {
    if (this.listeners[event]) {
      throw new Error(`"${event}" event does not exist`);
    }

    const eventListeners = this.listeners[event];

    for (const listener of eventListeners) {
      listener(event, ...args);
    }
  }
}

export default new EventEmitter();