"use client";

import { useState } from "react";
import axios from "axios";
import { BanknoteIcon, Loader2, SearchIcon } from "lucide-react";

function NetCancelRefund() {
  const [results, setResults] = useState([]);
  const [trainId, setTrainId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/traincancel_refund",
        { trainId }
      );

      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setError("No refund data found for this train.");
      }
    } catch (error) {
      console.error("Error fetching refund data:", error);
      setError("Failed to fetch refund data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6 border-b pb-4">
        <BanknoteIcon className="h-8 w-8 text-amber-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">
          Net Cancellation Refund
        </h1>
      </div>

      <div className="bg-amber-50 rounded-lg p-5 mb-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Train Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter train number (e.g. 1001)"
                value={trainId}
                onChange={(e) => setTrainId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Calculating...
                </>
              ) : (
                "Calculate Refund"
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Refund Details
          </h2>
        </div>

        <div className="overflow-x-auto">
          {results.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(results[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {Object.entries(item).map(([key, val], valIdx) => (
                        <td
                          key={valIdx}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {typeof val === "number" && key === "total_refund"
                            ? `₹${Number.parseFloat(val).toFixed(2)}`
                            : val}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {loading
                ? "Calculating refund data..."
                : "No refund data to display. Please enter a train number."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NetCancelRefund;
