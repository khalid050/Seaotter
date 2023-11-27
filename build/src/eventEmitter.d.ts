declare const DEFAULT_EVENTS: {
    readonly testFailure: "testFailure";
};
declare class EventEmitter {
    private listeners;
    constructor();
    on(event: keyof typeof DEFAULT_EVENTS, listener: (...args: unknown[]) => unknown): void;
    emit(event: keyof typeof DEFAULT_EVENTS, ...args: unknown[]): void;
}
declare const _default: EventEmitter;
export default _default;
