import styled from '@emotion/styled'
import InputField from '@ui/Input/InputField'
import Select from '@ui/Select/Select'
import MainTable from '@ui/Table/MainTable/MainTable'
import Icon from '@ui/Icon/Icon'
import { useState } from 'react'
import { TypeOf } from 'yup'

interface Column {
  id: string,
  label: string,
  align: string,
}

interface DataSet<Item> {
  items: Item[]
}
interface TableSectionProps<Item extends Record<string, unknown>> {
  comingSoon?: string
  title: string
  subtitle: string
  dataSet: DataSet<Item>
  hideHeading: boolean
  columns: Column[]
  overwrittenFields?: { [ItemAttributeName in keyof Item]?: () => string }
  fetchData?: string
}

const selectOptions = [{ label: 'First', value: '1' }, { label: 'Second', value: '2' }]

function TableSection<Item extends Record<string, unknown>> (props: TableSectionProps<Item>) {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0])
  return (
    <TableSectionWrapper {...props}>
      {props.comingSoon
        ? (
          <ComingSoonWrapper>
            <Icon name='info' height={24} width={24} viewBox='0 0 24 24' />
            <h2>{props.title}</h2>
            <span>Comming soon</span>
          </ComingSoonWrapper>
          )
        : (
          <>
            <HeaderWrapper>
              <h2>{props.title} <span>{props.subtitle}</span></h2>
              <InputField icon='search' inputProps={{ placeholder: 'Search' }} />
            </HeaderWrapper>
            <Select
              value={selectedOption.value}
              trackBy='value'
              searchBy='label'
              options={selectOptions}
              onChange={(option) => setSelectedOption(option)}
            />

            <MainTable
              dataSet={props.dataSet}
              columns={props.columns}
              overwrittenFields={props.overwrittenFields || {}}
              fetchData={props.fetchData || null}
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

  background: ${props => props.theme.palette.background.secondary};
  border: 1px solid ${props => props.theme.palette.border.light};
  box-sizing: border-box;
  border-radius: 10px;
  padding: 32px;

  h2 {
    font-size: 18px;
    color: ${props => props.theme.palette.text.primary};
    font-weight: 900;

    span {
      font-family: 'Satoshi-Regular';
      font-size: 14px;
      color: ${props => props.theme.palette.text.secondary};
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
    color: ${props => props.theme.palette.text.secondary};
  }
`
