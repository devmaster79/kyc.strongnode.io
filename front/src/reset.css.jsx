import { Global, css } from '@emotion/react'

export const GlobalStyle = () => {
  return (
    <Global
      styles={css({
        '*': {
          margin: 0,
          padding: 0,
          outline: 0,
          textDecoration: 'none',
          boxSizing: 'border-box'
        },
        body: {
          fontSize: '16px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Satoshi-Regular, Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          color: ' #333',
          background: '#f3f5f9',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale'
        }
      })}
    />
  )
}
