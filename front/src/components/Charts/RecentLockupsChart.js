import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
import { Stack } from '@material-ui/core'
import { useTheme, styled } from '@material-ui/core/styles'
// import { fNumber } from '../../../utils/formatNumber';
//
import BaseOptionChart from './BaseOptionChart'

const Lockup1 = [90, 90]
const Lockup2 = [70, 70]

export default function AppCurrentDownload() {
  const theme = useTheme()

  const chartOptions1 = merge(BaseOptionChart(), {
    colors: [theme.palette.secondary.main, theme.palette.secondary.main],
    labels: ['Mens', 'Womens'],
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/icons/lock1.svg',
          size: '26%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false,
        },
        dataLabels: {
          value: { offsetY: 16 },
        },
      },
    },
  })

  const chartOptions2 = merge(BaseOptionChart(), {
    colors: [theme.palette.warning.main, theme.palette.warning.main],
    labels: ['Mens', 'Womens'],
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/icons/lock2.svg',
          size: '26%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false,
        },
        dataLabels: {
          value: { offsetY: 16 },
        },
      },
    },
  })

  const chartOptions3 = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.main, theme.palette.primary.main],
    labels: ['Mens', 'Womens'],
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/icons/lock3.svg',
          size: '26%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false,
        },
        dataLabels: {
          value: { offsetY: 16 },
        },
      },
    },
  })

  return (
    <Stack direction="row" justifyContent="space-around">
      <ReactApexChart
        type="radialBar"
        series={Lockup1}
        options={chartOptions1}
        width={100}
        height={140}
      />
      <ReactApexChart
        type="radialBar"
        series={Lockup1}
        options={chartOptions2}
        width={100}
        height={140}
      />
      <ReactApexChart
        type="radialBar"
        series={Lockup2}
        options={chartOptions3}
        width={100}
        height={140}
      />
    </Stack>
  )
}
