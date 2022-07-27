import { ComponentProps, useEffect, useRef } from 'react'
import InputField from './InputField'

interface RequiredFields {
  inputProps: {
    onChange: (e: string) => void
    value: string
  }
}

function formatDateString(value: string) {
  return value
    .replace(/[^0-9]/g, '')
    .replace(/^(.{4})/, '$1-')
    .replace(/^(.{7})/, '$1-')
    .slice(0, 10)
}

function padDateWithPlaceholder(value: string) {
  const placeholder = 'YYYY-MM-DD'
  return value + placeholder.slice(value.length, placeholder.length)
}

export const DateInput = (
  props: ComponentProps<typeof InputField> & RequiredFields
) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const value = formatDateString(props.inputProps.value)
  const valueWithPlaceholder = padDateWithPlaceholder(value)
  useEffect(() => {
    if (ref.current === null) return

    // move selection to the last number after an update
    const lastNumber = value.replace(/-+$/, '').length
    ref.current.setSelectionRange(lastNumber, lastNumber)
  }, [value])

  return (
    <InputField
      {...props}
      inputProps={{
        ...props.inputProps,
        ref,
        onChange: (e) => {
          const date = formatDateString(e.target.value)
          props.inputProps.onChange(padDateWithPlaceholder(date))
        },
        value: valueWithPlaceholder,
        style: {
          fontFamily: 'monospace'
        }
      }}
    />
  )
}
