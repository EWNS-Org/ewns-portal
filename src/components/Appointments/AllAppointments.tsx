import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAppointmentsAction, updateAppointmentStatusAction } from '../../Redux/Actions/AppointmentActions/appointment.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { useLoader } from '../../contexts/LoaderContext';

interface Data {
  id: number;
  name: string;
  phone: number;
  email: number;
  appointmentDate: Date;
  bookingSlot: number;
  status: string;
  _id: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof Data;
  label: string;
isSort: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: '_id',
    label: 'Booking Id',
    isSort: true
  },
  {
    id: 'name',
    label: 'Name',
    isSort: false
  },
  {
    id: 'email',
    label: 'Email ID',
    isSort: false
  },
  {
    id: 'phone',
    label: 'Phone Number',
    isSort: false
  },
  {
    id: 'appointmentDate',
    label: 'Booking Date',
    isSort: true
  },
  {
    id: 'bookingSlot',
    label: 'Booking Time',
    isSort: false
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy,  rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSort ? <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel> : <>              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}</>}
            
          </TableCell>
        ))}
        <TableCell
        key={"action"}
        align={'center'}
        padding={'normal'}
        >Actions
            
        </TableCell>
      </TableRow>
    </TableHead>
  );
}


export default function AllAppointments({filter, setFilter}: any) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('_id');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [rows, setRows] = React.useState<any>([]);

  const {showLoader, hideLoader} = useLoader();
  
  const allAppointments = useSelector((state:any) => {
    return   state.appointments.allAppointments
});
  const dispatch = useDispatch();

  
React.useEffect(() => {
    showLoader();
    console.log(allAppointments)
    setRows(allAppointments);
    hideLoader();

}, [allAppointments])


  React.useEffect(() => {
    showLoader();

    async function getAppointments() {
        let businessId = localStorage.getItem("activeBusinessId");

        if (businessId)
            await dispatch(getAllAppointmentsAction(businessId, filter) as any)
    }

    getAppointments();
    hideLoader();
}, [dispatch, filter]);



  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
   
  };

  

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateAppointmentStatus = async (status: any, appointId: any) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

    await dispatch(updateAppointmentStatusAction(businessId, status, appointId) as any);
    await dispatch(getAllAppointmentsAction(businessId, filter) as any);
    hideLoader();

  }
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (

    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{ }}>
                    <Card sx={{ padding: "2%", height: "630px" }}>
                        <Box sx={{ width: '100%' }}>{rows && <>
                            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"1%", alignItems:"center"}}>
                                <Typography variant="h5">Appointments List</Typography>
                                <FormControl sx={{ width: "15%" }} >
                                    <InputLabel id="demo-simple-select-type">Filter</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-type"
                                        id="demo-simple-select-type"
                                        value={filter}
                                        label="Filter"
                                        onChange={(e)=>setFilter(e.target.value)}
                                        sx={{borderRadius:"50px", backgroundColor:"white"}}
                                    >
                                        {<MenuItem  value={"TODAY"}>{"Today"}</MenuItem>}
                                        {<MenuItem  value={"WEEK"}>{"This Week"}</MenuItem>}
                                        {<MenuItem  value={"MONTH"}>{"This Month"}</MenuItem>}
                                        {<MenuItem  value={"ALL"}>{"All"}</MenuItem>}
                                    </Select>
                                </FormControl>
                            </div>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer>
                            <Table
                                sx={{ minWidth: 750, }}
                                aria-labelledby="tableTitle"
                            >
                                <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                />
                                <TableBody>
                                {visibleRows.map((row: any, index: number) => {

                                    return (
                                    <TableRow
                                        hover
                                        key={row._id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                    <TableCell align="center">{row._id}</TableCell>
                                        <TableCell sx={{height:"50%"}}
                                        align='center'
                                        >
                                        {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.email}</TableCell>                    
                                        <TableCell align="center">{row.phoneNumber}</TableCell>
                                        <TableCell align="center">{new Date(row.appointmentDate).toDateString()}</TableCell>
                                        <TableCell align="center">{row.bookingSlot.open}</TableCell>
                                        <TableCell align="center">
                                            {row.status === "Pending" ? <div>
                                                <Button onClick={()=>updateAppointmentStatus("Confirmed", row._id)} sx={{height:"20px", width:"5px", fontSize:"10px",borderRadius:"15px", backgroundColor: "green", color:"white", marginRight:"5%" }}>Confirm</Button>
                                                <Button onClick={()=>updateAppointmentStatus("Cancelled", row._id)} sx={{height:"20px", width:"5px", fontSize:"10px", borderRadius:"15px", backgroundColor: "red", color:  "white"}}>Cancel</Button>
                                                </div> :
                                                <Typography sx={{backgroundColor: row.status === "Cancelled" ? "red" : "green", color: "White", fontSize:"15px", borderRadius:"15px"}}>{row.status.toLocaleUpperCase()}</Typography>
                                            }
                                        </TableCell>
                                    </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                    >
                                    <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                </TableBody>
                            </Table>
                            </TableContainer>
                            <TablePagination
                            rowsPerPageOptions={[10]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper></>}
                        </Box>
                    </Card>
                </Stack>
            </div>
        </div>
  );
}
