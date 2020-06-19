import styled from 'styled-components'

export const Linear = styled.div`
  width: 600px;
  height: 180px;
`

export const ProgressText = styled.div`
  width: 100%;
  margin: 20px 0;
  font-size: 26px;
  color: whitesmoke;
  text-align: center;
`

export const ProgressContainer = styled.div`
  width: 100%;
  height: 14px;
  background: #b3b3b3;
  padding: 1px 1px;
  box-sizing: border-box;
`

export const ProgressBar = styled.div(
  ({ fillPercentage }) => `
  width: ${fillPercentage}%;
  height: 12px;
  background: green;
`,
)
