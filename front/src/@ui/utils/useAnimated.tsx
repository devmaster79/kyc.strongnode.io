import { useCallback, useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IAnim<TOpened = any, TClosed = any> =
  | {
      state: 'closed'
      storedValue: TClosed
      /** In ms */
      delay: number
      /**
       * Use this key if you want the 'closed' state destroy your component.
       * It is useful for resetting form in a modal.
       */
      destroyKey: string
    }
  | {
      state: 'closing' | 'open' | 'opening' | 'beforeClosing' | 'beforeOpening'
      storedValue: TOpened
      delay: number
      destroyKey: string
    }

let destroyKey = 1

/**
 * Add a state that will be equal to targetOpenState when the animation is complete.
 *
 * @param targetOpenState The next state that the animation should be in after some delay
 * @param ms delay in milliseconds
 * @returns the animation state
 */
export function useAnimated<TOpened = true, TClosed = false>(
  value: TOpened | TClosed,
  ms: number,
  isOpen?: (storedValue: TOpened | TClosed) => boolean
): IAnim<TOpened, TClosed> {
  const [animState, setAnimState] =
    useState<IAnim<TOpened, TClosed>['state']>('closed')
  const [storedValue, setStoredValue] = useState<TOpened | TClosed>(value)

  const isTargetOpen = useCallback(
    (value: TOpened | TClosed) => (isOpen ? isOpen(value) : !!value),
    [isOpen]
  )

  useEffect(() => {
    const closeWanted = !isTargetOpen(value) && animState === 'open'
    const openWanted = isTargetOpen(value) && animState === 'closed'

    if (openWanted) {
      setStoredValue(value)
      setTimeout(() => {
        setAnimState('beforeOpening')
      }, 0)
      setTimeout(() => {
        setAnimState('open')
      }, ms)
      setAnimState('opening')
    } else if (closeWanted) {
      setTimeout(() => {
        setAnimState('beforeClosing')
      }, 0)
      setTimeout(() => {
        destroyKey += 1
        setAnimState('closed')
        setStoredValue(value)
      }, ms)
      setAnimState('closing')
    } else if (
      isTargetOpen(value) &&
      isTargetOpen(storedValue) &&
      storedValue !== value
    ) {
      setStoredValue(value)
    }
  }, [ms, animState, isTargetOpen, value, storedValue])

  return {
    storedValue,
    state: animState,
    delay: ms,
    destroyKey: destroyKey.toString()
  } as unknown as IAnim<TOpened, TClosed>
}
