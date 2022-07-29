import styled from '@emotion/styled/macro'
import {
  getAccountsLastTransactions,
  IGetLastTransactions,
  IGetLastTransactionsResponse,
  IGetLastTransactionsResponseResultObject
} from '../../services/polygonscanService'
import { useEffect, useState } from 'react'
import TableSection from 'components/TableSection/TableSection'
import { DataSet } from '../Table/MainTable/MainTable'

interface ILastTransactions {
  address: string
}

const sampleData = {
  items: []
}

const sampleColumns = [
  {
    id: 'to',
    label: 'To',
    align: 'left'
  },
  {
    id: 'value',
    label: 'Value',
    align: 'left'
  },
  {
    id: 'timeStamp',
    label: 'Date',
    align: 'left'
  }
]

export interface Transaction {
  to: string
  value: string
  timeStamp: string
}

export const LastTransactions = (props: ILastTransactions) => {
  const [transactions, setTransactions] = useState<{
    items: Array<Transaction>
  } | null>(null)

  const reformatTransactions = (
    transactionsResponse: IGetLastTransactionsResponse
  ) => {
    const newTransactions: Array<Transaction> = []

    transactionsResponse.result.forEach(
      (el: IGetLastTransactionsResponseResultObject) => {
        newTransactions.push({
          to: el.to,
          value: el.value,
          timeStamp: new Date(Number(el.timeStamp) * 1000).toLocaleDateString(
            'en-US'
          )
        })
      }
    )

    return newTransactions
  }

  useEffect(() => {
    const accountsLastTransactionsParameters: IGetLastTransactions = {
      module: 'account',
      address: props.address,
      page: 1,
      offset: 30,
      sort: 'desc'
    }

    const fetchTransactions = async () => {
      const lastTransactions: IGetLastTransactionsResponse | null =
        await getAccountsLastTransactions(accountsLastTransactionsParameters)

      if (lastTransactions)
        setTransactions({ items: reformatTransactions(lastTransactions) })
    }

    fetchTransactions()
  }, [props.address])

  return (
    <LastTransactionsWrapper>
      <TableSection
        comingSoon={
          props.address === '' ||
          (transactions != null && transactions.items.length === 0)
        }
        comingSoonTitle={
          props.address === ''
            ? 'Please connect your wallet'
            : transactions != null && transactions.items.length === 0
            ? 'No transactions found'
            : 'Coming soon'
        }
        columns={sampleColumns}
        dataSet={
          transactions && props.address !== ''
            ? (transactions as unknown as DataSet<Record<string, Transaction>>)
            : (sampleData as DataSet<Record<string, Transaction>>)
        }
        title={'Last transactions'}
        subtitle={'from your wallet'}
      />
    </LastTransactionsWrapper>
  )
}

const LastTransactionsWrapper = styled.div({
  width: '100%'
})
