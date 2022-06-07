import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Media from 'theme/mediaQueries'

export type MultiSwitchProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option
> = {
  options: Option[]
  /** the column that the MultiSwitch will use as value */
  trackBy: TrackBy
  /** the column that the MultiSwitch will show */
  searchBy: keyof Option
  value: Option
  onChange: (selectedValue: Option) => void
}

function MultiSwitch<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option
>(props: MultiSwitchProps<Option, TrackBy>) {
  const [activeXOffset, setActiveXOffset] = useState<string>('3px')
  const [windowSize, setWindowSize] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const onSelectValue = async (selectedValue: string) => {
    const selectedIndex = props.options.findIndex(
      (option) => option[props.searchBy] === selectedValue
    )
    setXOffset(selectedIndex)

    // waits until the animation gets done
    await new Promise((resolve) => setTimeout(resolve, 350))

    props.onChange(props.options[selectedIndex])
  }

  const animMarginOffset = 6
  const animBaseMarginOffset = 3

  const setXOffset = (index: number) => {
    const animWidthOffset = windowSize > 600 ? 132 : 112
    // console.log('window.innerHeight:::', windowSize)
    setActiveXOffset(
      index * animWidthOffset +
        index * animMarginOffset +
        animBaseMarginOffset +
        'px'
    )
  }

  return (
    <SelectWrapper>
      <AnimatedBackground style={{ left: activeXOffset }} />
      <ul>
        {props.options.map((option) => (
          <li
            key={option[props.trackBy]}
            value={option[props.trackBy]}
            className={
              props.value &&
              option[props.trackBy] === props.value[props.trackBy]
                ? 'active'
                : ''
            }
            onClick={() => {
              onSelectValue(option[props.searchBy])
            }}>
            {option[props.searchBy]}
          </li>
        ))}
      </ul>
    </SelectWrapper>
  )
}

MultiSwitch.defaultProps = {
  trackBy: 'value',
  searchBy: 'label'
}

export default MultiSwitch

const SelectWrapper = styled.div((props) => ({
  display: 'flex',
  background: props.theme.palette.background.secondary,
  border: `1px solid ${props.theme.palette.border.light}`,
  borderRadius: '126px',
  width: 'fit-content',
  position: 'relative',

  ul: {
    display: 'flex',
    listStyleType: 'none',

    li: {
      padding: '14px 0',
      borderRadius: '92px',
      minWidth: '132px',
      [Media.phone]: {
        minWidth: '112px'
      },
      textAlign: 'center',
      fontSize: '14px',
      textTransform: 'uppercase',
      fontWeight: '400',
      margin: '3px',
      color: props.theme.palette.text.secondary,
      cursor: 'pointer',
      backgroundColor: 'none',
      transition: '500ms background-color'
    }
  },

  '.active': {
    background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
    backgroundColor: '#7a3bfe',
    color: props.theme.palette.button.text,
    zIndex: 10
  }
}))

const AnimatedBackground = styled.div({
  width: '132px',
  height: '49px',
  borderRadius: '92px',
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: '3px',
  background: 'linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%)',
  backgroundColor: '#7a3bfe',
  transition: '250ms ease',
  zIndex: 8,
  pointerEvents: 'none',
  [Media.phone]: {
    width: '112px'
  }
})
