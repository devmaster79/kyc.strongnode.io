import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TableContainer';
import Typography from '@material-ui/core/Typography';
import Stack from '@material-ui/core/Stack';
import Pagination from '@material-ui/core/Pagination';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Scrollbar from 'components/Scrollbar';
import Status from 'components/Status';

import { fDate } from 'utils/formatTime';
import { useSnackbar } from 'notistack5';

import { historyAction } from '../../utils/api';

function createData(token, stock, date) {
  return { token, stock, date };
}

const GROUPING_TABLE = () => {
  let datas = [];
  for (let i = 0; i < 50; i++) {
    datas.push(createData(169040 + i, 'Withdrawed', '10/05/2021'));
  }
  return datas;
};

const COLUMNS = [
  {
    id: 'token',
    label: 'SNE Token',
    align: 'left',
    format: (value) => `${value.toLocaleString('en-US')} SNE`
  },
  {
    id: 'stock',
    label: 'Stock',
    align: 'left'
  },
  {
    id: 'date',
    label: 'Date',
    align: 'left',
    format: (value) => value.toFixed(2)
  }
];

// ----------------------------------------------------------------------

export default function GroupingFixedHeader({ history, setRefresh }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editflag, setEditFlag] = useState(false);
  const [curdata, setCurData] = useState(-1);
  const [tokenamount, setTokenAmount] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onSave = async (row) => {
    if (tokenamount <= 0) {
      alert('Input Correct Amount');
      return;
    }
    const url = process.env.REACT_APP_BASE_URL + `/api/history/update`;
    const data = {
      _id: row.id,
      token_amount: tokenamount,
      date: Date.now()
    };
    historyAction(url, data).then((r) => {
      if (r.status === 200) {
        enqueueSnackbar('History updated successfully', {
          variant: 'success'
        });
        setRefresh(true);
      } else {
        enqueueSnackbar('Failed to Update Data', { variant: 'fail' });
      }
    });
  };

  const onDel = (row) => {
    const url = process.env.REACT_APP_BASE_URL + `/api/history/delete`;
    const data = {
      _id: row.id
    };
    historyAction(url, data).then((r) => {
      if (r.status === 200) {
        enqueueSnackbar('History deleted successfully', {
          variant: 'success'
        });
        setRefresh(true);
      } else {
        enqueueSnackbar('Failed to Delete Data', { variant: 'fail' });
      }
    });
  };
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
              {history &&
                history
                  .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow tabIndex={-1} key={row.code}>
                      <TableCell>
                        <Stack direction="row" alignItems="center">
                          <Status color="#1DF4F6" />
                          {(editflag === false || curdata !== row.id) && (
                            <Typography variant="h5" color="white">
                              {row.token_amount} SNE
                            </Typography>
                          )}
                          {editflag == true && curdata === row.id && (
                            <TextField
                              style={{ width: '70px' }}
                              value={tokenamount}
                              onChange={(event) => setTokenAmount(event.target.value / 1)}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5" color="white">
                          Withdrawed
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h5" color="white">
                          {fDate(row.date)}
                        </Typography>
                      </TableCell>
                      {/* {localStorage.getItem('username') === row.user_name && <TableCell>
                        {(!editflag || curdata !== row.id) && <Button onClick={() => { setCurData(row.id); setEditFlag(true); setTokenAmount(row.token_amount) }}>Edit</Button>}
                        {(editflag && curdata === row.id) && <Button onClick={() => { setCurData(-1); setEditFlag(false); onSave(row) }}>Save</Button>}
                        {(!editflag || curdata !== row.id) && <Button onClick={() => onDel(row)}>Del</Button>}
                        {(editflag && curdata === row.id) && <Button onClick={() => { setCurData(-1); setEditFlag(false) }}>Cancel</Button>}
                      </TableCell>
                      } */}
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
  );
}
