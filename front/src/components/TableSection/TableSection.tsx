import styled from '@emotion/styled'
import InputField from '@ui/Input/InputField'
import MainTable from '@ui/Table/MainTable/MainTable'
import Icon from '@ui/Icon/Icon'
import { ChangeEvent, useState } from 'react'


interface Column {
  id: string,
  label: string,
  align: string,
}

interface DataSet<Item> {
  items: Item[]
}

interface Finder {
  onChange: (keyword: string) => void;
  rowCount?: number;
}
interface TableSectionProps<Item extends Record<string, unknown>> {
  comingSoon?: string
  title: string
  subtitle: string | undefined
  dataSet: any
  columns: Column[]
  hideHeading?: boolean
  overwrittenFields?: any
  fetchData?: string
  searchEnabled?: boolean;
  searchColumn: string;
  finder?: Finder; // if backend search implemented
}

function TableSection<Item extends Record<string, unknown>>(props: TableSectionProps<Item>) {
  const [filteredDataSet, setFilteredDataSet] = useState<any>(null);

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase();
    // Check backend search function 
    if (props.finder?.onChange) {
      // emit onChange
      props.finder.onChange(search);
      return;
    }
    // if no backend search implemented.
    const filteredData = props.dataSet.items.filter((o: any) => Object.values(o).some((val: any) => handleFilter(val, search)));
    setFilteredDataSet({ items: filteredData });
  }

  const handleFilter = (val: string | Record<string, any>, search: string): boolean => {
    return typeof val === 'string' ? val.toLowerCase().includes(search) : val[props.searchColumn]?.toLowerCase()?.includes(search)
  }

  return (
    <TableSectionWrapper {...props}>
      {props.comingSoon
        ? (
          <ComingSoonWrapper>
            <Icon name='info' height={24} width={24} viewBox='0 0 24 24' />
            <h2>{props.title}</h2>
            <span>Coming soon</span>
          </ComingSoonWrapper>
        )
        : (
          <>
            <HeaderWrapper>
              <h2>{props.title} <span>{props.subtitle}</span></h2>
              {true &&
                <InputField icon='search' inputProps={{ placeholder: 'Search', onChange: onChangeValue }} />}
            </HeaderWrapper>
            <MainTable
              dataSet={filteredDataSet?filteredDataSet:props.dataSet}
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

  background: ${props => props.theme.palette.background.primary};
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
