import React from 'react'
import { Container, Row } from 'styled-bootstrap-grid'

export default function Center(props) {
  return (
    <Container>
      <Row justifyContent='center'>{props.children}</Row>
    </Container>
  )
}
