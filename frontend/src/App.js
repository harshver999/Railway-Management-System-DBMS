"use client";

import { useEffect, useState } from "react";

import UserTabs from "./components/UserTabs";
import PNRStatus from "./components/PNRStatus";
import AvailableSeats from "./components/AvailableSeats";
import TrainSchedule from "./components/TrainSchedule";
import PassengersList from "./components/PassengersList";
import WaitList from "./components/WaitList";
import NetCancelRefund from "./components/NetCancelRefund";
import NetRevenue from "./components/NetRevenue";
import CancellationRecord from "./components/CancellationRecord";
import BusiestRoute from "./components/BusiestRoute";
import Bill from "./components/Bill";

import "./index.css";
import {
  Train,
  Users,
  Calendar,
  Ticket,
  ClipboardList,
  RefreshCw,
  DollarSign,
  XCircle,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { motion } from "framer-motion";

function App() {
  const [passengers, setPassengers] = useState([]);
  const [formData, setFormData] = useState({
    passenger_ID: "",
    name: "",
    age: "",
    category: "Adult",
    contact: "",
    email: "",
    address: "",
    concession: "",
  });
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/passengers");
      const data = await res.json();
      setPassengers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/passengers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          passenger_ID: Number.parseInt(formData.passenger_ID),
          age: Number.parseInt(formData.age),
          contact: Number.parseInt(formData.contact),
          concession: Number.parseFloat(formData.concession),
        }),
      });

      if (res.ok) {
        await fetchPassengers();

        // Show success notification
        const notification = document.getElementById("notification");
        notification.classList.remove("hidden");
        setTimeout(() => {
          notification.classList.add("hidden");
        }, 3000);

        // Reset form
        setFormData({
          passenger_ID: "",
          name: "",
          age: "",
          category: "Adult",
          contact: "",
          email: "",
          address: "",
          concession: "",
        });
      }
    } catch (error) {
      console.error("Error adding passenger:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTab = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      name: "PNR Status",
      icon: <Ticket className="w-4 h-4 mr-2" />,
      component: <PNRStatus />,
    },
    {
      name: "Train Schedule",
      icon: <Calendar className="w-4 h-4 mr-2" />,
      component: <TrainSchedule />,
    },
    {
      name: "Available Seats",
      icon: <ClipboardList className="w-4 h-4 mr-2" />,
      component: <AvailableSeats />,
    },
    {
      name: "Passenger List",
      icon: <Users className="w-4 h-4 mr-2" />,
      component: <PassengersList />,
    },
    {
      name: "Wait List",
      icon: <ClipboardList className="w-4 h-4 mr-2" />,
      component: <WaitList />,
    },
    {
      name: "Net Cancel Refund",
      icon: <RefreshCw className="w-4 h-4 mr-2" />,
      component: <NetCancelRefund />,
    },
    {
      name: "Net Revenue",
      icon: <DollarSign className="w-4 h-4 mr-2" />,
      component: <NetRevenue />,
    },
    {
      name: "Cancellation Records",
      icon: <XCircle className="w-4 h-4 mr-2" />,
      component: <CancellationRecord />,
    },
    {
      name: "Busiest Route",
      icon: <TrendingUp className="w-4 h-4 mr-2" />,
      component: <BusiestRoute />,
    },
    {
      name: "Bill",
      icon: <Receipt className="w-4 h-4 mr-2" />,
      component: <Bill />,
    },
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-blend-overlay bg-gradient-to-br from-slate-100 via-purple-50 to-blue-50 relative"
      style={{ backgroundImage: `url('/background_image.jpg')` }}
    >
      {/* Background decorative elements */}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-500 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-sky-900 via-blue-700 to-indigo-900
 text-white shadow-lg relative z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48cGF0aCBkPSJNMTIgMTJoNnY2aC02di02em02IDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 py-6 flex items-center relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-center relative z-10">
            <div className=" p-3 rounded-full mr-3 shadow-lg shadow-purple-500/20">
              <Train className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              Railway Passenger Manager
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Success Notification */}
        <div
          id="notification"
          className="hidden fixed top-4 right-4 bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 text-white px-6 py-3 rounded-md shadow-lg shadow-green-500/30 transition-all duration-300 z-50"
        >
          Passenger added successfully!
        </div>

        {/* Add Passenger Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <UserTabs />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-10 blur-2xl"></div>

            <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-800 via-slate-700 to-purple-800 bg-clip-text text-transparent relative z-10">
              Railway Management
            </h2>

            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow ${
                    activeTab === index
                      ? "bg-purple-600  text-white shadow-lg shadow-purple-500/20"
                      : "bg-gradient-to-r from-gray-50 to-white text-slate-700 hover:from-purple-50 hover:to-blue-50 border border-gray-200"
                  }`}
                  onClick={() => toggleTab(index)}
                >
                  <div
                    className={
                      activeTab === index ? "text-white" : "text-purple-600"
                    }
                  >
                    {tab.icon}
                  </div>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-6 border border-slate-100 shadow-inner relative z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-lg"></div>

              {activeTab !== null ? (
                <div className="relative z-10">{tabs[activeTab].component}</div>
              ) : (
                <div className="text-center py-12 text-gray-500 relative z-10">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <Train className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="bg-gradient-to-r from-slate-600 to-purple-600 bg-clip-text text-transparent font-medium">
                    Select a tab to view railway management information
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-sky-900 via-blue-700 to-indigo-900
 text-white py-6 shadow-inner relative z-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48cGF0aCBkPSJNMTIgMTJoNnY2aC02di02em02IDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-6 py-2  rounded-full backdrop-blur-sm">
            <p className="bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent">
              © {new Date().getFullYear()} Railway Passenger Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
