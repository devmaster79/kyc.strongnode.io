## Description

@emotion/styled package does not have .attrs function as styled-component have. But it is useful for a lot of cases.
This withAttrs HOC tries to achieve this.

## Usage example

```tsx
export const Input = withAttrs(
  styled(InputField)`
    background: rgba(255, 255, 255, 0.08);
  `,
  {
    type: 'password'
  }
)
```
