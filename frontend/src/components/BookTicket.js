import { useState, useEffect } from "react";
import axios from "axios";

export default function BookTicketForm() {
  const [step, setStep] = useState(1);
  const [stations, setStations] = useState([]);
  const [availableTrains, setAvailableTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [formData, setFormData] = useState({
    passenger_ID: "",
    from: "",
    to: "",
    fromID: "",
    toID: "",
    date: "",
    name: "",
    age: "",
    category: "Adult",
    contact: "",
    email: "",
    address: "",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [ticketBooked, setTicketBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stations");
        setStations(res.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchTrains = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/seats_availability",
        {
          origin: formData.from,
          destination: formData.to,
          date: formData.date,
        }
      );

      if (res.data.length === 0) {
        setError("No trains found for this route.");
      }
      setAvailableTrains(res.data);
      setStep(2);
    } catch (error) {
      console.error("Error fetching train schedule:", error);
      setError("Failed to fetch train schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async () => {
    setIsBooking(true);
    setError("");

    try {
      // Insert passenger first
      const passengerRes = await axios.post(
        "http://localhost:5000/api/passengers",
        {
          passenger_ID: formData.passenger_ID,
          name: formData.name,
          age: Number(formData.age),
          category: formData.category,
          contact: formData.contact,
          email: formData.email,
          address: formData.address || "", // Default if undefined
          concession:
            formData.category === "Senior Citizen" ||
            formData.category === "Disabled Citizen"
              ? 0.05
              : formData.category === "Student"
              ? 0.1
              : formData.category === "Child"
              ? 1.0
              : 0,
        }
      );

      if (passengerRes.status !== 200) {
        setError("Failed to add passenger.");
        return;
      }

      // Then book the ticket
      const ticketRes = await axios.post(
        "http://localhost:5000/api/book_ticket",
        {
          passenger_ID: formData.passenger_ID,
          train_ID: selectedTrain.train_ID,
          Class: selectedTrain.class,
          origin: formData.fromID,
          destination: formData.toID,
          date: formData.date,
        }
      );

      if (ticketRes.status === 200) {
        setTicketBooked(true);
        setStep(4);
      } else {
        setError("Failed to book ticket. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.sqlMessage || "An error occurred during booking."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <div className="text-red-600 font-medium">{error}</div>}

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>From Station</label>
            <select
              name="from"
              value={formData.fromID}
              onChange={(e) => {
                const selected = stations.find(
                  (s) => s.station_ID === e.target.value
                );
                setFormData({
                  ...formData,
                  fromID: e.target.value,
                  from: selected.station_name,
                });
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {stations.map((s) => (
                <option key={s.station_ID} value={s.station_ID}>
                  {s.station_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>To Station</label>
            <select
              name="to"
              value={formData.toID}
              onChange={(e) => {
                const selected = stations.find(
                  (s) => s.station_ID === e.target.value
                );
                setFormData({
                  ...formData,
                  toID: e.target.value,
                  to: selected.station_name,
                });
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {stations.map((s) => (
                <option key={s.station_ID} value={s.station_ID}>
                  {s.station_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="col-span-3">
            <button
              onClick={fetchTrains}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
            >
              Search Trains
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-semibold mb-4">Select a Train</h3>
          <ul className="space-y-3">
            {availableTrains.map((train) => (
              <li
                key={train.train_ID}
                className={`p-4 border rounded cursor-pointer ${
                  selectedTrain?.train_ID === train.train_ID
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-slate-50"
                }`}
                onClick={() => {
                  setSelectedTrain(train);
                  setStep(3);
                }}
              >
                <div className="font-medium">{train.train_name}</div>
                <div className="text-sm text-gray-600">
                  Train Number: {train.train_ID} | Name: {train.train_name} |
                  Class: {train.class}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="passenger_ID"
            value={formData.passenger_ID}
            onChange={handleChange}
            placeholder="ID"
            className="border rounded px-3 py-2"
          />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded px-3 py-2"
          />
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="border rounded px-3 py-2"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option>Adult</option>
            <option>Child</option>
            <option>Senior Citizen</option>
            <option>Disabled Citizen</option>
            <option>Student</option>
          </select>
          <input
            name="contact"
            type="number"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="border rounded px-3 py-2"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2"
          />
          <input
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="border rounded px-3 py-2"
          />

          <div className="md:col-span-2">
            <button
              onClick={bookTicket}
              className="bg-green-600 text-white px-6 py-2 mt-4 rounded shadow hover:bg-green-700"
              disabled={isBooking}
            >
              {isBooking ? "Processing..." : "Book Ticket"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && ticketBooked && (
        <div className="text-center py-8">
          <div className="text-2xl font-bold text-green-700">
            Ticket Booked Successfully with PNR Number 251237 !
          </div>
          <div className="text-gray-600 mt-2">
            An email confirmation has been sent.
          </div>
          <div className="mt-4 animate-pulse text-green-500 font-medium">
            Enjoy your journey 🚆
          </div>
        </div>
      )}
    </div>
  );
}
