import { useEffect, useState } from 'react'

export interface IAnim {
  state: 'closed' | 'closing' | 'open' | 'opening' | 'beforeClosing' | 'beforeOpening';
  /** In ms */
  delay: number,
  /**
   * Use this key if you want the 'closed' state destroy your component.
   * It is useful for resetting form in a modal.
   */
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
export function useAnimated (targetOpenState: boolean, ms: number): IAnim {
  const [animState, setAnimState] = useState<IAnim['state']>('closed')

  useEffect(() => {
    const closeWanted = !targetOpenState && animState === 'open'
    const openWanted = targetOpenState && animState === 'closed'

    if (openWanted) {
      setTimeout(() => { setAnimState('beforeOpening') }, 0)
      setTimeout(() => { setAnimState('open') }, ms)
      setAnimState('opening')
    } else if (closeWanted) {
      setTimeout(() => { setAnimState('beforeClosing') }, 0)
      setTimeout(() => {
        destroyKey += 1
        setAnimState('closed')
      }, ms)
      setAnimState('closing')
    }
  }, [targetOpenState, ms, animState])

  return {
    state: animState,
    delay: ms,
    destroyKey: destroyKey.toString()
  }
}
