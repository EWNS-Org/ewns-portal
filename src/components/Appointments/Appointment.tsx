import React, { useState } from 'react'
import AppointmentConfiguration from './AppointmentsConfiguration';
import "./Appointment.css";
import AllAppointments from './AllAppointments';
import AppointmentsOverview from './AppointmentsOverview';

function Appointment() {
    const [activeTab, setActiveTab] = useState('Overview');
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const [filter, setFilter] = useState("ALL");

    return (
        <div className="w-full  h-[65vh] font-semibold font-sans" style={{ fontSize: "20px" }}>
            <div className="w-full py-1" style={{ display: "flex", backgroundColor: "white" }}>
                <div className="w-full" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {['Overview', 'All Appointments', 'Appointments Configuration'].map((tab) => (
                        <div
                            key={tab}
                            className={` w-full cursor-pointer py-2 ${activeTab === tab ? 'border-t-2 text-violet-500' : 'text-black-500'}`}
                            style={{ alignItems: "center", justifyContent: "center", display: "flex", borderColor: "rgba(89, 50, 234, 1)", color: "" }}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            <div className='container w-full py-4 ' style={{}}>
                {activeTab === 'Appointments Configuration' && <AppointmentConfiguration   />}
                {activeTab === 'All Appointments' && <AllAppointments  filter={filter} setFilter={setFilter}/>}
                {activeTab === 'Overview' && <AppointmentsOverview  setFilter={setFilter} setActiveTab={setActiveTab} />}
            </div>
        </div >
    )
}

export default Appointment