import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import TableSection from 'components/TableSection/TableSection'
import cryptoDataService, {
  IGetTokenMetricsObject, IGetTokenMetricsData,
  IGetTokenMetricsImageObject
} from '../../services/cryptoDataService'
import { AxiosResponse } from 'axios'
import { UserOwnedTokens } from './UserOwned/UserOwnedTokens'
import { UserOwnedEthereum } from './UserOwned/UserOwnedEthereum'
import { tokenAddressDictionary, coinTypesDictionary } from '../../services/walletService'

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
    }
  ]
}

interface IDataIcon {
  name: string,
  url: IGetTokenMetricsImageObject
}

interface IData {
  [key:string]: object
}

interface IOwnedObject {
  tokenAddress: string,
  default: string,
  type: string | undefined | boolean
}

interface IFormattedTokenObject {
  owned: IOwnedObject,
  value: string,
  value_trend: number,
  icon: IDataIcon
}

type CoinMetricsProps = {
  title: string,
  subtitle?: string,
  dataSet: Array<IData>,
  columns: Array<IData>
}

const overwrittenFields = {
  icon: (icon: IDataIcon) => {
    return (
      <CryptoWrapper>
        <img
          style={{ width: 40, height: 40 }}
          src={icon.url.large}
          alt={icon.name + ' icon'}
        />
        <p>{icon.name}</p>
      </CryptoWrapper>
    )
  },
  value_trend: (value: number) => {
    return (
      <div>
        <GrowthWrapper style={Math.sign(value) === -1 ? { color: '#BB3353' } : {}}>
          {value}
        </GrowthWrapper>
      </div>
    )
  },
  owned: (data: IOwnedObject) => {
    return (
      <span>
        {data.type === 'token' &&
          <UserOwnedTokens tokenAddress={data.tokenAddress} default={data.default} />}
        {data.type === 'ethereum' &&
          <UserOwnedEthereum default={data.default} />}
        {!data.type &&
          data.default}
      </span>
    )
  }
}

let searchTimeout: any = null

export const CoinMetrics = (props: CoinMetricsProps) => {
  const [tableData, setTableData] = useState<IData>({})

  useEffect(() => {
    loadTokenMetrics()

    const refreshDataInterval = setInterval(() => {
      loadTokenMetrics()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [])

  // makes request and sets tableData to state
  const loadTokenMetrics = async () => {
    const data = await cryptoDataService.getTokenMetrics()
    setTableData(formatTableData(data.data))
  }

  // formats object for table
  const formatTableData = (data: Array<IGetTokenMetricsObject>) => {
    const temporaryData: Array<IFormattedTokenObject> = []

    data.forEach((token: IGetTokenMetricsObject) => {
      const tokenObject: IFormattedTokenObject = {
        owned: {
          tokenAddress: tokenAddressDictionary.strongnode,
          default: '-',
          type: coinTypesDictionary[token.token.toLowerCase()]
        },
        value: Number(token.usd_value).toFixed(4) + ' USD',
        value_trend: Number(Number(token.day_change).toFixed(2)),
        icon: {
          url: token.image,
          name: token.token.toUpperCase()
        }
      }
      temporaryData.push(tokenObject)
    })
    return { items: temporaryData }
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
      dataSet={(Object.keys(tableData).length > 0) ? tableData : sampleData}
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
