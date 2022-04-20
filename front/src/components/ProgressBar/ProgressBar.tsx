import styled from '@emotion/styled'
import { CircleProgressBar } from '@ui/ProgressBar/CircleProgressBar'

export interface CircleProgressBarProps {
  label: string,
  progressAmount: number,
  progressLabel: string,
  progressBorder: boolean,
  disable: boolean
}
export function ProgressBar(props: CircleProgressBarProps) {
  const { label, progressAmount, progressLabel, progressBorder, disable } = props
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: ${disable ? 'no-drop' : 'pointer'};
    opacity: ${disable ? '0.4' : '1'};
  `

  const Label = styled.p`
    font-family: 'Satoshi-Variable';
    font-style: regular;
    font-weight: 400;
    font-size: 14px;
    font-color: #fff;
    line-height: 14px;
    text-align: center;
    opacity: 0.6;
  `
  return (
    <Container>
      <CircleProgressBar amount={progressAmount} label={progressLabel} border={progressBorder} />
      <Label>{label.toUpperCase()}</Label>
    </Container>
  )
}
