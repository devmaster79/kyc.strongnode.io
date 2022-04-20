import styled from '@emotion/styled'

export function ProgressLine() {
  return (
    <Container>
      <Line />
    </Container>
  )
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  opacity: 0.12;
`

export const Line = styled.div`
  border: 1px solid #fff;
  width: 83px;
`
