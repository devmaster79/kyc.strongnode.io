import { useState } from "react";

export interface ServiceProps<T extends (...args: any) => any> {
  call: T;
  /** The API call's output extended with `{ result: 'waiting' }` and `{ result: 'loading' }` */
  data: Awaited<ReturnType<T>> | { result: "waiting" } | { result: "loading" };
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
export function useService<T extends (...args: any) => any>(
  apiCall: T
): ServiceProps<T> {
  const [data, setData] = useState<any>({ result: "waiting" });
  const call: any = async (...withData: any[]) => {
    setData({ result: "loading" });
    const result = await apiCall(...withData);
    setData(result);
    return result;
  };
  return { call, data };
}

type ValueOf<T> = T[keyof T];
type ObjectOfFunctions = { [key: string]: (...args: any) => any };

export type SingleServiceData<T extends (...args: any) => any> =
  | Awaited<ReturnType<T>>
  | { result: "loading" };

export interface ServicesPropsDescription<Last, Data, DataPerServices> {
  /** Describe what API call has been used most recently  */
  last: Last;
  /** The last API call's output extended with `{ result: 'waiting' }` and `{ result: 'loading' }` */
  data: Data;
  /** All API calls' outputs extended with `{ result: 'waiting' }` and `{ result: 'loading' }` */
  dataPerService: DataPerServices;
}

export type PossibleServicesPropsDescriptions<
  Services extends ObjectOfFunctions
> =
  | ServicesPropsDescription<
      null,
      { result: "waiting" },
      DataPerServicesWaiting<Services>
    >
  | ValueOf<
      {
        [ServiceName in keyof Services]: ServicesPropsDescription<
          ServiceName,
          SingleServiceData<Services[ServiceName]>,
          DataPerServices<Services>
        >;
      }
    >;

/**
 * 
 */
export type ServicesProps<
  Services extends ObjectOfFunctions
> = PossibleServicesPropsDescriptions<Services> & Services;

export type DataPerServicesWaiting<Services extends ObjectOfFunctions> = {
  [ServiceName in keyof Services]: { result: "waiting" };
};
export type DataPerServices<Services extends ObjectOfFunctions> = {
  [ServiceName in keyof Services]:
    | SingleServiceData<Services[ServiceName]>
    | { result: "waiting" };
};

/**
 * Create a hook from API calls.
 * It extends the responses with `{ result: 'waiting' }` and `{ result: 'loading' }`
 * so to be easy to inform the user about every stage.
 *
 * NOTE: This will only work for services that
 *  1. does not throw anything
 *  2. and they will return the res.data directly.
 */
export function useServices<S extends ObjectOfFunctions>(
  apiCalls: S
): ServicesProps<S> {
  const [data, setData] = useState<any>({ result: "waiting" });
  const initialDataPerService: DataPerServices<S> = Object.fromEntries(
    Object.keys(apiCalls).map((apiCallName) => [
      apiCallName,
      { result: "waiting" },
    ])
  ) as any;

  const [dataPerService, setDataPerService] = useState(initialDataPerService);
  const [last, setLast] = useState<keyof S | null>(null);
  const call: any = (key: string, apiCall: any) => async (
    ...withData: any[]
  ) => {
    setLast(key);
    setData({ result: "loading" });
    setDataPerService((dataPerService) => ({
      ...dataPerService,
      [key]: { result: "loading" },
    }));
    const result = await apiCall(...withData);
    setData(result);
    setDataPerService((dataPerService) => ({
      ...dataPerService,
      [key]: result,
    }));
    return result;
  };

  const calls: any = {};
  const keys = Object.keys(apiCalls);
  for (let i of keys) {
    calls[i] = call(i, apiCalls[i]);
  }

  return { last, data, dataPerService, ...calls };
}
