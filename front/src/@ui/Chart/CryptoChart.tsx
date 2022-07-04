import React, { useEffect, useState } from 'react'
import { BaseChart, XAxisFormat } from './BaseChart'
import styled from '@emotion/styled/macro'
import cryptoDataService from '../../services/cryptoDataService'
import { ValueTrendIndicator } from './ValueTrendIndicator'
import { ChartScopeSelector, SelectorItem } from './ChartScopeSelector'
import Media from 'theme/mediaQueries'

// sample placeholder data
const placeholderData = [
  {
    timestamp: 1637884800000,
    value: 0.007622691925608518
  }
]

type SwitchOption = {
  label: string
  value: number
}

type CryptoChartProps = {
  coin?: string
  wrapperStyles: object
  cryptoCurrency: string
  selectedSwitchOption: SwitchOption
}

type ChartDataType = Array<{ timestamp: number; value: number }>

export const CryptoChart = (props: CryptoChartProps) => {
  const [chartScopeFormat, setChartScopeFormat] = useState<XAxisFormat>('days')
  const [chartData, setChartData] = useState<ChartDataType>([])
  const [targetCurrency] = useState('USD')

  const [valueTrendIndicator, setValueTrendIndicator] = useState({
    up: false,
    value: '0%'
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
      const data = await cryptoDataService.getChartDataAsync(
        chartScopeFormat,
        props.cryptoCurrency.toLowerCase()
      )
      if (data.result === 'success') {
        const typeKey =
          props.selectedSwitchOption.value === 2 ? 'market_caps' : 'prices'

        const coordinates = data.data[typeKey].map((price) => ({
          timestamp: price[0],
          value: price[1]
        }))

        const lastKnownValue = coordinates[coordinates.length - 1].value
        setValueTrendIndicator({
          value: `${lastKnownValue.toFixed(6)} ${targetCurrency}`,
          up: lastKnownValue > coordinates[0].value
        })
        setChartData(coordinates)
      }
    }
    // init load
    loadStrongnodeCurrency()

    const refreshDataInterval = setInterval(() => {
      loadStrongnodeCurrency()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [
    chartScopeFormat,
    targetCurrency,
    props.selectedSwitchOption,
    props.cryptoCurrency
  ])

  return (
    <div style={props.wrapperStyles}>
      <HeadingWrapper>
        <div>
          <CryptoPair>
            <Pair>
              {props.cryptoCurrency}/{targetCurrency}
            </Pair>
          </CryptoPair>
          <TrendPairWrapper>
            <ValueTrendIndicator
              value={valueTrendIndicator.value}
              up={valueTrendIndicator.up}
            />
          </TrendPairWrapper>
        </div>
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
  width: 'max-content',
  transition: '250ms ease'
})

const HeadingWrapper = styled.div({
  display: 'flex',
  paddingRight: '15px',
  marginBottom: '32px',
  alignItems: 'center',
  justifyContent: 'space-between',
  [Media.tablet]: {
    flexWrap: 'wrap'
  }
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

  div: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '24px'
  },

  'div:first-child': {
    marginLeft: '0px'
  },
  [Media.phone]: {
    width: '80%'
  }
})
