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
    font-size: 18px;
  }
  .PhoneInputInput {
    width : 220px;
    padding: 16px 20px;
    border-radius: 6px;
    background: rgba(238, 238, 238, 0.0001);
    border: 1px solid #1DF4F6;
    box-sizing: border-box;
    box-shadow: inset 0px 10px 10px rgba(0, 0, 0, 0.25);
    &::placeholder {
      color: rgba(255,255,255, 0.5);
      font-size: 18px;
    }
  }
`