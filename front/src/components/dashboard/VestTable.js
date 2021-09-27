import { useState, useEffect } from 'react'
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  Typography,
  Stack,
  Pagination,
} from '@material-ui/core'
import Scrollbar from 'components/Scrollbar'
import Status from 'components/Status'
import axios from 'axios'
import { fDate } from 'utils/formatTime'

function createData(token, stock, date) {
  return { token, stock, date }
}

const GROUPING_TABLE = () => {
  let datas = []
  for (let i = 0; i < 50; i++) {
    datas.push(createData(169040 + i, 'Vested', '10/05/2021'))
  }
  return datas
}

const COLUMNS = [
  {
    id: 'token',
    label: 'OGN Token',
    // minWidth: 170,
    align: 'left',
    format: (value) => `${value.toLocaleString('en-US')} OGN`,
  },
  {
    id: 'stock',
    label: 'Stock',
    // minWidth: 170,
    align: 'left',
  },
  {
    id: 'date',
    label: 'Date',
    // minWidth: 170,
    align: 'left',
    format: (value) => value.toFixed(2),
  },
]

// ----------------------------------------------------------------------

export default function GroupingFixedHeader() {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [history, setHistory] = useState([])
  console.log("history1 ======================= >", history);
  console.log("history2 ======================= >", history.length);

  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem('token')

      const url =
        process.env.REACT_APP_BASE_URL +
        '/api/history/findAllVested/?user_name=admin'
      console.log('server url2: ', url)
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log(result.data)
      setHistory(result.data)
    }
    fetch()
  }, [])

  const handleChangePage = (event, newPage) => {
    console.log(newPage)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <Scrollbar>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {history.length > 0 &&
                history
                  .slice(
                    (page - 1) * rowsPerPage,
                    (page - 1) * rowsPerPage + rowsPerPage,
                  )
                  .map((row) => (
                    <TableRow tabIndex={-1} key={row.code}>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <Status color="secondary.main" />
                          <Typography variant="h5">
                            {row.token_amount} OGN
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5" color="typography.75">
                          Vested
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5" color="typography.75">
                          {fDate(row.date)}
                        </Typography>
                      </TableCell>
                      {/* {COLUMNS.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })} */}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Stack direction="row" justifyContent="flex-end">
        <Pagination
          color="primary"
          page={page}
          count={Math.ceil(history && history.length / 10)}
          rowsPerPage={rowsPerPage}
          onChange={handleChangePage}
          sx={{ mt: 3 }}
        />
      </Stack>
      {/* <TablePagination
        page={page}
        component="div"
        count={GROUPING_TABLE.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 7, 10]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </>
  )
}
