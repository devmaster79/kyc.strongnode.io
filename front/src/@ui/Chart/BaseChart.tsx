import React, { useState, useEffect } from "react";
import styled from '@emotion/styled/macro';
import {
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer
} from 'recharts';

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
`;

type BaseChartProps = {
  data: Array<Object>,
  xKey: string,
  yKey: string,
  chartKey: string
}

export const BaseChart = (props: BaseChartProps) => {
  const [yAxisWidth, setYAxisWidth] = useState(undefined)

  const calculateYAxisWidth = (data: any) => {
    return data
      .map((c: { value: any; }) => c.value.toString())
      .reduce((acc: number, cur: string | any[]) => (cur.length > acc ? cur.length : acc), 0)
  }

  useEffect(() => {
    console.log('width is calculated to ' + calculateYAxisWidth(props.data))
    setYAxisWidth(calculateYAxisWidth(props.data))
  }, [props.data])

  const tooltipContentStyle = {
    display: 'none'
  }

  const tooltipWrapperStyle = {
    background: 'red'
  }

  return (
    <ChartWrapper>
      <ResponsiveContainer>
        <AreaChart data={props.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#AA1FEC" stopOpacity={1} />
              <stop offset="95%" stopColor="#AA1FEC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis ticks={['test', 'vest', 'lol']} tickLine={false} axisLine={false} padding={{ left: 16, right: 16 }} dataKey={props.xKey} />
          <YAxis width={(yAxisWidth) ? yAxisWidth + 34 : yAxisWidth} tickLine={false} axisLine={false} dataKey={props.yKey} />
          <CartesianGrid vertical={false} stroke="rgba(153, 153, 153, 0.12)" />

          <Tooltip wrapperStyle={tooltipWrapperStyle} contentStyle={tooltipContentStyle} />
          <Area
            type="monotone"
            dataKey={props.chartKey}
            stroke="#AA1FEC"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
