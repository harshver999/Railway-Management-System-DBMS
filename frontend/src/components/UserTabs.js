import { useState } from "react";
import BookTicketForm from "./BookTicket.js";
import CancelTicketForm from "./CancelTicket.js";
import { Users } from "lucide-react";

export default function UserTabs() {
  const [activeForm, setActiveForm] = useState("book");

  return (
    <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg shadow-xl p-6 mb-8 border border-slate-100 relative overflow-hidden backdrop-blur-sm bg-white/80">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full opacity-10 blur-2xl"></div>

      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-800 via-slate-700 to-blue-800 bg-clip-text text-transparent flex items-center relative z-10">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-white rounded-lg shadow-sm mr-2">
          <Users className="w-5 h-5 text-purple-700" />
        </div>
        Book / Cancel Ticket
      </h2>

      <div className="flex space-x-4 mb-6 relative z-10">
        <button
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none ${
            activeForm === "book"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 border border-gray-200"
          }`}
          onClick={() => setActiveForm("book")}
        >
          Book Ticket
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none ${
            activeForm === "cancel"
              ? "bg-red-600  text-white"
              : "bg-white text-slate-700 border border-gray-200"
          }`}
          onClick={() => setActiveForm("cancel")}
        >
          Cancel Ticket
        </button>
      </div>

      <div className="relative z-10">
        {activeForm === "book" ? <BookTicketForm /> : <CancelTicketForm />}
      </div>
    </div>
  );
}
