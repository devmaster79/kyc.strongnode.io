import React, { useEffect, useState } from 'react'
import { BaseChart, XAxisFormat } from './BaseChart'
import styled from '@emotion/styled/macro'
import cryptoDataService from '../../services/cryptoDataService'
import { ValueTrendIndicator } from './ValueTrendIndicator'
import { ChartScopeSelector, SelectorItem } from './ChartScopeSelector'

// sample placeholder data
const placeholderData = [
  {
    timestamp: 1637884800000,
    value: 0.007622691925608518
  },
  {
    timestamp: 1637971200000,
    value: 0.007554651042435728
  },
  {
    timestamp: 1638057600000,
    value: 0.007328889506987581
  }
]

type CryptoChartProps = {
  coin: string
  wrapperStyles: object
}

interface ValueWithTimeStamp {
  timestamp: string
  value: string
}

export const CryptoChart = (props: CryptoChartProps) => {
  const [chartScopeFormat, setChartScopeFormat] = useState<XAxisFormat>('days')
  const [chartDataTemp, setChartDataTemp] = useState<Array<ValueWithTimeStamp>>(
    []
  )
  const [cryptoCurrency] = useState('SNE')
  const [targetCurrency] = useState('USD')

  const [valueTrendIndicator, setValueTrendIndicator] = useState({
    up: false,
    value: '20%'
  })

  const onScopeChange = (scopeFormat: XAxisFormat) => {
    setChartScopeFormat(scopeFormat)
  }

  const chartSelectors = [
    {
      title: 'days',
      handler: onScopeChange
    },
    {
      title: 'weeks',
      handler: onScopeChange
    },
    {
      title: 'months',
      handler: onScopeChange
    },
    {
      title: 'years',
      handler: onScopeChange
    }
  ] as SelectorItem[]

  useEffect(() => {
    const loadStrongnodeCurrency = async () => {
      const data = await cryptoDataService.getChartDataAsync(chartScopeFormat)
      const tempData: Array<ValueWithTimeStamp> = []

      data.data.prices.forEach((price: Array<string>) => {
        tempData.push({
          timestamp: price[0],
          value: price[1]
        })
      })

      setValueTrendIndicator({
        value:
          Number(tempData[tempData.length - 1].value).toFixed(6) +
          ' ' +
          targetCurrency,
        up: tempData[tempData.length - 1].value > tempData[0].value
      })
      setChartDataTemp(tempData)
    }
    // init load
    loadStrongnodeCurrency()

    const refreshDataInterval = setInterval(() => {
      loadStrongnodeCurrency()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [chartScopeFormat, targetCurrency])

  return (
    <div style={props.wrapperStyles}>
      <ChartScopeSelector
        style={{ float: 'right' }}
        selectors={chartSelectors}
      />
      <CryptoPair>
        <Pair>
          {cryptoCurrency}/{targetCurrency}
        </Pair>
      </CryptoPair>
      <TrendPairWrapper>
        <ValueTrendIndicator
          value={valueTrendIndicator.value}
          up={valueTrendIndicator.up}
        />
      </TrendPairWrapper>
      <BaseChart
        xAxisFormat={chartScopeFormat}
        data={chartDataTemp || placeholderData}
        xKey="timestamp"
        yKey="value"
        chartKey="value"
      />
    </div>
  )
}

const CryptoPair = styled.div`
  width: max-content;
`

const Pair = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  text-transform: uppercase;
  margin-bottom: 8px;
  opacity: 0.4;
`

const TrendPairWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 32px;

  div {
    display: inline-block;
    vertical-align: middle;
    margin-left: 24px;
  }

  div:first-child {
    margin-left: 0px;
  }
`
