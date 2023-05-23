export function hasObjectPrototype(o: unknown): boolean {
  return typeof o === 'object';
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isPlainObject(o: unknown): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

export function isListResponse(
  result: unknown,
): result is { data: { id: string }[] } {
  if (!isPlainObject(result)) {
    return false;
  }
  return 'data' in result;
}
