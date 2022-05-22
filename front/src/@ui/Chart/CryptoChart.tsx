import React, { useEffect, useState } from 'react'
import { BaseChart, XAxisFormat } from './BaseChart'
import styled from '@emotion/styled/macro'
import cryptoDataService from '../../services/cryptoDataService'
import { ValueTrendIndicator } from './ValueTrendIndicator'
import { ChartScopeSelector, SelectorItem } from './ChartScopeSelector'
import MultiSwitch from '@ui/MultiSwitch/MultiSwitch'

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

type SwitchOption = {
  label: string
  value: number
}

type ChartDataType = Array<{ timestamp: string; value: string }>

export const CryptoChart = (props: CryptoChartProps) => {
  const [chartScopeFormat, setChartScopeFormat] = useState<XAxisFormat>('days')
  const [chartData, setChartData] = useState<ChartDataType>([])
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

  const [switchOptions] = useState([
    { label: 'Price', value: 1 },
    { label: 'Market Cap', value: 2 },
    { label: 'Trading View', value: 3 }
  ] as SwitchOption[])

  const [selectedSwitchOption, setSelectedSwitchOption] =
    useState<SwitchOption>()

  useEffect(() => {
    const loadStrongnodeCurrency = async () => {
      const data = await cryptoDataService.getChartDataAsync(chartScopeFormat)
      const tempData: ChartDataType = []

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
      setChartData(tempData)
    }
    // init load
    loadStrongnodeCurrency()

    const refreshDataInterval = setInterval(() => {
      loadStrongnodeCurrency()
    }, 10000)
    setSelectedSwitchOption(switchOptions[0])

    return () => clearInterval(refreshDataInterval)
  }, [chartScopeFormat, targetCurrency, switchOptions])

  return (
    <div style={props.wrapperStyles}>
      <HeadingWrapper>
        <div>
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
        </div>
        {switchOptions && selectedSwitchOption && (
          <MultiSwitch
            options={switchOptions}
            value={selectedSwitchOption}
            onChange={(option) => {
              setSelectedSwitchOption(option)
            }}
          />
        )}
        <ChartScopeSelector selectors={chartSelectors} />
      </HeadingWrapper>
      <BaseChart
        xAxisFormat={chartScopeFormat}
        data={chartData || placeholderData}
        xKey="timestamp"
        yKey="value"
        chartKey="value"
      />
    </div>
  )
}

const CryptoPair = styled.div({
  width: 'max-content'
})

const HeadingWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

const Pair = styled.div({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '100%',
  textTransform: 'uppercase',
  marginBottom: '8px',
  opacity: '0.4'
})

const TrendPairWrapper = styled.div({
  marginTop: '8px',
  marginBottom: '32px',

  div: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '24px'
  },

  'div:first-child': {
    marginLeft: '0px'
  }
})
