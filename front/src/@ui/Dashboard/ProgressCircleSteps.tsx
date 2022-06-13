import styled from '@emotion/styled'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useTheme } from '@mui/material/styles'
import { CustomTheme } from 'theme'
import Media from './../../theme/mediaQueries'
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
  paddingBottom: '98px',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  [Media.phone]: {
    paddingTop: '10px',
    paddingBottom: '30px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start '
  },
  [Media.tablet]: {
    width: '100%'
  }
})

export function Step(props: ProgressCircleProps) {
  const { label, progressAmount, progressLabel, progressBorder, disabled } =
    props
  const percentage = progressAmount

  const theme: CustomTheme = useTheme()

  const Container = styled.div<{
    disabled: boolean
  }>((props) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: props.disabled ? 'no-drop' : 'pointer',
    opacity: props.disabled ? '0.4' : '1'
  }))

  const ProgressContainer = styled.div<{
    border: boolean
  }>((props) => ({
    display: 'block',
    width: '96px',
    height: '96px',
    border: props.border ? '3px solid transparent' : '0px',
    borderRadius: '50%',
    fontFamily: 'Satoshi-Variable',
    fontStyle: 'normal',
    fontWeight: 900,
    fontSize: '14px',
    lineHeight: '14px',
    margin: '0px 18px 0px 18px',

    background: `linear-gradient(
      ${props.border ? '#AA1FEC' : '#13124A'},
      ${props.border ? '#AA1FEC' : '#13124A'}
    ),
    padding-box,
  linear-gradient(
      to bottom,
      ${props.border ? '#AA1FEC' : '#13124A'},
      ${props.border ? '#1FC7EC' : '#13124A'}
    )
    border-box`,
    [Media.tablet]: {
      width: '84px',
      height: '84px',
      margin: '0px 8px'
    },
    [Media.phone]: {
      width: '72px',
      height: '72px'
    }
  }))

  const Label = styled.p((props) => ({
    fontFamily: 'Satoshi-Variable',
    fontStyle: 'regular',
    fontWeight: '400',
    fontSize: '12px',
    fontColor: props.theme.palette.text.primary,
    lineHeight: '14px',
    textAlign: 'center',
    opacity: 0.6,
    marginTop: '8px'
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
            pathColor: progressBorder ? '#13124A' : '#AA1FEC',
            trailColor: progressBorder
              ? theme.palette.progressCircle.trailColorPrimary
              : theme.palette.progressCircle.trailColorSecondary,
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
    justifyContent: 'center',
    marginBottom: '40px',
    height: '96px',
    opacity: '0.12',
    [Media.phone]: {
      height: '72px !important'
    },
    [Media.tablet]: {
      height: '84px'
    }
  })

  const Line = styled.div({
    border: '1px solid #fff',
    width: '83px',

    [Media.tablet]: {
      width: '48px'
    },
    [Media.phone]: {
      width: '24px'
    }
  })

  return (
    <Container>
      <Line />
    </Container>
  )
}
