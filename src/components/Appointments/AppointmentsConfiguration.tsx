'use client';

import { Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select } from '@mui/material'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentConfigAction, updateAppointmentConfigAction } from '../../Redux/Actions/AppointmentActions/appointment.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { getBusinessDetailsAction } from '../../Redux/Actions/BusinessActions/business.actions';
import { getDefaultAppointmentConfigTimings, validateTimings } from '../../Helpers/common.helper';
import { useLoader } from '../../contexts/LoaderContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltipp from '../common/Tooltip';
import toast from 'react-hot-toast';
import Popup from '../common/Popup';
import { useRouter } from 'next/navigation';

function AppointmentsConfiguration() {
    dayjs.extend(customParseFormat);

    const [weekSlots, setWeeklySlots] = useState<any>([]);
    const [appointmentConfig, setAppointmentConfig] = useState<any>({});
    const [showEnableAppointmentsPopup, setShowEnableAppointmentsPopup] = useState<any>(false);

    const { showLoader, hideLoader } = useLoader();
    const { appointments, business } = useSelector((state: any) => state);
    const dispatch = useDispatch();
    const router = useRouter();
    const navigate = (path: string) => router.push(path);

    useEffect(() => {
        async function fetchAppointmentConfig() {
            showLoader();
            let businessID = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAppointmentConfigAction(businessID) as any);
            await dispatch(getBusinessDetailsAction(businessID) as any);
            hideLoader();
        }
        if (!appointments || (!appointments?.appointmentConfiguration && !appointments.loading)) {
            fetchAppointmentConfig();
        } else {
            setWeeklySlots(appointments?.appointmentConfiguration?.weeklySlots);
            setAppointmentConfig(appointments?.appointmentConfiguration);
        }
    }, [appointments.appointmentConfiguration]);

    const handleTimeChange = (day: any, field: any, newValue: any) => {
        setWeeklySlots({ ...weekSlots, [day]: { ...weekSlots[day], [field]: newValue.format("HH:mm") } });
    };

    useEffect(() => {
        if (business?.businessDetails?.enableAppointments) {
            setShowEnableAppointmentsPopup(false);
        } else {
            setShowEnableAppointmentsPopup(true);
        }
    }, [business.businessDetails]);

    const handleClosedChange = (day: any) => {
        setWeeklySlots({
            ...weekSlots,
            [day]: {
                ...weekSlots[day],
                isClosed: !weekSlots[day].isClosed,
                ...(weekSlots[day].isClosed ? { open: "09:00", close: "22:00" } : {})
            }
        });
    };

    const handleCheckBizHours = async (val: any) => {
        let bussId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        showLoader();
        if (val) {
            await dispatch(updateAppointmentConfigAction(bussId, {
                weeklySlots: business.businessDetails.timings,
                isSameAsBizHours: true
            }) as any);
        } else {
            await dispatch(updateAppointmentConfigAction(bussId, { isSameAsBizHours: false }) as any);
            setAppointmentConfig({ ...appointmentConfig, isSameAsBizHours: val });
        }
        hideLoader();
    };

    const getFisrtAndLastDateOfWeek = () => {
        let curr = new Date();
        let first = curr.getDate() - curr.getDay();
        let last = first + 6;
        return {
            firstday: new Date(curr.setDate(first)).toDateString(),
            lastday: new Date(curr.setDate(last)).toDateString(),
        };
    };

    const handleUpdateSlotConfig = async () => {
        let check = validateTimings(weekSlots);
        if (check.valid) {
            let bussId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            showLoader();
            await dispatch(updateAppointmentConfigAction(bussId, {
                weeklySlots: weekSlots,
                isSameAsBizHours: appointmentConfig.isSameAsBizHours,
                gapBetweenSlotsInMinutes: appointmentConfig.gapBetweenSlotsInMinutes,
                slotSizeInMinutes: appointmentConfig.slotSizeInMinutes
            }) as any);
            hideLoader();
        } else {
            toast.error(check.message);
        }
    };

    const popupInputs = [{
        label: "Go to Profile",
        variant: "contained",
        onClick: () => navigate("/profile")
    }];

    const { firstday, lastday } = getFisrtAndLastDateOfWeek();

    return (
        <div className="appt-config-section">
            <h2 className="appt-section-title">Configuration</h2>

            <div className="appt-slots-wrap">
                {/* Header */}
                <div className="appt-slots-header">
                    <div className="appt-slots-header-row">
                        <h3 className="appt-slots-title">Weekly Available Appointment Slots</h3>
                        <Tooltipp
                            placement="top"
                            title={<span style={{ fontSize: '0.85rem' }}>Select start &amp; end times for each day. The start time is the earliest available and end time is the latest. Ensure the range covers your full availability.</span>}
                        >
                            <IconButton size="small" sx={{ padding: '2px' }}>
                                <HelpOutlineIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                            </IconButton>
                        </Tooltipp>
                    </div>
                    <p className="appt-slots-week">{firstday} — {lastday}</p>
                </div>

                {/* Grid: days + options */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="appt-slots-grid">
                        {/* Days column */}
                        <div className="appt-slots-days">
                            {weekSlots && Object.keys(weekSlots).map((day) => (
                                <div className="appt-day-row" key={day}>
                                    <span className="appt-day-name">{day}</span>

                                    {weekSlots[day].isClosed ? (
                                        <span className="appt-day-closed-text">Closed</span>
                                    ) : (
                                        <>
                                            <TimePicker
                                                disabled={appointmentConfig.isSameAsBizHours}
                                                ampm={false}
                                                label="Start"
                                                value={dayjs(`${weekSlots[day].open}`, 'HH:mm')}
                                                onChange={(v) => handleTimeChange(day, 'open', v)}
                                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            />
                                            <TimePicker
                                                disabled={appointmentConfig.isSameAsBizHours}
                                                ampm={false}
                                                label="Close"
                                                value={dayjs(`${weekSlots[day].close}`, 'HH:mm')}
                                                onChange={(v) => handleTimeChange(day, 'close', v)}
                                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                            />
                                        </>
                                    )}

                                    <div className="appt-day-check">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={appointmentConfig.isSameAsBizHours}
                                                    checked={weekSlots[day].isClosed}
                                                    onChange={() => handleClosedChange(day)}
                                                    size="small"
                                                    sx={{ color: '#7c3aed', '&.Mui-checked': { color: '#7c3aed' } }}
                                                />
                                            }
                                            label={<span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Closed</span>}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Options column */}
                        <div className="appt-slots-options">
                            <p className="appt-slots-options-title">Settings</p>

                            <div className="appt-slots-options-row">
                                <span className="appt-slots-options-label">Use Business Hours</span>
                                <Checkbox
                                    checked={appointmentConfig.isSameAsBizHours || false}
                                    onChange={(e) => handleCheckBizHours(e.target.checked)}
                                    size="small"
                                    sx={{ color: '#7c3aed', '&.Mui-checked': { color: '#7c3aed' }, padding: '4px' }}
                                />
                            </div>

                            <div className="appt-slots-options-row appt-slots-options-col">
                                <span className="appt-slots-options-label">Slot Duration</span>
                                <div className="appt-select-wrap">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Slot size</InputLabel>
                                        <Select
                                            value={appointmentConfig.slotSizeInMinutes || ''}
                                            label="Slot size"
                                            onChange={(e) => setAppointmentConfig({ ...appointmentConfig, slotSizeInMinutes: e.target.value })}
                                        >
                                            <MenuItem value={30}>30 mins</MenuItem>
                                            <MenuItem value={45}>45 mins</MenuItem>
                                            <MenuItem value={60}>1 hour</MenuItem>
                                            <MenuItem value={90}>1.5 hours</MenuItem>
                                            <MenuItem value={120}>2 hours</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="appt-slots-options-row appt-slots-options-col">
                                <span className="appt-slots-options-label">Gap Between Slots</span>
                                <div className="appt-select-wrap">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Gap</InputLabel>
                                        <Select
                                            value={appointmentConfig.gapBetweenSlotsInMinutes || ''}
                                            label="Gap"
                                            onChange={(e) => setAppointmentConfig({ ...appointmentConfig, gapBetweenSlotsInMinutes: e.target.value })}
                                        >
                                            <MenuItem value={5}>5 mins</MenuItem>
                                            <MenuItem value={10}>10 mins</MenuItem>
                                            <MenuItem value={20}>20 mins</MenuItem>
                                            <MenuItem value={30}>30 mins</MenuItem>
                                            <MenuItem value={45}>45 mins</MenuItem>
                                            <MenuItem value={60}>1 hour</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </div>
                </LocalizationProvider>

                {/* Footer actions */}
                <div className="appt-slots-footer">
                    <button className="appt-btn appt-btn--outline">Reset</button>
                    <button className="appt-btn appt-btn--primary" onClick={handleUpdateSlotConfig}>
                        Update Configuration
                    </button>
                </div>
            </div>

            {showEnableAppointmentsPopup && (
                <Popup
                    header="Please go to Profile and enable Appointments."
                    buttons={popupInputs}
                />
            )}
        </div>
    );
}

export default AppointmentsConfiguration;
