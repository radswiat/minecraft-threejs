import React from 'react'

import * as Styled from './styles'

export default function App(props) {
  return (
    <Styled.App>
      <Styled.GlobalStyle />
      <>{props.children}</>
    </Styled.App>
  )
}
