import { isPlainObject } from './common.util';

function preparePayload(args: unknown[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg: any = args[i];
    if (isPlainObject(arg)) {
      result.push(...preparePayload(Object.entries(arg)));
    } else if (Array.isArray(arg) && !!arg.length) {
      result.push(...arg);
    } else {
      result.push(arg);
    }
  }
  return result.flat();
}

export function hashArguments(args: unknown[]): string {
  const array = preparePayload(args).map(String).sort();
  // args = args.flat().map().sort();
  // if (isPlainObject(arg)) {
  //   result += ':' + hashArguments(Object.entries(arg));
  // } else if (Array.isArray(arg) && !!arg.length) {
  //   result += ':' + arg.join(':');
  // } else {
  //   result += ':' + arg;
  // }
  return array.join(':');
  // let result = '';

  // for (let i = 0; i < array.length; i++) {
  //   const arg: any = args[i];
  //   if (isPlainObject(arg)) {
  //     result += ':' + hashArguments(Object.entries(arg));
  //   } else if (Array.isArray(arg) && !!arg.length) {
  //     result += ':' + arg.join(':');
  //   } else {
  //     result += ':' + arg;
  //   }
  // }
  // return result.slice(1);
}
