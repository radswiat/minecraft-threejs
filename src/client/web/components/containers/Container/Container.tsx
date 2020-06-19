import React from 'react'

import { Container, Row, Col } from 'styled-bootstrap-grid'

import * as Styled from './styles'

export default function HomeRoute(props) {
  return (
    <Styled.Container>
      <Container>
        <Row>{props.children}</Row>
      </Container>
    </Styled.Container>
  )
}
