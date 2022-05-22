import NFTCard from './NFTCard/NFTCard'
import styled from '@emotion/styled'
import TableSection from 'components/TableSection/TableSection'
import Autocomplete from '@ui/Autocomplete/Autocomplete'
import Icon from '@ui/Icon/Icon'

const CardWrapper = styled.div({
  display: 'flex',
  flexFlow: 'wrap',
  '@media only screen and (max-width: 600px)': {
    alignItems: 'center'
  }
})

export default function NFTDashboard() {
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

  interface Option {
    label: string
  }

  const customStyle = (option: Option) => {
    // TODO: set type after finishing backend part
    return (
      <AutocompleteStyle>
        <TitleWrapper>
          <img src="https://nftcalendar.io/storage/uploads/2021/12/23/4_1223202109373161c4435bdc931.png" />
          {option.label}
        </TitleWrapper>
        <span>
          <Icon name="eth" height={8} width={13} viewBox="0 0 8 13" />
          9000
        </span>
      </AutocompleteStyle>
    )
  }

  return (
    <Wrapper>
      <Container>
        <AutocompleteWrapper>
          <Autocomplete
            options={{
              collections: [
                { value: '1', label: 'Rubber bubbler dolor' },
                { value: '2', label: 'Rubber bubbler dolor' },
                { value: '1', label: 'Rubber bubbler dolor' }
              ]
            }}
            fetchOptions={() => {
              /* TODO */
            }}
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
          title="Metrics"
          subtitle="NFT 18"
          columns={columns}
          dataSet={dataSet}
          overwrittenFields={overwrittenFields}
          hideHeading={false}
        />
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

const Container = styled.div({
  maxWidth: '1300px',
  width: '100%'
})

const AutocompleteWrapper = styled.div({
  maxWidth: '320px',
  display: 'none'
})

const AutocompleteStyle = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  span: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19px',
    color: `${props.theme.palette.text.secondary}`
  }
}))

const TitleWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',

  img: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    marginRight: '16px'
  }
})
