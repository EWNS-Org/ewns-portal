'use client';

import React, { useState } from 'react'

function AppointmentConfiguration() {
    const [enabled, setEnabled] = useState(false);

    const handleUpdateSlotConfig = async () => {
        // TODO: dispatch update config action
    };

    const handleReset = () => {
        setEnabled(false);
    };

    return (
        <div className="appt-config-section">
            <h2 className="appt-section-title">Configuration</h2>
            <div className="appt-config-card">
                <div className="appt-config-row">
                    <div className="appt-config-info">
                        <span className="appt-config-label">Enable Appointments</span>
                        <span className="appt-config-desc">
                            Allow customers to book appointments through your website.
                        </span>
                    </div>
                    <label className="appt-toggle">
                        <input
                            type="checkbox"
                            className="appt-toggle-input"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                        />
                        <span className="appt-toggle-slider" />
                    </label>
                </div>

                <div className="appt-config-actions">
                    <button className="appt-btn appt-btn--outline" onClick={handleReset}>
                        Reset
                    </button>
                    <button className="appt-btn appt-btn--primary" onClick={handleUpdateSlotConfig}>
                        Update Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AppointmentConfiguration