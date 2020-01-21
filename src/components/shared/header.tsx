import React from 'react'
import styled from 'styled-components'

import { Colors, FontSizes, FontWeights } from '../../lib/style-guide'

const Header: FC = ({ className }) => (
  <header className={className}>
    <h1>Company Logo</h1>
    <p>Logo should be square, 100px size and in png, jpeg file format.</p>
  </header>
)

const StyledHeader = styled(Header)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 79px;
  background: ${Colors.PureWhite};
  border-bottom: 1px solid ${Colors.BG2};
  box-sizing: border-box;
  padding: 0px 29px;

  h1 {
    font-weight: ${FontWeights.HB};
    ${FontSizes.xlarge}
    line-height: 20px;
    color: ${Colors.TX1};
  }

  p {
    ${FontSizes.medium}
    line-height: 12px;
    display: flex;
    align-items: center;
    color: ${Colors.TX3};
  }
`
export { StyledHeader as Header }
