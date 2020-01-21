import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './global-style'
import Uploader from './components/uploader'
import { Header } from './components/shared/header'
import { Container } from './components/shared/container'

console.info(`⚛️ ${React.version}`)

const App = () => {
  const [url, setUrl] = useState(null)

  const fileChangeHandler = useCallback(
    (url) => {
      setUrl(url)
    },
    [setUrl]
  )

  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>
        <Uploader value={url} onChange={fileChangeHandler} />
      </Container>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

module.hot && module.hot.accept()
