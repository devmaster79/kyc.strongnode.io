import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import TableSection from 'components/TableSection/TableSection'
import cryptoDataService, {
  IGetTokenMetricsObject,
  IGetTokenMetricsImageObject
} from '../../services/cryptoDataService'
import { UserOwnedTokens } from './UserOwned/UserOwnedTokens'
import { UserOwnedEthereum } from './UserOwned/UserOwnedEthereum'
import {
  getTokenAddress,
  coinTypesDictionary
} from '../../services/walletService'
import { DataSet } from './MainTable/MainTable'

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
  items: []
}

interface IDataIcon {
  name: string
  url: IGetTokenMetricsImageObject
}

interface IOwnedObject {
  tokenAddress: string | undefined
  default: string
  type: string | undefined | boolean
}

export interface IFormattedTokenObject {
  owned: IOwnedObject | string
  value: string
  value_trend: number
  icon: IDataIcon
}

type CoinMetricsProps = {
  title: string
  subtitle?: string
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
        <GrowthWrapper
          style={Math.sign(value) === -1 ? { color: '#BB3353' } : {}}>
          {value}
        </GrowthWrapper>
      </div>
    )
  },
  owned: (data: IOwnedObject) => {
    return (
      <span>
        {data.type === 'token' && (
          <UserOwnedTokens
            tokenAddress={data.tokenAddress}
            default={data.default}
          />
        )}
        {data.type === 'ethereum' && (
          <UserOwnedEthereum default={data.default} />
        )}
        {!data.type && data.default}
      </span>
    )
  }
}

let searchTimeout: ReturnType<typeof setTimeout>

export const CoinMetrics = (props: CoinMetricsProps) => {
  const [tableData, setTableData] = useState<{
    items: Array<IFormattedTokenObject>
  }>({
    items: []
  })

  useEffect(() => {
    const loadTokenMetrics = async () => {
      const data = await cryptoDataService.getTokenMetricsFunc()
      // console.log(data.data)
      const formatedData = formatTableData(data.data)
      setTableData(formatedData as DataSet<IFormattedTokenObject>)
    }
    loadTokenMetrics()

    const refreshDataInterval = setInterval(() => {
      loadTokenMetrics()
    }, 10000)

    return () => clearInterval(refreshDataInterval)
  }, [])

  // makes request and sets tableData to state

  // formats object for table
  const formatTableData = (data: Array<IGetTokenMetricsObject>) => {
    const temporaryData: Array<IFormattedTokenObject> = []

    data.map((token: IGetTokenMetricsObject) => {
      const tokenObject: IFormattedTokenObject = {
        owned: {
          tokenAddress: getTokenAddress(token.token.toLowerCase()),
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
      return null
    })
    return { items: temporaryData }
  }

  const addKeywords = async () => {
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
      dataSet={
        Object.keys(tableData).length > 0
          ? (tableData as unknown as DataSet<
              Record<string, IFormattedTokenObject>
            >)
          : (sampleData as DataSet<Record<string, IFormattedTokenObject>>)
      }
      columns={sampleColumns}
    />
  )
}

const CryptoWrapper = styled.div({
  height: 'max-content',
  width: 'max-content',

  p: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: '16px'
  },

  img: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
})

const GrowthWrapper = styled.div({
  textAlign: 'right',
  textTransform: 'uppercase',
  color: '#54c093'
})
