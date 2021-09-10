import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
import { useTheme, styled } from '@material-ui/core/styles'
// import { fNumber } from '../../../utils/formatNumber';
//
import BaseOptionChart from './BaseOptionChart'

export default function AppCurrentDownload() {
  const theme = useTheme()
  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.warning.main,
    ],
    chart: { animations: { enabled: true }, sparkline: { enabled: true } },
    stroke: { width: 2, dashArray: [0, 6] },
    tooltip: {
      x: { show: false },
      y: {
        // formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
      marker: { show: false },
    },
  })
  const CHART_DATA = [{ data: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43, 88, 78] }, { data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47] }]

  return (
    <ReactApexChart
      type="line"
      series={CHART_DATA}
      options={chartOptions}
      width="100%"
      height={30}
      style={{ marginTop: 42 }}
    />
  )
}
