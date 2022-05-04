import styled from '@emotion/styled'
import InputField from '@ui/Input/InputField'
import MainTable from '@ui/Table/MainTable/MainTable'
import Icon from '@ui/Icon/Icon'
import { ChangeEvent, useState } from 'react'
import { DataSet, TableSectionProps } from 'constants/TableConstants'

function TableSection<Item extends Record<string, unknown>>(
  props: TableSectionProps<Item>
) {
  const [filteredDataSet, setFilteredDataSet] = useState<DataSet<Item> | null>(
    null
  )

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase()
    // Check backend search function
    if (
      props.finder?.onChange &&
      props.dataSet?.items?.length > (props.finder.searchMaxRow || 10)
    ) {
      // emit onChange
      props.finder.onChange(search)
      return
    }
    // if no backend search implemented.
    const filteredData = props.dataSet.items.filter((o) =>
      Object.values(o).some((val) => {
        if (typeof val === 'string') {
          return val.toLowerCase().includes(search)
        }
      })
    )
    setFilteredDataSet({ items: filteredData })
  }

  return (
    <TableSectionWrapper {...props}>
      {props.comingSoon ? (
        <ComingSoonWrapper>
          <Icon name="info" height={24} width={24} viewBox="0 0 24 24" />
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

const TableSectionWrapper = styled.div`
  width: 100%;
  margin-bottom: 200px;
  margin-top: 32px;

  background: ${(props) => props.theme.palette.background.primary};
  border: 1px solid ${(props) => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 10px;
  padding: 32px;

  h2 {
    font-size: 18px;
    color: ${(props) => props.theme.palette.text.primary};
    font-weight: 900;

    span {
      font-family: 'Satoshi-Regular';
      font-size: 14px;
      color: ${(props) => props.theme.palette.text.secondary};
      padding-left: 7px;
    }
  }
`
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
`

const ComingSoonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  height: 480px;
  width: 100%;

  h2 {
    padding-top: 16px;
  }

  span {
    font-family: 'Satoshi-Regular';
    font-size: 14px;
    color: ${(props) => props.theme.palette.text.secondary};
  }
`
