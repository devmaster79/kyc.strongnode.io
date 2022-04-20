import styled from '@emotion/styled'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface CircleProgressBarProps {
  amount: number,
  label: string,
  border: boolean
}
export function CircleProgressBar(props: CircleProgressBarProps) {
  const {amount, label, border} = props
  const percentage = amount
  const backgroundColor = border ? '#AA1FEC' : '#13124A'
  const gradientTopColor = border ? '#AA1FEC' : 'none'
  const gradientBottomColor = border ? '#1FC7EC' : 'none'
  const trailColor = border ? '#25136B' : '#251362'
  const pathColor = border ? '#13124A' : '#AA1FEC'

  const Container = styled.div`
    display: block;
    width: 98px;
    height: 98px;
    border: ${border ? '3px solid transparent' : '0px'};
    border-radius: 50%;
    background: linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
    linear-gradient(to bottom, ${gradientTopColor}, ${gradientBottomColor}) border-box;
    font-family: 'Satoshi-Variable';
    font-style: normal;
    font-weight: 900;
    font-size: 14px;
    line-height: 14px;
    margin: 0px 19px 16px 19px;
  `

  return (
    <Container>
      <CircularProgressbar
        value={percentage}
        text={label}
        strokeWidth={24}
        styles={buildStyles({
          textSize: '14px',
          textColor: '#FFF',
          pathColor: `${pathColor}`,
          trailColor: `${trailColor}`,
          strokeLinecap: 'butt',
          // backgroundColor: `${border ? '#AA1FEC' : '#13124A'}`
        })}
      />
    </Container>
  )
}