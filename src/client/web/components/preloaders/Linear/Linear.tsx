import React from 'react'

import { Container, Row, Col } from 'styled-bootstrap-grid'

import * as Styled from './styles'

export default function HomeRoute(props) {
  return (
    <Styled.Linear>
      <Styled.ProgressText>
        {props.title} ( {props.current} / {props.max} )
      </Styled.ProgressText>
      <Styled.ProgressContainer>
        <Styled.ProgressBar fillPercentage={Math.round((100 * props.current) / props.max)} />
      </Styled.ProgressContainer>
    </Styled.Linear>
  )
}
