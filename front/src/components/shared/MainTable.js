import { useState } from 'react';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Scrollbar from '../Scrollbar';
import { fDate } from '../../utils/formatTime';

export default function MainTable({ dataSet, columns, fetchData, setRefresh, overwrittenFields }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    fetchData(0, +event.target.value);
  };
  return (
    <>
      <Scrollbar>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      background: 'transparent',
                      color: 'white',
                      borderColor: '#1DF4F6'
                    }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {dataSet && dataSet.items.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {overwrittenFields[column.id] ? overwrittenFields[column.id](row[column.id]) :
                        <Typography variant="h5" color="white">
                          {column.id === 'date' ? fDate(row[column.id]) : row[column.id]}
                        </Typography>
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Stack direction="row" justifyContent="flex-end">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataSet && dataSet.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
    </>
  );
}
