import React from "react";

const Dashboard = () => {
  const data = {
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

  return (
    <div className="dashboard">
      <div className="header">
        <div className="greeting">
          <h1>Hi, Sri Sai Dental! 👋</h1>
          <p>Sales monitoring dashboard template.</p>
        </div>
        <div className="subscription-info">
          <span>Joined Date - 23.07.24</span>
          <span className="expired">Subscription - Expired</span>
          <span>Expiry Date - 24.07.24</span>
          <button className="renew-btn">Renew</button>
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
            <a href="/" className="view-link">
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
              {data.enquiries.map((enquiry, index) => (
                <tr key={index}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.phoneNumber}</td>
                  <td>{enquiry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-appointments">
          <div className="flex justify-between items-center recent-section-heading">
            <h3>Recent Appointments</h3>
            <a href="/" className="view-link">
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
              {data.appointments.map((appointment, index) => (
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
