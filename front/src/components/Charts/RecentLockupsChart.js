import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import Stack from '@material-ui/core/Stack';
import { useTheme } from '@material-ui/core/styles';
import BaseOptionChart from './BaseOptionChart';

const Lockup1 = [80];
const Lockup2 = [65];

export default function AppCurrentDownload() {
  const theme = useTheme();

  const chartOptions1 = merge(BaseOptionChart(), {
    colors: ['#26A5C0'],
    labels: 'Mens',
    fill: {
      type: ['gradient'],
      gradient: {
        type: ['diagonal2'],
        shadeIntensity: 0.5,
        gradientToColors: ['#2EF3C0'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'straight'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/images/lock1.png',
          size: '15%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false
        },
        dataLabels: {
          value: { offsetY: 16 }
        }
      }
    }
  });

  const chartOptions2 = merge(BaseOptionChart(), {
    colors: ['#5137FA'],
    labels: 'Mens',
    fill: {
      type: ['gradient'],
      gradient: {
        type: ['diagonal2'],
        shadeIntensity: 0.5,
        gradientToColors: ['#7BDAD0'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'straight'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/images/lock2.png',
          size: '15%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false
        },
        dataLabels: {
          value: { offsetY: 16 }
        }
      }
    }
  });

  const chartOptions3 = merge(BaseOptionChart(), {
    colors: ['#604BE8'],
    labels: 'Mens',
    fill: {
      type: ['gradient'],
      gradient: {
        type: ['diagonal2'],
        shadeIntensity: 0.5,
        gradientToColors: ['#B74BE8'],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'straight'
    },
    plotOptions: {
      radialBar: {
        hollow: {
          image: '/images/lock3.png',
          size: '15%',
          imageWidth: 20,
          imageHeight: 20,
          margin: 5,
          imageClipped: false
        },
        dataLabels: {
          value: { offsetY: 16 }
        }
      }
    }
  });

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
  );
}
