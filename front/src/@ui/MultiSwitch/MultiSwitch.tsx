import styled from '@emotion/styled'
import { useState } from 'react'

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

  const onSelectValue = async (selectedValue: string) => {
    const selectedIndex = props.options.findIndex(
      (option) => option[props.searchBy] === selectedValue
    )
    setXOffset(selectedIndex)

    // waits until the animation gets done
    await new Promise((resolve) => setTimeout(resolve, 350))

    props.onChange(props.options[selectedIndex])
  }

  const animWidthOffset = 132
  const animMarginOffset = 6
  const animBaseMarginOffset = 3

  const setXOffset = (index: number) => {
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

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  background: ${(props) => props.theme.palette.background.secondary};
  border: 1px solid ${(props) => props.theme.palette.border.light};
  border-radius: 126px;
  width: fit-content;
  padding: 3px;

  ul {
    display: flex;
    list-style-type: none;

    li:first-child {
      margin-left: 0;
    }

    li {
      padding: 14px 0;
      border-radius: 92px;
      min-width: 132px;
      text-align: center;
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 400;
      color: ${(props) => props.theme.palette.text.secondary};
      cursor: pointer;
      margin-left: 6px;
      z-index: 10;
    }
  }

  .active {
    color: ${(props) => props.theme.palette.button.text};
  }
`

const AnimatedBackground = styled.div`
  width: 132px;
  height: 49px;
  border-radius: 92px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 3px;
  background: linear-gradient(90.39deg, #aa1fec 0.24%, #7a3bfe 101.6%);
  background-color: #7a3bfe;
  transition: 250ms ease;
  z-index: 8;
  pointer-events: none;
`
