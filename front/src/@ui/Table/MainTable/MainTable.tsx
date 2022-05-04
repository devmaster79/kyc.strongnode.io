import { useRef, useState } from 'react'
import { Table, TableWrapper } from './style'
import { fDate } from '../../../utils/formatTime'
import { Column, DataSet } from 'constants/table.constants'

interface MainTableProps<Item> {
  dataSet: DataSet<Item>
  columns: Column[]
  fetchData?: (p: number, p2: number) => void | null
  overwrittenFields: Record<string, unknown>
  hideHeading?: boolean
}

export default function MainTable<Item extends Record<string, unknown>>({
  dataSet,
  columns,
  fetchData,
  overwrittenFields,
  hideHeading
}: MainTableProps<Item>) {
  const [page, setPage] = useState(0)

  const listInnerRef = useRef() as React.MutableRefObject<HTMLInputElement>

  const onScroll = () => {
    if (listInnerRef.current) {
      if (dataSet?.total === dataSet.items.length) return
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current
      if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
        setPage(page + 1)
        fetchData && fetchData(page + 1, 5)
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
                {columns.map((column: any) => (
                  <th key={column.id}>{column.label}</th>
                ))}
              </tr>
            )}
            {dataSet &&
              dataSet.items.map((row: any) => (
                <tr key={row.id}>
                  {columns.map((column: any) => (
                    <td key={column.id}>
                      {overwrittenFields[column.id] ? (
                        (overwrittenFields as any)[column.id](row[column.id])
                      ) : (
                        <p>
                          {column.id === 'date'
                            ? fDate(row[column.id])
                            : row[column.id]}
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
