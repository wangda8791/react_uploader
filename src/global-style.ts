import { createGlobalStyle } from 'styled-components'
import { FontWeights, Colors } from './lib/style-guide'

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    font-style: normal;
  }

  body, input {
    font-family: proxima-nova, sans-serif;
    font-weight: ${FontWeights.PR};
    font-size: 14px;
    line-height: 1.4rem;
    color: ${Colors.TX1};
  }

  svg, img {
    display: block;
  }

  #root {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    background: ${Colors.PureWhite};
  }

  .hidden {
    display: none;
  }
`
