import styled from '@emotion/styled'
import InputField from '@ui/Input/InputField'
import MainTable, { Column, DataSet } from '@ui/Table/MainTable/MainTable'
import Icon from '@ui/Icon/Icon'
import { ChangeEvent, useState } from 'react'
import Media from './../../theme/mediaQueries'
interface Finder {
  onChange: (keyword: string) => void
  searchMaxRow?: number
}

interface TableSectionProps<Item extends Record<string, unknown>> {
  comingSoon?: boolean
  title: string
  subtitle: string | undefined
  dataSet?: DataSet<Item>
  columns?: Column[]
  hideHeading?: boolean
  overwrittenFields?: Record<string, unknown>
  fetchData?: (p: number, p2: number) => void
  searchEnabled?: boolean
  searchColumn?: string
  finder?: Finder
}

function TableSection<Item extends Record<string, unknown>>(
  props: TableSectionProps<Item>
) {
  const [filteredDataSet, setFilteredDataSet] = useState<DataSet<Item> | null>(
    null
  )

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.comingSoon || !props.dataSet) return
    const search = event.target.value.toLowerCase()
    // Check backend search function
    if (props.finder?.onChange) {
      // emit onChange
      props.finder.onChange(search)
      return
    }
    // if no backend search implemented.
    const filteredData = props.dataSet.items.filter((val) =>
      JSON.stringify(val).toLowerCase().includes(search)
    )
    setFilteredDataSet({ items: filteredData })
  }

  return (
    <TableSectionWrapper {...props}>
      {props.comingSoon || !props.dataSet || !props.columns ? (
        <ComingSoonWrapper>
          <Icon name="info" height={24} width={24} />
          <h2>{props.title}</h2>
          <span>Coming soon</span>
        </ComingSoonWrapper>
      ) : (
        <>
          <HeaderWrapper>
            <h2>
              {props.title} <span>{props.subtitle}</span>
            </h2>
            <InputField
              icon="search"
              inputProps={{ placeholder: 'Search', onChange: onChangeValue }}
            />
          </HeaderWrapper>
          <MainTable
            dataSet={filteredDataSet ? filteredDataSet : props.dataSet}
            columns={props.columns}
            overwrittenFields={props.overwrittenFields || {}}
            fetchData={props.fetchData}
            hideHeading={props.hideHeading || false}
          />
        </>
      )}
    </TableSectionWrapper>
  )
}

export default TableSection

const TableSectionWrapper = styled.div((props) => ({
  width: '100%',
  marginBottom: '200px',
  marginTop: '32px',
  background: props.theme.palette.background.primary,
  border: `1px solid ${props.theme.palette.border.light}`,
  boxSizing: 'border-box',
  borderRadius: '10px',
  padding: '32px',
  h2: {
    fontSize: '18px',
    color: props.theme.palette.text.primary,
    fontWeight: '900',

    span: {
      fontFamily: 'Satoshi-Regular',
      fontSize: '14px',
      color: props.theme.palette.text.secondary,
      paddingLeft: '7px'
    }
  },

  [Media.tablet]: {
    marginBottom: '20px'
  }
}))

const HeaderWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',

  [Media.phone]: {
    flexDirection: 'column',

    h2: {
      paddingBottom: '20px'
    }
  }
})

const ComingSoonWrapper = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: '40px',
  height: '480px',
  width: '100%',

  h2: {
    paddingTop: '16px'
  },

  span: {
    fontFamily: 'Satoshi-Regular',
    fontSize: '14px',
    color: props.theme.palette.text.secondary
  }
}))
