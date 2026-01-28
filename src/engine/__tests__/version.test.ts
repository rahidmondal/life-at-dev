import { describe, expect, it } from 'vitest';
import { ENGINE_VERSION } from '../version';

describe('Engine Version', () => {
  it('should have the correct version', () => {
    expect(ENGINE_VERSION).toBe('2.0.0');
  });
});
