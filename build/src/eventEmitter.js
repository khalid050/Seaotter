"use strict";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_EVENTS = {
    'testFailure': 'testFailure'
};
class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, listener) {
        if (!this.listeners[event]) {
            throw new Error(`"${event}" event does not exist`);
        }
        this.listeners[event].push(listener);
    }
    emit(event, ...args) {
        if (this.listeners[event]) {
            throw new Error(`"${event}" event does not exist`);
        }
        const eventListeners = this.listeners[event];
        for (const listener of eventListeners) {
            listener(event, ...args);
        }
    }
}
exports.default = new EventEmitter();
