import { ZodIssue } from 'zod'

export type ApiResponse<
  Result extends string,
  StatusCode extends number,
  Others
> = {
  result: Result
  statusCode: StatusCode
} & Others

export const apiResponse = <
  Result extends string,
  StatusCode extends number,
  Others
>(
  result: Result,
  statusCode: StatusCode,
  others: Others
): ApiResponse<Result, StatusCode, Others> => ({
  result,
  statusCode,
  ...others
})

// Utility types

/* eslint-disable @typescript-eslint/no-explicit-any */
type EmptyObject = Record<string, never>
type ArrayKey = number
type Primitive = null | undefined | string | number | boolean | symbol | bigint
/** Cons<'a', ['b', 'c']> => ['a', 'b', 'c']*/
type Cons<H, T extends readonly any[]> = ((h: H, ...t: T) => void) extends (
  ...r: infer R
) => void
  ? R
  : never
/** TupleKeys<['a', 'b']> => 0 | 1 */
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>
/** IsTuple<[number, number]> => true, IsTuple<number[]> = false */
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length']
  ? false
  : true
/** PathImpl<'foo', { bar: ['a'] }> => ["foo"] | ["foo", "bar"] | ["foo", "bar", "0"] */
type PathImpl<K extends string | number, V> = V extends Primitive
  ? [K]
  : [K] | Cons<K, Path<V>>
/** Path<{ foor: { bar: ['a', 'b'] }}> => ["foo"] | ["foo", "bar"] | ["foo", "bar", "0"] | ["foo", "bar", "1"] */
type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>
    }[keyof T]
/* eslint-enable @typescript-eslint/no-explicit-any */

export type ImprovedZodIssue<TRequestBody extends Record<string, unknown>> =
  ZodIssue & { path: Path<TRequestBody> }

// Factory methods
export const success = <Others>(others: Others) =>
  apiResponse<'success', 200, Others>('success', 200, others)
export const validationError = <Issues>(issues: Issues) =>
  apiResponse('validation-error', 422, { issues })
export const zodValidationError = <
  TRequestBody extends Record<string, unknown>
>(
  issues: ImprovedZodIssue<TRequestBody>[]
): ZodValidationError<TRequestBody> =>
  apiResponse('validation-error', 422, { issues })
export const unauthorizedError = apiResponse('unauthorized-error', 401, {})
export const bannedError = apiResponse('banned-error', 403, {})
export const unexpectedError = apiResponse('unexpected-error', 500, {})

// Response types
export type Success<T> = ApiResponse<'success', 200, T>
export type UnauthorizedError = ApiResponse<
  'unauthorized-error',
  401,
  EmptyObject
>
export type UnexpectedError = ApiResponse<'unexpected-error', 500, EmptyObject>
export type ValidationError<T = EmptyObject> = ApiResponse<
  'validation-error',
  422,
  { issues: T }
>
export type ZodValidationError<TRequestBody extends Record<string, unknown>> =
  ValidationError<ImprovedZodIssue<TRequestBody>[]>
export type BannedError = ApiResponse<
  'banned-error',
  403,
  { remainingTimeMs: number }
>
