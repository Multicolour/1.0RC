// This exists to fix the uncaughtException event not
// being part of the @types/node thing.
// @TODO: PR to add that event name.
declare namespace NodeJS {
  interface Process extends EventEmitter {
    on(event: string, callback: (...args: any[]) => void): this;
	}
}
