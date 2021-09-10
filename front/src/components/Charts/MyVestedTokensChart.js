import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
import { useTheme, styled } from '@material-ui/core/styles'
// import { fNumber } from '../../../utils/formatNumber';
//
import BaseOptionChart from './BaseOptionChart'


const CHART_DATA = [78343, 44313]

export default function AppCurrentDownload() {
  const theme = useTheme()

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    stroke: { colors: [theme.palette.background.paper] },
    tooltip: {
      fillSeriesColor: false,
      y: {
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        },
      },
    },
  })

  return (
      <ReactApexChart
        type="donut"
        series={CHART_DATA}
        options={chartOptions}
        width={160}
        height={160}
      />
  )
}
