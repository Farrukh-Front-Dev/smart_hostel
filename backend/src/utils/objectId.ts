const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

export function isObjectId(value: string): boolean {
  return OBJECT_ID_PATTERN.test(value);
}

export function requireObjectId(value: unknown, fieldName = 'id'): string {
  const normalized = typeof value === 'string' ? value : String(value ?? '');

  if (!isObjectId(normalized)) {
    const error = new Error(`Invalid ${fieldName} format`);
    (error as Error & { status?: number }).status = 400;
    throw error;
  }

  return normalized;
}
