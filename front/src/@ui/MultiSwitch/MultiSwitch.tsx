import styled from '@emotion/styled'
import { MouseEvent } from 'react'

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
  function onSelectValue(event: MouseEvent<HTMLLIElement>): void {
    const selectedOption = props.options.find((option) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const target: { value: Option[TrackBy] } = event.target as any
      return option[props.trackBy].toString() === target.value.toString()
    })
    if (selectedOption) {
      props.onChange(selectedOption)
    }
  }

  return (
    <SelectWrapper>
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
            onClick={onSelectValue}>
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

  ul: {
    display: 'flex',
    listStyleType: 'none',

    li: {
      padding: '14px 0',
      borderRadius: '92px',
      minWidth: '132px',
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
    color: props.theme.palette.button.text
  }
}))
