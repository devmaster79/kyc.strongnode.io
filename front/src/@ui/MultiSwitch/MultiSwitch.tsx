import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Media from 'theme/mediaQueries'
import { useMediaQuery } from 'react-responsive'

interface CSSObject {
  [key: string]: number | string
}

export type MultiSwitchProps<
  TOption extends { [k: string]: string | number },
  TLabelKey extends keyof TOption,
  TValueKey extends keyof TOption
> = {
  options: TOption[]
  /** the column that the MultiSwitch will use as value */
  trackBy?: TValueKey
  /** the column that the MultiSwitch will show */
  searchBy?: TLabelKey
  value: TOption
  onChange: (selectedValue: TOption) => void
  style?: CSSObject
}

const ANIMATION_DURATION_MS = 250
const BUTTON_WIDTH_PX = 132
const BUTTON_WIDTH_PX_MOBILE = 92
const BUTTON_MARGIN_PX = 3

function MultiSwitch<
  TOption extends { [k: string]: string | number },
  TLabelKey extends string,
  TValueKey extends string
>(
  props: TValueKey extends void
    ? MultiSwitchProps<
        { label: string | number; value: string | number },
        'label',
        'value'
      >
    : MultiSwitchProps<TOption, TLabelKey, TValueKey>
) {
  const trackBy = props.trackBy || 'value'
  const searchBy = props.searchBy || 'label'
  const [animationTimeout, setAnimationTimeout] = useState<
    NodeJS.Timeout | undefined
  >(undefined)
  const [activeItem, setActiveItem] = useState(() => {
    return props.options.findIndex(
      (option) => option[trackBy] === props.value[trackBy]
    )
  })
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

  /**
   * Calls onChange after the animation is done
   * @param key of the options array
   */
  const onSelectValue = (key: number) => {
    clearTimeout(animationTimeout as NodeJS.Timeout)
    setActiveItem(key)
    setAnimationTimeout(
      setTimeout(() => {
        props.onChange(props.options[key])
      }, ANIMATION_DURATION_MS)
    )
  }

  /**
   * In case of unmount, remove the active timeout as well.
   */
  useEffect(() => {
    return () => {
      clearTimeout(animationTimeout as NodeJS.Timeout)
    }
  })

  const activeXOffset =
    activeItem * (isMobile ? BUTTON_WIDTH_PX_MOBILE : BUTTON_WIDTH_PX) +
    activeItem * BUTTON_MARGIN_PX * 2 +
    BUTTON_MARGIN_PX

  return (
    <SelectWrapper style={props.style}>
      <AnimatedBackground style={{ left: `${activeXOffset}px` }} />
      <ul>
        {props.options.map((option, key) => (
          <li
            key={option[trackBy]}
            value={option[trackBy]}
            className={key === activeItem ? 'active' : ''}
            onClick={() => onSelectValue(key)}>
            {option[searchBy]}
          </li>
        ))}
      </ul>
    </SelectWrapper>
  )
}

export default MultiSwitch

const SelectWrapper = styled.div((props) => ({
  display: 'flex',
  background: props.theme.palette.background.secondary,
  border: `1px solid ${props.theme.palette.border.light}`,
  borderRadius: '126px',
  width: 'fit-content',
  position: 'relative',
  userSelect: 'none',
  ul: {
    display: 'flex',
    listStyleType: 'none',

    li: {
      zIndex: 10,
      padding: '10.5px 0',
      borderRadius: '92px',
      minWidth: `${BUTTON_WIDTH_PX}px`,
      textAlign: 'center',
      fontSize: '14px',
      textTransform: 'uppercase',
      fontWeight: '600',
      margin: `${BUTTON_MARGIN_PX}px`,
      color: props.theme.palette.text.secondary,
      cursor: 'pointer',
      backgroundColor: 'none'
    }
  },

  '.active': {
    color: props.theme.palette.button.text,
    zIndex: 10
  },

  [Media.phone]: {
    marginLeft: 'auto',
    marginRight: 'auto',
    ul: {
      li: {
        fontSize: '12px',
        minWidth: `${BUTTON_WIDTH_PX_MOBILE}px`
      }
    }
  }
}))

const AnimatedBackground = styled.div({
  width: `${BUTTON_WIDTH_PX}px`,
  height: '42px',
  borderRadius: '92px',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: `${BUTTON_MARGIN_PX}px`,
  background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
  backgroundColor: '#7a3bfe',
  transition: `${ANIMATION_DURATION_MS}ms ease`,
  zIndex: 8,
  pointerEvents: 'none',
  [Media.phone]: {
    width: `${BUTTON_WIDTH_PX_MOBILE}px`
  }
})
