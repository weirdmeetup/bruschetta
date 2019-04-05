export function isEmpty<T>(value: T) {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
}
