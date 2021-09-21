import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    text-decoration: none;
    box-sizing: border-box;
  }

  body {
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Inter','Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    color: #333;
    background: #F3F5F9;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .PhoneInputInput, .PhoneInputCountrySelect {
    font-size: 20px;
  }
  .PhoneInputInput {
    padding: 10px;
    border: 1px solid #e0e6e8;
    border-radius: 6px;
  }
`