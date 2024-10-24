import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import {
  FaUsers,
  FaEnvelope,
  FaChartLine,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaHeart,
  FaChartBar, // Added icon for new card
} from "react-icons/fa";

const Seo = () => {
  const SeoData = {
    cards: {
      totalVisits: 8245,
      contactAttempts: 235,
      mostEngagedPage: "Contact Us Page",
      avgVisitDuration: "3m 45s",
      newUsers: 150, // New card data
    },
    trafficSources: [
      ["Source", "Visits"],
      ["Direct", 400],
      ["Search Engine", 500],
      ["Social Media", 250],
      ["Referrals", 150],
      ["Ads", 100],
    ],
    dailyStats: [
      ["Date", "Total Visits", "Contact Attempts"],
      ["2024-10-01", 400, 25],
      ["2024-10-02", 350, 30],
      ["2024-10-03", 500, 28],
      ["2024-10-04", 450, 20],
      ["2024-10-05", 600, 35],
    ],
    recentActivities: [
      "500 users visited the home page",
      "Contact form submitted by John Doe",
      "50 new visitors from Google search",
      "5 inquiries made via the contact page",
      "New referral traffic from social media",
    ],
    notifications: [
      "🔔 Your website hit a new traffic peak today!",
      "🔔 25 contact form submissions today.",
      "🔔 User engagement on 'About Us' page increased by 20%.",
      "🔔 5-star review received from a new visitor!",
      "🔔 Social media traffic increased by 15% this week.",
    ],
  };

  const [data, setData] = useState(SeoData);

  useEffect(() => {
    setData(SeoData); // Simulate fetching data
  }, []);

  const pieOptions = {
    title: "User Visits by Traffic Source",
    is3D: true,
    pieHole: 0.4,
    colors: ["#0152a8", "#e68a00", "#e74c3c", "#2ecc71", "#f4f4f4"],
  };

  const barOptions = {
    chart: {
      title: "Daily Website Traffic and User Contact Attempts",
      subtitle: "Total Visits vs. Contact Attempts Over the Last 5 Days",
    },
    colors: ["#0152a8", "#e68a00"],
  };

  return (
    <div className="Seo-container">
      <div className="Seo-header">
        <h2>Website Analytics</h2>
        <p>Get insights into your website traffic and user engagement</p>
      </div>

      <div className="Seo-cards">
        {Object.entries(data.cards).map(([key, value], index) => (
          <div className="Seo-card" key={index}>
            {key === "totalVisits" && (
              <FaUsers className="card-icon text-2xl" />
            )}
            {key === "contactAttempts" && (
              <FaEnvelope className="card-icon text-2xl" />
            )}
            {key === "mostEngagedPage" && (
              <FaChartLine className="card-icon text-2xl" />
            )}
            {key === "avgVisitDuration" && (
              <FaClock className="card-icon text-2xl" />
            )}
            {key === "newUsers" && ( // New card condition
              <FaChartBar className="card-icon text-2xl" />
            )}
            <h3>{key.replace(/([A-Z])/g, " $1").trim()}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="chart">
          <Chart
            chartType="PieChart"
            data={data.trafficSources}
            options={pieOptions}
            width={"100%"}
            height={"300px"}
          />
        </div>
        <div className="chart">
          <Chart
            chartType="Bar"
            data={data.dailyStats}
            options={barOptions}
            width={"100%"}
            height={"300px"}
          />
        </div>
      </div>

      <div className="activity-notifications">
        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <ul>
            {data.recentActivities.map((activity, index) => (
              <li key={index}>
                {activity.includes("visited") && (
                  <FaArrowRight className="activity-icon" />
                )}
                {activity.includes("submitted") && (
                  <FaEnvelope className="activity-icon" />
                )}
                {activity.includes("new visitors") && (
                  <FaSearch className="activity-icon" />
                )}
                {activity.includes("inquiries") && (
                  <FaEnvelope className="activity-icon" />
                )}
                {activity.includes("referral") && (
                  <FaHeart className="activity-icon" />
                )}
                {activity}
              </li>
            ))}
          </ul>
        </div>

        <div className="notifications">
          <h3>Notifications</h3>
          <ul>
            {data.notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Seo;
