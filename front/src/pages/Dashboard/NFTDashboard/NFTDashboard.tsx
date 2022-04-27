import NFTCard from './NFTCard/NFTCard'
import styled from '@emotion/styled'
import TableSection from 'components/TableSection/TableSection'
import Autocomplete from '@ui/Autocomplete/Autocomplete'
import Icon from '@ui/Icon/Icon'

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

  const customStyle = (option: any) => {
    // TODO: set type after finishing backend part
    return (
      <AutocompleteStyle>
        <TitleWrapper>
          <img src='https://nftcalendar.io/storage/uploads/2021/12/23/4_1223202109373161c4435bdc931.png' />
          {option.label}
        </TitleWrapper>
        <span>
          <Icon name='eth' height={8} width={13} viewBox='0 0 8 13' />
          9000
        </span>
      </AutocompleteStyle>
    )
  }

  return (
    <>
      <AutocompleteWrapper>
        <Autocomplete
          options={{
            collections: [{ value: '1', label: 'Rubber bubbler dolor' },
              { value: '2', label: 'Rubber bubbler dolor' }, { value: '1', label: 'Rubber bubbler dolor' }]
          }}
          fetchOptions={() => { /* TODO */ }}
          customStyle={customStyle}
        />
      </AutocompleteWrapper>
      <h1>NFT Dashboard</h1>
      <CardWrapper>
        {cards.map((card) => (
          <NFTCard key={card} />
        ))}
      </CardWrapper>
      <TableSection
        searchColumn={'name'}
        title='Metrics'
        subtitle='NFT 18'
        columns={columns}
        dataSet={dataSet}
        overwrittenFields={overwrittenFields}
        hideHeading={false}
      />
    </>
  )
}

const AutocompleteWrapper = styled.div`
  max-width: 320px;
`
const AutocompleteStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-family: 'Satoshi-Regular';
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    color: ${props => props.theme.palette.text.secondary};
  }
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-right: 16px;
  }
`
