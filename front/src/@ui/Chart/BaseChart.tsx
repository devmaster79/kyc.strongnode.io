import { useState, useEffect } from 'react'
import styled from '@emotion/styled/macro'
import {
  AreaChart,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ResponsiveContainer
} from 'recharts'

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
`

export type RechartCompatibleKey<Data> = Exclude<keyof Data, symbol>
export type XAxisFormat = 'days' | 'weeks' | 'months' | 'years'
export type BaseChartProps<
  Item extends Record<string, unknown>,
  ChartKey extends RechartCompatibleKey<Item>
> = {
  data: (Item & { [i in ChartKey]: { toString: () => string } })[]
  xKey: RechartCompatibleKey<Item>
  xAxisFormat?: XAxisFormat
  yKey: RechartCompatibleKey<Item>
  chartKey: ChartKey
}

export const BaseChart = <
  Item extends Record<string, unknown>,
  ChartKey extends RechartCompatibleKey<Item>
>(
  props: BaseChartProps<Item, ChartKey>
) => {
  const [yAxisWidth, setYAxisWidth] = useState<number | undefined>(undefined)

  const formatTimestamp = (tickItem: string) => {
    if (!props.xAxisFormat || isNaN(parseInt(tickItem))) {
      return tickItem
    }

    switch (props.xAxisFormat) {
      case 'days':
      case 'weeks':
        return new Intl.DateTimeFormat('en-Us', { weekday: 'short' }).format(
          new Date(tickItem)
        )

      case 'months':
        return new Intl.DateTimeFormat('en-Us', { month: 'short' }).format(
          new Date(tickItem)
        )

      case 'years':
        return new Intl.DateTimeFormat('en-Us', { year: 'numeric' }).format(
          new Date(tickItem)
        )
    }
  }

  useEffect(() => {
    const calculateYAxisWidth = (data: Item[]) => {
      return data
        .map((c) => (c[props.chartKey] as typeof toString).toString())
        .reduce(
          (acc: number, cur: string | string[]) =>
            cur.length > acc ? cur.length : acc,
          0
        )
    }
    setYAxisWidth(calculateYAxisWidth(props.data))
  }, [props.data, props.chartKey])

  const tooltipWrapperStyle = {
    background: 'red'
  }

  return (
    <ChartWrapper>
      <ResponsiveContainer>
        <AreaChart
          data={props.data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#AA1FEC" stopOpacity={1} />
              <stop offset="95%" stopColor="#AA1FEC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            minTickGap={60}
            tickFormatter={formatTimestamp}
            tickLine={false}
            axisLine={false}
            padding={{ left: 16, right: 16 }}
            dataKey={props.xKey}
          />
          <YAxis
            width={yAxisWidth ? yAxisWidth + 42 : yAxisWidth}
            tickLine={false}
            axisLine={false}
            dataKey={props.yKey}
          />
          <CartesianGrid vertical={false} stroke="rgba(153, 153, 153, 0.12)" />

          <Tooltip
            wrapperStyle={tooltipWrapperStyle}
            contentStyle={{ display: 'none' }}
          />
          <Area
            key={1}
            type="monotone"
            dataKey={props.chartKey}
            stroke="#AA1FEC"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
