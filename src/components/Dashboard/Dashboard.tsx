import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessDetailsAction } from "../../Redux/Actions/BusinessActions/business.actions";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { getAllAppointmentsAction } from "../../Redux/Actions/AppointmentActions/appointment.actions";
import { useLoader } from "../../contexts/LoaderContext";

const Dashboard = () => {
  const data = {
    businessName: "Sri Sai Dental",
    views: 7265,
    visits: 3671,
    newUsers: 156,
    enquiries: Array(7).fill({
      name: "Ashish Kumar",
      email: "ashishk@ewns.com",
      phoneNumber: "+91-4564221111",
      message: "I need portal",
    }),
    appointments: Array(7).fill({
      name: "Ashish Kumar",
      email: "ashishk@ewns.com",
      phoneNumber: "+91-4564221111",
      bookingDate: "03-07-23",
      status: "Active",
    }),
  };

  const businessDetails = useSelector((state: any) => state.business.businessDetails);
  const appointmentsData = useSelector((state: any) => state.appointments.allAppointments);
  const dispatch = useDispatch();
  const [businessData, setBusinessData] = useState<any>(data);
  const [appointments, setAppointments] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const navigate = useNavigate();
  const {showLoader, hideLoader} = useLoader();

  useEffect(()=>{
    async function fetchBusiness(){
        showLoader();
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        if(businessId){
            await dispatch(getBusinessDetailsAction(businessId) as any);
            await dispatch(getAllAppointmentsAction(businessId, "ALL") as any);
        }
        hideLoader();
    }

    fetchBusiness();
  }, [dispatch]);

  useEffect(()=>{
    setBusinessData(businessDetails);
    setAppointments(appointmentsData);
  }, [businessDetails, appointmentsData])
  return (<>{
    businessData && 
    <div className="dashboard">
      <div className="header">
        <div className="greeting">
          <h1>Hi, {businessData?.businessName}! 👋</h1>
          <p>Your Business Dashboard.</p>
        </div>
        <div className="subscription-info">
          <span>Joined Date - {new Date(businessData?.createdOn).toDateString()}</span>
          <span className="expired">Subscription - Expired</span>
          <span>Expiry Date - {new Date(businessData?.createdOn).toDateString()}</span>
          <button className="renew-btn" onClick={()=>navigate("/subscription")}>Renew</button>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <p className="mb-6">Views</p>
          <div className="flex-row-vertically justify-between">
            <h2>{data.views.toLocaleString()}</h2>
            <span className="stat-change positive">+11.02%</span>
          </div>
        </div>
        <div className="stat">
          <p className="mb-6">Visits</p>
          <div className="flex-row-vertically justify-between">
            <h2>{data.visits.toLocaleString()}</h2>
            <span className="stat-change negative">-0.03%</span>
          </div>
        </div>
        <div className="stat">
          <p className="mb-6">New Users</p>
          <div className="flex-row-vertically justify-between">
            <h2>{data.newUsers.toLocaleString()}</h2>
            <span className="stat-change positive">+15.03%</span>
          </div>
        </div>
      </div>
      <div className="recent-section">
        <div className="recent-enquiry">
          <div className="flex justify-between items-center recent-section-heading">
            <h3>Recent Enquiry</h3>
            <a onClick={()=>navigate("/messages")} className="view-link">
              View
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Id</th>
                <th>Phone Number</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {messages && messages.map((enquiry: any, index: any) => (
                <tr key={index}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.phoneNumber}</td>
                  <td>{enquiry.message}</td>
                </tr>
              ))}
              {messages && messages.length === 0 && <tr>
                  No Enquiries
                </tr>}
            </tbody>
          </table>
        </div>
        <div className="recent-appointments">
          <div className="flex justify-between items-center recent-section-heading">
            <h3>Recent Appointments</h3>
            <a onClick={()=>navigate("/appointments")} className="view-link">
              View
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Id</th>
                <th>Phone Number</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.map((appointment: any, index: any) => (
                <tr key={index}>
                  <td>{appointment.name}</td>
                  <td>{appointment.email}</td>
                  <td>{appointment.phoneNumber}</td>
                  <td>{appointment.bookingDate}</td>
                  <td className={appointment.status.toLowerCase()}>
                    {appointment.status}
                  </td>
                </tr>
              ))}
              {appointments && appointments.length === 0 && <tr>
                  No Appointments
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div> 
  }</>);
};

export default Dashboard;