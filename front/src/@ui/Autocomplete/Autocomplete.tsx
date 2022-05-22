import InputField from '@ui/Input/InputField'
import React, { ChangeEvent, useState, MouseEvent } from 'react'
import styled from '@emotion/styled'

export type AutocompleteProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option,
  Category extends Record<string, Option[]>
> = {
  options: Category
  /** the column that the Autocomplete will use as value */
  trackBy: TrackBy
  /** the column that the Autocomplete will show */
  searchBy: keyof Option
  /** function that will fetch new options */
  fetchOptions: (searchQuery: string) => void
  onSelectValue?: (selectedOption: EventTarget) => void
  customStyle?: (option: Option) => React.ReactNode
}

function Autocomplete<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Option extends Record<string, any>,
  TrackBy extends keyof Option,
  Category extends Record<string, Option[]>
>(props: AutocompleteProps<Option, TrackBy, Category>) {
  const [search, setSearch] = useState('')

  function onChangeValue(event: ChangeEvent<HTMLInputElement>) {
    props.fetchOptions(event.target.value)
    setSearch(event.target.value)
  }

  function onSelectValue(event: MouseEvent<HTMLLIElement>): void {
    if (!props.onSelectValue) return
    props.onSelectValue(event.target)
  }

  return (
    <>
      <InputField
        icon="search"
        inputProps={{
          placeholder: 'Search',
          value: search,
          onChange: onChangeValue
        }}
      />
      {props.options && (
        <OptionsWrapper>
          <ul>
            {Object.keys(props.options).map((key, index) => (
              <li key={index}>
                {key}
                <ul>
                  {props.options[key].map((option) => (
                    <li
                      key={option[props.trackBy]}
                      value={option[props.trackBy]}
                      onClick={onSelectValue}>
                      {props.customStyle
                        ? props.customStyle(option)
                        : option[props.searchBy]}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </OptionsWrapper>
      )}
    </>
  )
}

export default Autocomplete

Autocomplete.defaultProps = {
  trackBy: 'value',
  searchBy: 'label'
}

const OptionsWrapper = styled.div((props) => ({
  background: `${props.theme.palette.background.secondary}`,
  border: `1px solid ${props.theme.palette.border.light}`,
  boxSizing: 'border-box',
  borderRadius: '10px',
  minWidth: '483px',
  color: `${props.theme.palette.text.secondary}`,
  textAlign: 'left',
  padding: '24px',

  position: 'absolute',
  marginTop: '10px',

  ul: {
    listStyle: 'none',
    fontSize: '12px',
    textTransform: 'uppercase',

    '& > li:not(:first-child)': {
      paddingTop: '16px'
    },

    '& > li > ul': {
      fontSize: '16px',
      fontFamily: 'Satoshi-Variable',
      fontStyle: 'normal',
      fontWeight: '900',
      textTransform: 'none',
      color: `${props.theme.palette.text.primary}`,
      paddingTop: '16px',

      li: {
        paddingTop: '8px',
        paddingBottom: '8px'
      }
    },

    li: {
      cursor: 'pointer'
    }
  }
}))
