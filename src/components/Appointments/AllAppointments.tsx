'use client';

import * as React from 'react';
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

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Time' },
  { value: 'TODAY', label: 'Today' },
  { value: 'WEEK', label: 'This Week' },
  { value: 'MONTH', label: 'This Month' },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmed: 'appt-badge appt-badge--confirmed',
  Cancelled: 'appt-badge appt-badge--cancelled',
  Pending: 'appt-badge appt-badge--pending',
};

export default function AllAppointments({ filter, setFilter }: any) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('_id');
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 7;
  const [rows, setRows] = React.useState<any[]>([]);

  const { showLoader, hideLoader } = useLoader();
  const allAppointments = useSelector((state: any) => state.appointments.allAppointments);
  const dispatch = useDispatch();

  React.useEffect(() => {
    showLoader();
    setRows(allAppointments);
    hideLoader();
  }, [allAppointments]);

  React.useEffect(() => {
    showLoader();
    async function getAppointments() {
      let businessId = localStorage.getItem('activeBusinessId');
      if (businessId) await dispatch(getAllAppointmentsAction(businessId, filter) as any);
    }
    getAppointments();
    hideLoader();
  }, [dispatch, filter]);

  const handleSort = (col: keyof Data) => {
    const isAsc = orderBy === col && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(col);
    setPage(0);
  };

  const updateAppointmentStatus = async (status: string, appointId: string) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    await dispatch(updateAppointmentStatusAction(businessId, status, appointId) as any);
    await dispatch(getAllAppointmentsAction(businessId, filter) as any);
    hideLoader();
  };

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rows],
  );

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const SortIcon = ({ col }: { col: keyof Data }) => {
    if (orderBy !== col) return <span className="appt-sort-icon appt-sort-icon--none">⇅</span>;
    return <span className="appt-sort-icon">{order === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="appt-table-section">
      {/* Header row */}
      <div className="appt-table-header-row">
        <h2 className="appt-section-title" style={{ margin: 0 }}>All Appointments</h2>
        <div className="appt-filter-group">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`appt-filter-chip${filter === opt.value ? ' appt-filter-chip--active' : ''}`}
              onClick={() => { setFilter(opt.value); setPage(0); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="appt-table-wrapper">
        <table className="appt-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')} className="appt-th appt-th--sortable">
                Booking ID <SortIcon col="_id" />
              </th>
              <th className="appt-th">Name</th>
              <th className="appt-th appt-th--hide-sm">Email</th>
              <th className="appt-th appt-th--hide-sm">Phone</th>
              <th onClick={() => handleSort('appointmentDate')} className="appt-th appt-th--sortable">
                Date <SortIcon col="appointmentDate" />
              </th>
              <th className="appt-th appt-th--hide-xs">Time</th>
              <th className="appt-th">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="appt-empty-row">No appointments found</td>
              </tr>
            ) : visibleRows.map((row: any) => (
              <tr key={row._id} className="appt-tr">
                <td className="appt-td appt-td--id" title={row._id}>
                  {row._id?.slice(-8)}
                </td>
                <td className="appt-td appt-td--name">{row.name}</td>
                <td className="appt-td appt-th--hide-sm appt-td--muted">{row.email}</td>
                <td className="appt-td appt-th--hide-sm">{row.phoneNumber}</td>
                <td className="appt-td">{new Date(row.appointmentDate).toDateString()}</td>
                <td className="appt-td appt-th--hide-xs">{row.bookingSlot?.open}</td>
                <td className="appt-td">
                  {row.status === 'Pending' ? (
                    <div className="appt-action-btns">
                      <button
                        className="appt-action-btn appt-action-btn--confirm"
                        onClick={() => updateAppointmentStatus('Confirmed', row._id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="appt-action-btn appt-action-btn--cancel"
                        onClick={() => updateAppointmentStatus('Cancelled', row._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={STATUS_STYLES[row.status] || 'appt-badge'}>
                      {row.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="appt-pagination">
          <button
            className="appt-page-btn"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            ← Prev
          </button>
          <span className="appt-page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="appt-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

