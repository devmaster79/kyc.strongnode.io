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

const OptionsWrapper = styled.div`
  background: ${(props) => props.theme.palette.background.secondary};
  border: 1px solid ${(props) => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 10px;
  min-width: 483px;

  color: ${(props) => props.theme.palette.text.secondary};
  text-align: left;
  padding: 24px;

  position: absolute;
  margin-top: 10px;

  ul {
    list-style-type: none;
    font-size: 12px;
    text-transform: uppercase;

    & > li:not(:first-child) {
      padding-top: 16px;
    }

    & > li > ul {
      font-size: 16px;
      font-family: 'Satoshi-Variable';
      font-style: normal;
      font-weight: 900;
      text-transform: none;
      color: ${(props) => props.theme.palette.text.primary};
      padding-top: 16px;

      li {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    }

    li {
      cursor: pointer;
    }
  }
`
