import React from 'react'
import styled from 'styled-components'

const Container: FC = ({ children, className }) => (
  <div className={className}>{children}</div>
)

const StyledContainer = styled(Container)`
  display: flex;
  flex: 1;
  margin: 20px;
`
export { StyledContainer as Container }
