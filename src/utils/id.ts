/**
 * Generates a unique ID. Uses crypto.randomUUID when available, otherwise a fallback.
 */
export function generateId(prefix = ''): string {
  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return prefix ? `${prefix}-${id}` : id;
}
