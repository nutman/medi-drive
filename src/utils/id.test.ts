import { describe, it, expect } from 'vitest';
import { generateId } from './id';

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(generateId()).toBeTruthy();
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).greaterThan(0);
  });

  it('returns unique ids', () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });

  it('with prefix includes the prefix', () => {
    const id = generateId('draft');
    expect(id.startsWith('draft-')).toBe(true);
  });

  it('with empty prefix does not add a hyphen at start', () => {
    const id = generateId('');
    expect(id).not.toMatch(/^-/);
  });
});
