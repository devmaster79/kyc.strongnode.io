import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import TableSection from 'components/TableSection/TableSection'
import cryptoDataService from '../../services/cryptoDataService'

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
        <img style={{ width: 40, height: 40 }} src={icon.url.large} alt={icon.name + ' icon'} />
        <p>{icon.name}</p>
      </CryptoWrapper>
    )
  },
  value_trend: (value: IData) => {
    return (
      <div>
        <GrowthWrapper style={value.positive ? {} : { color: '#BB3353' }}>{value.value}</GrowthWrapper>
      </div>
    )
  }
}

interface IDataIcon {
  name: string,
  url: any
}

interface IData {
  [key: string]: object
}

type CoinMetricsProps = {
  title: string,
  subtitle?: string,
  dataSet: Array<IData>,
  columns: Array<IData>
}

export const CoinMetrics = (props: CoinMetricsProps) => {
  const [tableData, setTableData] = useState<{ [key: string]: any[] }>({})

  useEffect(() => {
    loadTokenMetrics()

    const refreshDataInterval = setInterval(() => {
      loadTokenMetrics()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [])

  const loadTokenMetrics = async () => {
    const data: any = await cryptoDataService.getTokenMetrics();
    setTableData(formatTableData(data.data))
  }

  const formatTableData = (data: any) => {
    const temporaryData: any = []

    data.forEach((token: any) => {
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

  const createValueTrendObject = (value: string) => {
    const valueTrendObject: any = {}

    if (value.charAt(0) == '-') { valueTrendObject.positive = false } else { valueTrendObject.positive = true }
    valueTrendObject.value = ((valueTrendObject.positive) ? '+' : '') + Number(value).toFixed(2) + ' %'

    return valueTrendObject
  }

  return (
    <TableSection title={props.title} searchEnabled={true} subtitle={props.subtitle} overwrittenFields={overwrittenFields} dataSet={(tableData.items?.length > 0) ? tableData : sampleData} columns={sampleColumns} />
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
  color: #54C093;
`
