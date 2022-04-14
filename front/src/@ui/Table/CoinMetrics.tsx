import React from 'react'
import styled from '@emotion/styled/macro'
import TableSection from 'components/TableSection/TableSection'

const sampleColumns = [
  {
    id: 'icon',
    label: 'name',
    align: 'left'
  },
  {
    id: 'compared_value',
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
      compared_value: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    },
    {
      icon: {
        url: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png',
        name: 'BTC'
      },
      compared_value: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    },
    {
      icon: {
        url: 'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/1024/Bitcoin-BTC-icon.png',
        name: 'BTC'
      },
      compared_value: '50 | 20$',
      value: '2010$',
      value_trend: '+20%'
    }
  ]
}

const overwrittenFields = {
  icon: (icon: IDataIcon) => {
    return (
      <CryptoWrapper>
        <img style={{ width: 40, height: 40 }} src={icon.url} alt='Crypto icon' />
        <p>{icon.name}</p>
      </CryptoWrapper>
    )
  }
}

interface IDataIcon {
  name: string,
  icon: string
}

interface IData {
  [key:string]: object
}

type CoinMetricsProps = {
  title: string,
  subtitle?: string,
  dataSet: Array<IData>,
  columns: Array<IData>
}

export const CoinMetrics = (props: CoinMetricsProps) => {
  return (
    <TableSection title={props.title} subtitle={props.subtitle} overwrittenFields={overwrittenFields} dataSet={sampleData} columns={sampleColumns} />
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
