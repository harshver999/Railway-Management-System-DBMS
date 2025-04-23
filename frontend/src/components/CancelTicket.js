import { useState } from "react";
import axios from "axios";

export default function CancelTicketForm() {
  const [pnr, setPnr] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  // First validate the PNR exists before cancelling
  const validatePnr = async () => {
    if (!pnr.trim()) {
      setError("Please enter a PNR number");
      return false;
    }

    setIsValidating(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/pnr", {
        pnr: pnr,
      });

      if (res.data && res.data.length > 0) {
        setTicketDetails(res.data[0]);
        setIsValidating(false);
        return true;
      } else {
        setError("No ticket found with this PNR number");
        setIsValidating(false);
        return false;
      }
    } catch (err) {
      console.error("PNR validation error:", err);
      setError("Failed to validate PNR. Please try again.");
      setIsValidating(false);
      return false;
    }
  };

  const handleCancel = async () => {
    // First validate the PNR
    const isValid = await validatePnr();
    if (!isValid) return;

    setIsSubmitting(true);
    setError("");
    setErrorDetails(null);

    try {
      // Add request debugging
      console.log("Sending cancellation request with:", { pnr, reason });

      const res = await axios.post("http://localhost:5000/api/cancel_ticket", {
        pnr: pnr.trim(),
        reason: reason.trim() || "No reason provided",
      });

      console.log("Cancellation response:", res);

      if (res.status === 200) {
        setCancelled(true);
      } else {
        setError("Cancellation failed. Please try again.");
      }
    } catch (err) {
      console.error("Cancellation error:", err);

      // Enhanced error handling
      setError("An error occurred while canceling the ticket.");

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorData = err.response.data;
        console.error("Error response data:", errorData);

        setErrorDetails({
          status: err.response.status,
          data: errorData,
          message:
            errorData?.sqlMessage ||
            errorData?.message ||
            "Unknown server error",
        });
      } else if (err.request) {
        // The request was made but no response was received
        setErrorDetails({
          message:
            "No response received from server. Please check your connection.",
        });
      } else {
        // Something happened in setting up the request
        setErrorDetails({
          message: err.message || "Error setting up request",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPnr("");
    setReason("");
    setCancelled(false);
    setError("");
    setErrorDetails(null);
    setTicketDetails(null);
  };

  if (cancelled) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl font-bold text-red-600">Ticket Cancelled</div>
        <div className="text-gray-600 mt-2">Refund processed successfully.</div>
        <div className="mt-4 animate-pulse text-rose-400 font-medium">
          We hope to serve you again ❤️
        </div>
        <button
          onClick={resetForm}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Cancel Another Ticket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 font-medium p-3 rounded">
          {error}
          {errorDetails && (
            <div className="text-sm mt-2 text-red-500">
              Error details: {errorDetails.message}
            </div>
          )}
        </div>
      )}

      {ticketDetails && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="font-medium text-blue-800">Ticket Information</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>PNR Number:</div>
            <div className="font-medium">{ticketDetails.pnr}</div>
            <div>Passenger Name:</div>
            <div className="font-medium">{ticketDetails.passenger_name}</div>
            <div>Train:</div>
            <div className="font-medium">{ticketDetails.train_name}</div>
            <div>Journey:</div>
            <div className="font-medium">
              {ticketDetails.origin_station_name} to{" "}
              {ticketDetails.destination_station_name}
            </div>
            <div>Date:</div>
            <div className="font-medium">{ticketDetails.journey_date}</div>
            <div>Status:</div>
            <div className="font-medium">{ticketDetails.status}</div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-1">PNR Number</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          placeholder="Enter your PNR"
        />
      </div>

      <div>
        <button
          onClick={validatePnr}
          className="bg-blue-500 text-white px-4 py-1 rounded text-sm shadow hover:bg-blue-600"
          disabled={isValidating || !pnr.trim()}
        >
          {isValidating ? "Checking..." : "Verify PNR"}
        </button>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">
          Reason for Cancellation
        </label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional but appreciated"
        ></textarea>
      </div>

      <div>
        <button
          onClick={handleCancel}
          className="bg-red-600 text-white px-6 py-2 rounded shadow hover:bg-red-700"
          disabled={isSubmitting || !pnr.trim()}
        >
          {isSubmitting ? "Cancelling..." : "Cancel Ticket"}
        </button>
      </div>
    </div>
  );
}
