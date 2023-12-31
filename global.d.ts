import { Otter } from './src/otter';

declare global {
  const otter: Otter;
  const explore: typeof Otter.prototype.explore;
  const test: typeof Otter.prototype.test;
  const expect: typeof Otter.prototype.expect;
  const when: typeof Otter.prototype.when;
}