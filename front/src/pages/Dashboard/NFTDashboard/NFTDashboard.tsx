import NFTCard from './NFTCard/NFTCard'
import styled from '@emotion/styled'
import TableSection from 'components/TableSection/TableSection'

const CardWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
`
export default function NFTDashboard () {
  const cards = ['1', '2', '3', '4', '5', '6', '7']

  const columns = [
    {
      id: 'nft',
      label: 'NFT',
      align: 'left'
    },
    {
      id: 'price_paid',
      label: 'Price Paid',
      align: 'left'
    },
    {
      id: 'floor_price',
      label: 'Floor Price',
      align: 'left'
    },
    {
      id: 'volume',
      label: '24H VOLUME',
      align: 'left'
    },
    {
      id: 'price',
      label: '24H PRICE',
      align: 'left'
    }
  ]

  const dataSet = {
    items: [
      {
        nft: 'Scary punk #24',
        price_paid: '44.124',
        floor_price: '70',
        volume: '290.7K',
        price: '290.7K'
      },
      {
        nft: 'Scary punk #24',
        price_paid: '44.124',
        floor_price: '70',
        volume: '290.7K',
        price: '290.7K'
      },
      {
        nft: 'Scary punk #24',
        price_paid: '44.124',
        floor_price: '70',
        volume: '290.7K',
        price: '290.7K'
      },
      {
        nft: 'Scary punk #24',
        price_paid: '44.124',
        floor_price: '70',
        volume: '290.7K',
        price: '290.7K'
      }
    ]
  }

  const overwrittenFields = {
    price: () => {
      return 'Vested'
    }
  }

  return (
    <>
      <h1>NFT Dashboard</h1>
      <CardWrapper>
      {cards.map((card) => (
        <NFTCard key={card}/>
      ))}
      </CardWrapper>
      <TableSection title="Metrics" subtitle="NFT 18" columns={columns} dataSet={dataSet} overwrittenFields={overwrittenFields} />
    </>)
}
