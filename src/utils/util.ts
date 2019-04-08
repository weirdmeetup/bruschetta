export function isEmpty<T>(value: T | null | undefined) {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
}
