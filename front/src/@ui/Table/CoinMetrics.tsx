import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import TableSection from 'components/TableSection/TableSection'
import cryptoDataService from '../../services/cryptoDataService'
import { IData, IDataIcon } from 'constants/TableConstants'
import { AxiosResponse } from 'axios'

const sampleColumns = [
  {
    id: 'icon',
    label: 'token',
    align: 'left'
  },
  {
    id: 'owned',
    label: 'owned',
    align: 'left'
  },
  {
    id: 'value',
    label: 'value',
    align: 'left'
  },
  {
    id: 'value_trend',
    label: 'growth',
    align: 'left'
  }
]

const sampleData = {
  items: [
    {
      icon: {
        url: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png',
        name: 'BTC'
      },
      owned: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    },
    {
      icon: {
        url: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png',
        name: 'LTC'
      },
      owned: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    },
    {
      icon: {
        url: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png',
        name: 'RTC'
      },
      owned: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    }
  ]
}

const overwrittenFields = {
  icon: (icon: IDataIcon) => {
    return (
      <CryptoWrapper>
        <img
          style={{ width: 40, height: 40 }}
          src={icon.url.large || ''}
          alt={icon.name + ' icon'}
        />
        <p>{icon.name}</p>
      </CryptoWrapper>
    )
  },
  value_trend: (value: IData) => {
    return (
      <div>
        <GrowthWrapper style={value.positive ? {} : { color: '#BB3353' }}>
          {value.value}
        </GrowthWrapper>
      </div>
    )
  }
}

let searchTimeout: ReturnType<typeof setTimeout>

type CoinMetricsProps = {
  title: string
  subtitle?: string
  dataSet: Array<IData>
  columns: Array<IData>
}

interface TokenObject {
  owned: string
  value: string
  value_trend: ValueTrend
  icon: {
    url: string
    name: string
  }
}

interface TokenResponse {
  token: string
  usd_value: string
  day_change: string
  image: string
}

interface ValueTrend {
  positive?: boolean
  value?: string
}

export const CoinMetrics = (props: CoinMetricsProps) => {
  const [tableData, setTableData] = useState<{ items: TokenObject[] }>({
    items: []
  })

  useEffect(() => {
    const formatTableData = (data: Array<TokenResponse>) => {
      const temporaryData: TokenObject[] = []

      data.forEach((token: TokenResponse) => {
        const tokenObject = {
          owned: 'unknown',
          value: Number(token.usd_value).toFixed(4) + ' USD',
          value_trend: createValueTrendObject(token.day_change),
          icon: {
            url: token.image,
            name: token.token.toUpperCase()
          }
        }
        temporaryData.push(tokenObject)
      })
      return { items: temporaryData }
    }
    const loadTokenMetrics = async () => {
      const data: AxiosResponse = await cryptoDataService.getTokenMetrics()
      setTableData(formatTableData(data.data))
    }
    loadTokenMetrics()

    const refreshDataInterval = setInterval(() => {
      loadTokenMetrics()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [])

  const createValueTrendObject = (value: string) => {
    const valueTrendObject: ValueTrend = {}

    if (value.charAt(0) === '-') {
      valueTrendObject.positive = false
    } else {
      valueTrendObject.positive = true
    }
    valueTrendObject.value =
      (valueTrendObject.positive ? '+' : '') + Number(value).toFixed(2) + ' %'

    return valueTrendObject
  }

  const addKeywords = async (keyword: string) => {
    // clear old timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // add delay while user typing
    searchTimeout = setTimeout(() => {
      //  To Do
      // implement backend search
    }, 2000)
  }

  return (
    <TableSection
      finder={{ onChange: addKeywords, searchMaxRow: 5 }}
      searchColumn={'name'}
      title={props.title}
      subtitle={props.subtitle}
      overwrittenFields={overwrittenFields}
      dataSet={tableData.items?.length > 0 ? tableData : sampleData}
      columns={sampleColumns}
    />
  )
}

const CryptoWrapper = styled.div`
  height: max-content;
  width: max-content;

  p {
    display: inline-block;
    vertical-align: middle;
    margin-left: 16px;
  }

  img {
    display: inline-block;
    vertical-align: middle;
  }
`

const GrowthWrapper = styled.div`
  text-align: right;
  text-transform: uppercase;
  color: #54c093;
`
