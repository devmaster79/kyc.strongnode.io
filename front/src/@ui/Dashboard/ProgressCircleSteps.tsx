import styled from '@emotion/styled'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useTheme } from '@mui/material/styles'
import { CustomTheme } from 'theme'
interface ProgressCircleProps {
  label: string
  progressAmount: number
  progressLabel: string
  progressBorder: boolean
  disabled: boolean
}

export const Container = styled.div({
  display: 'flex',
  paddingTop: '32px',
  paddingBottom: '128px',

  '@media only screen and (max-width: 600px)': {
    flexDirection: 'column'
  }
})

export function Step(props: ProgressCircleProps) {
  const { label, progressAmount, progressLabel, progressBorder, disabled } =
    props
  const percentage = progressAmount

  const theme: CustomTheme = useTheme()

  const Container = styled.div<{
    disabled: boolean
  }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.disabled ? 'no-drop' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.4' : '1')};

    @media only screen and (max-width: 600px) {
      margin-bottom: 70px;
    }
  `

  const ProgressContainer = styled.div<{
    border: boolean
  }>`
    display: block;
    width: 98px;
    height: 98px;
    border: ${(props) => (props.border ? '3px solid transparent' : '0px')};
    border-radius: 50%;
    background: linear-gradient(
          ${(props) => (props.border ? '#AA1FEC' : '#13124A')},
          ${(props) => (props.border ? '#AA1FEC' : '#13124A')}
        )
        padding-box,
      linear-gradient(
          to bottom,
          ${(props) => (props.border ? '#AA1FEC' : '#13124A')},
          ${(props) => (props.border ? '#1FC7EC' : '#13124A')}
        )
        border-box;
    font-family: 'Satoshi-Variable';
    font-style: normal;
    font-weight: 900;
    font-size: 14px;
    line-height: 14px;
    margin: 0px 19px 16px 19px;
  `
  const Label = styled.p((props) => ({
    fontFamily: 'Satoshi-Variable',
    fontStyle: 'regular',
    fontWeight: '400',
    fontSize: '14px',
    fontColor: `${props.theme.palette.text.primary}`,
    lineHeight: '14px',
    textAlign: 'center',
    opacity: 0.6
  }))
  return (
    <Container disabled={disabled}>
      <ProgressContainer border={progressBorder}>
        <CircularProgressbar
          value={percentage}
          text={progressLabel}
          strokeWidth={24}
          styles={buildStyles({
            textSize: '14px',
            textColor: '#FFF',
            pathColor: `${progressBorder ? '#13124A' : '#AA1FEC'}`,
            trailColor: `${
              progressBorder
                ? theme.palette.progressCircle.trailColorPrimary
                : theme.palette.progressCircle.trailColorSecondary
            }`,
            strokeLinecap: 'butt'
          })}
        />
      </ProgressContainer>
      <Label>{label.toUpperCase()}</Label>
    </Container>
  )
}

export function Separator() {
  const Container = styled.div({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    opacity: '0.12',

    '@media only screen and (max-width: 600px)': {
      transform: 'rotate(90deg)'
    }
  })

  const Line = styled.div({
    border: '1px solid #fff',
    width: '83px'
  })

  return (
    <Container>
      <Line />
    </Container>
  )
}
