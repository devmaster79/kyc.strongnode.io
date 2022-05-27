import styled from '@emotion/styled'
import Icon from '@ui/Icon/Icon'
import { MouseEvent, useState } from 'react'
import { useTheme } from '@mui/styles'
import { CustomTheme } from 'theme'

export type SelectProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option
> = {
  options: Option[]
  /** the column that the Select will use as value */
  trackBy: TrackBy
  /** the column that the Select will show */
  searchBy: keyof Option
  value: Option[TrackBy]
  onChange: (selectedValue: Option) => void
}

function Select<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option
>(props: SelectProps<Option, TrackBy>) {
  const [opened, setOpened] = useState(false)

  function onSelectValue(event: MouseEvent<HTMLLIElement>): void {
    const selectedOption = props.options.find((option) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const target: { value: Option[TrackBy] } = event.target as any
      return option[props.trackBy] === target.value.toString()
    })
    if (selectedOption) {
      props.onChange(selectedOption)
    }
    setOpened(false)
  }
  const theme: CustomTheme = useTheme()

  return (
    <SelectWrapper>
      <HeaderWrapper onClick={() => setOpened(!opened)}>
        <span>{props.value ? props.value[props.searchBy] : 'Select'} </span>
        <Icon
          name="arrowDown"
          width={8}
          height={6}
          viewBox="0 0 8 6"
          style={
            opened
              ? { transform: 'rotate(180deg)', transition: '450ms ease' }
              : { transition: '450ms ease' }
          }
          color={theme.palette.text.primary}
        />
      </HeaderWrapper>
      {opened && (
        <OptionsWrapper>
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
        </OptionsWrapper>
      )}
    </SelectWrapper>
  )
}
export default Select

Select.defaultProps = {
  trackBy: 'value',
  searchBy: 'label'
}

const SelectWrapper = styled.div({
  width: 'fit-content'
})

const HeaderWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',

  span: {
    paddingRight: '8px'
  }
})

const OptionsWrapper = styled.div((props) => ({
  background: props.theme.palette.background.secondary,
  border: `1px solid ${props.theme.palette.border.light}`,
  boxSizing: 'border-box',
  borderRadius: '10px',

  color: props.theme.palette.text.secondary,
  textAlign: 'left',
  padding: '24px',

  position: 'absolute',
  marginTop: '10px',

  '.active': {
    color: props.theme.palette.text.primary
  },

  ul: {
    listStyleType: 'none',

    li: {
      cursor: 'pointer'
    }
  }
}))
