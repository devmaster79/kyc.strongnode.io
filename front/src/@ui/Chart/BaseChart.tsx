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

const ChartWrapper = styled.div({
  width: '100%',
  height: '500px'
})

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

  const formatLabel = (label: string) => {
    if (!props.xAxisFormat || isNaN(parseInt(label))) {
      return label
    }
    return new Intl.DateTimeFormat('en-Us').format(new Date(label))
  }

  // todo add YAxis format to props and then work with it
  const formatTooltipValue = (value: string) => {
    return Number(value).toFixed(6) + ' $'
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
              <stop offset="30%" stopColor="#AA1FEC" stopOpacity={1} />
              <stop offset="100%" stopColor="#AA1FEC" stopOpacity={0} />
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
          <CartesianGrid
            vertical={true}
            verticalFill={['transparent', 'rgba(217, 217, 217, 0.25)']}
            stroke="rgba(153, 153, 153, 0.12)"
          />

          <Tooltip
            labelFormatter={formatLabel}
            formatter={formatTooltipValue}
            wrapperStyle={tooltipWrapperStyle}
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
