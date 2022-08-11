import { useAnimated } from '@ui/utils/useAnimated'
import { ComponentProps, useRef, useState } from 'react'

const lastZoomed = {
  left: 0,
  top: 0
}
export const ZoomableImage = (props: ComponentProps<'img'>) => {
  const [open, setOpen] = useState(false)
  const openAnim = useAnimated(open, 500)
  const containerRef = useRef<HTMLDivElement>(null)
  const realtiveWrapperRef = useRef<HTMLDivElement>(null)

  function handleClick() {
    const container = containerRef.current
    const realtiveWrapper = realtiveWrapperRef.current
    if (container && realtiveWrapper && openAnim.state === 'closed') {
      // prevent collapsing the row when the container become fix postioned
      const realtiveWrapperRect = realtiveWrapper.getBoundingClientRect()
      realtiveWrapper.style.height = `${realtiveWrapperRect.height}px`
      realtiveWrapper.style.width = `${realtiveWrapperRect.width}px`
      // Store the initial values for zooming out
      const containerRect = container.getBoundingClientRect()
      lastZoomed.left = containerRect.left
      lastZoomed.top = containerRect.top
      // init the values for animation
      container.style.left = `${containerRect.left}px`
      container.style.top = `${containerRect.top}px`
    } else if (container && open) {
      // set initial values for animation
      container.style.left = `${lastZoomed.left}px`
      container.style.top = `${lastZoomed.top}px`
    }
    setOpen(!open)
  }

  const containerStyle: React.CSSProperties = {
    transition: `all ${openAnim.delay}ms`,
    cursor: 'zoom-in',
    ...(openAnim.storedValue === true && {
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      cursor: 'zoom-out',
      zIndex: 9999
    })
  }
  const imgStyle: React.CSSProperties = {
    ...props.style,
    transition: `width ${openAnim.delay}ms`,
    width: props.style?.width || '300px',
    ...(open && {
      width: '100vw'
    })
  }
  return (
    <div ref={realtiveWrapperRef} style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        style={containerStyle}
        onClick={handleClick}
        role="link"
        tabIndex={0}>
        <img {...props} style={imgStyle} />
      </div>
    </div>
  )
}
