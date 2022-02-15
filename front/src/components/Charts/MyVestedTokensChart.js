import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@material-ui/core/styles';
// import { fNumber } from '../../../utils/formatNumber';
//
import BaseOptionChart from './BaseOptionChart';

const CHART_DATA = [10, 10];

export default function AppCurrentDownload(props) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: ['#604BE8', '#DA50CA'],
    stroke: { colors: [theme.palette.background.paper] },
    tooltip: {
      fillSeriesColor: false,
      y: {
        title: {
          formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    fill: {
      type: ['gradient', 'gradient'],
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#FE6666', '#2ED7C6'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '40%'
        }
      }
    }
  });

  return (
    <ReactApexChart
      type="donut"
      series={props.chartData}
      options={chartOptions}
      width={140}
      height={140 + Math.random()}
    />
  );
}
