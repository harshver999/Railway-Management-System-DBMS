"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { XCircleIcon, Loader2, RefreshCwIcon } from "lucide-react";

function CancellationRecord() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/cancel_records",
        {}
      );

      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setError("No cancellation records found.");
      }
    } catch (error) {
      console.error("Error fetching cancellation records:", error);
      setError("Failed to fetch cancellation records. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center">
          <XCircleIcon className="h-8 w-8 text-rose-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Cancellation Records
          </h1>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCwIcon className="h-4 w-4 mr-1.5" />
          Refresh
        </button>
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
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Cancellation Records
          </h2>
          {results.length > 0 && (
            <span className="bg-rose-100 text-rose-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {results.length} records
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
              <span className="ml-2 text-gray-500">Loading records...</span>
            </div>
          ) : results.length > 0 ? (
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
                {results.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {Object.values(record).map((val, valIdx) => (
                      <td
                        key={valIdx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No cancellation records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CancellationRecord;
