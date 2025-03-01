/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "fast-json-parse" {
  export function safeParse(text: string): {
    value: any;
    error?: Error;
  };
}
