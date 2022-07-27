import format from 'date-fns/format'
import { useRef, useState } from 'react'
import { Table, TableWrapper } from './style'

function fDate(date: string) {
  return format(new Date(date), 'dd/MM/yyyy')
}

interface MainTableProps<Item> {
  dataSet: DataSet<Item>
  columns: Column[]
  fetchData?: (from: number, length: number) => void
  overwrittenFields?: Record<string, unknown>
  hideHeading?: boolean
}

export interface DataSet<Item> {
  items: Item[]
  total?: number
}

export interface Column {
  id: string
  label: string
}

type OverwrittenFields = {
  [key: string]: (value: string) => Element
}

export default function MainTable<Item extends Record<string, unknown>>({
  dataSet,
  columns,
  fetchData,
  overwrittenFields,
  hideHeading
}: MainTableProps<Item>) {
  const [page, setPage] = useState(1)

  const listInnerRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const onScroll = () => {
    if (listInnerRef.current) {
      if (dataSet?.total === dataSet.items.length) return
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
        setPage(page + 1)
        fetchData && fetchData(page + 1, 10)
      }
    }
  }

  return (
    <>
      <TableWrapper onScroll={onScroll} ref={listInnerRef}>
        <Table>
          <tbody>
            {!hideHeading && (
              <tr>
                {columns.map((column: Column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            )}
            {dataSet &&
              dataSet.items &&
              dataSet.items.map((row: Item) => (
                <tr key={row['id'] as string}>
                  {columns.map((column: Column) => (
                    <td key={column.id}>
                      {overwrittenFields && overwrittenFields[column.id] ? (
                        (overwrittenFields as OverwrittenFields)[column.id](
                          row[column.id] as string
                        )
                      ) : (
                        <p>
                          {column['id'] === 'date'
                            ? fDate(row[column.id] as string)
                            : (row[column.id] as string)}
                        </p>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </Table>
      </TableWrapper>
    </>
  )
}
