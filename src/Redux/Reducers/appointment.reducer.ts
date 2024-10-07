import { APPOINTMENT_LOADING, APPOINTMENT_STOP_LOADING, GET_ALL_APPOINTMENTS, GET_ALL_APPOINTMENTS_COUNTS, GET_APPOINTMENT_CONFIGURATION } from "../Actions/AppointmentActions/appointment.action.types";


const initialState = {
    appointmentConfiguration: null,
    allAppointments: [],
    allCounts: null,
    loading: false,
    error: null,
};

export const appointmentsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case GET_APPOINTMENT_CONFIGURATION:
            return { ...state, appointmentConfiguration: action.payload };
        case APPOINTMENT_LOADING:
                return { ...state, loading: true };
        case APPOINTMENT_STOP_LOADING:
            return { ...state, loading: false};
        case GET_ALL_APPOINTMENTS:
            return { ...state, allAppointments: action.payload};
        case GET_ALL_APPOINTMENTS_COUNTS:
            return { ...state, allCounts: action.payload};
        default:
            return state;
    }
};