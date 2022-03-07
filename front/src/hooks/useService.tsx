import { useState } from "react";

interface ServiceProps<T extends (...args: any) => any> {
  call: T;
  data: Awaited<ReturnType<T>> | { result: 'waiting' } | { result: "loading" };
}

/**
 * Create a hook from an API call.
 * It extends the responses with `{ result: 'waiting' }` and `{ result: 'loading' }`
 * so to be easy to inform the user about every stage.
 *
 * NOTE: This will only work for services that
 *  1. does not throw anything
 *  2. and they will return the res.data directly.
 */
export function useService<T extends (...args: any) => any>(apiCall: T): ServiceProps<T> {
  const [data, setData] = useState<any>({ result: 'waiting' });
  const call: any = async (...withData: any[]) => {
    setData({ result: "loading" });
    const result = await apiCall(...withData);
    setData(result);
    return result;
  }
  return { call, data };
}
