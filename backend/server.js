// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors({}));
app.use(express.json());

const PORT = 5000;

// ---- PASSENGERS ----
app.get("/api/passengers", (req, res) => {
  db.query("SELECT * FROM passengers", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/passengers", (req, res) => {
  const {
    passenger_ID,
    name,
    age,
    category,
    contact,
    email,
    address,
    concession,
  } = req.body;
  const sql = `INSERT INTO passengers VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [passenger_ID, name, age, category, contact, email, address, concession],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Passenger added" });
    }
  );
});

// ---- STATIONS ----
app.get("/api/stations", (req, res) => {
  db.query("SELECT * FROM stations", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/stations", (req, res) => {
  const { station_ID, station_name } = req.body;
  db.query(
    "INSERT INTO stations VALUES (?, ?)",
    [station_ID, station_name],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Station added" });
    }
  );
});

// ---- TRAINS ----
app.get("/api/trains", (req, res) => {
  db.query("SELECT * FROM trains", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/trains", (req, res) => {
  const { train_ID, train_name, route_ID, running_days } = req.body;
  db.query(
    "INSERT INTO trains VALUES (?, ?, ?, ?)",
    [train_ID, train_name, route_ID, running_days],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Train added" });
    }
  );
});

// ---- ROUTES ----
app.get("/api/routes", (req, res) => {
  db.query("SELECT * FROM routes", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/routes", (req, res) => {
  const { route_ID, station_ID, arrival, departure, day, duration, distance } =
    req.body;
  const sql = `INSERT INTO routes VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [route_ID, station_ID, arrival, departure, day, duration, distance],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Route added" });
    }
  );
});

// ---- SEATS ----
app.get("/api/seats", (req, res) => {
  db.query("SELECT * FROM seats", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/seats", (req, res) => {
  const {
    seat_ID,
    train_ID,
    class: seatClass,
    coach,
    berth,
    seat_number,
  } = req.body;
  const sql = `INSERT INTO seats VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [train_ID, seatClass, coach, berth, seat_number, seat_ID],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Seat added" });
    }
  );
});

// ---- TICKETS ----
app.get("/api/tickets", (req, res) => {
  db.query("SELECT * FROM tickets", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/tickets", (req, res) => {
  const {
    ticket_number,
    pnr,
    passenger_ID,
    seat_ID,
    origin_station,
    origin_time,
    destination_station,
    destination_time,
    fees,
    status,
    train_ID,
  } = req.body;
  const sql = `INSERT INTO tickets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      ticket_number,
      pnr,
      passenger_ID,
      seat_ID,
      origin_station,
      origin_time,
      destination_station,
      destination_time,
      fees,
      status,
      train_ID,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Ticket booked" });
    }
  );
});

// ---- STATUS ----
app.get("/api/status", (req, res) => {
  db.query("SELECT * FROM status", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/status", (req, res) => {
  const { pnr, purchase_time, status, ticket_number } = req.body;
  db.query(
    "INSERT INTO status VALUES (?, ?, ?, ?)",
    [pnr, purchase_time, status, ticket_number],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Status recorded" });
    }
  );
});

// server.js updates
app.post("/api/pnr", (req, res) => {
  const { pnr } = req.body;
  const sql = `SELECT 
    t.ticket_number,
    t.pnr,
    p.name AS passenger_name,
    tr.train_name,
    t.origin_station,
    os.station_name AS origin_station_name,
    t.destination_station,
    ds.station_name AS destination_station_name,
    t.journey_date,
    t.status
FROM 
    tickets t
JOIN 
    passengers p ON t.passenger_ID = p.passenger_ID
JOIN 
    trains tr ON t.train_ID = tr.train_ID
JOIN 
    stations os ON t.origin_station = os.station_ID
JOIN 
    stations ds ON t.destination_station = ds.station_ID
WHERE 
    t.pnr = ?;  -- Replace with the desired PNR value
`;
  db.query(sql, [pnr], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/trains_search", (req, res) => {
  const { origin, destination } = req.body;
  const sql = `
      SELECT t.train_ID, t.train_name
      FROM trains t
      JOIN stations s1 ON s1.station_name = ?
      JOIN stations s2 ON s2.station_name = ?
      JOIN routes r1 ON t.route_ID = r1.route_ID AND r1.station_ID = s1.station_ID
      JOIN routes r2 ON t.route_ID = r2.route_ID AND r2.station_ID = s2.station_ID
      WHERE r1.distance < r2.distance`;

  db.query(sql, [origin, destination], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/seats_availability", (req, res) => {
  const { origin, destination, date } = req.body;
  const sql = `SELECT
t.train_ID,
t.train_name,
s.class,
COUNT(s.seat_ID) AS total_seats,
COUNT(s.seat_ID) - COUNT(ticket_number) AS available_seats,
('2025-04-15') AS journey_day
FROM trains t
JOIN routes r1 ON r1.route_ID = t.route_ID
JOIN routes r2 ON r2.route_ID = t.route_ID
JOIN stations s1 ON s1.station_ID = r1.station_ID AND s1.station_name = ?
JOIN stations s2 ON s2.station_ID = r2.station_ID AND s2.station_name = ?
JOIN seats s ON s.train_ID = t.train_ID
LEFT JOIN tickets ON tickets.train_ID = t.train_ID
AND tickets.seat_ID = s.seat_ID
AND tickets.origin_station = s1.station_ID
AND tickets.destination_station = s2.station_ID
AND tickets.journey_date = ? -- Replace with dynamic date
WHERE r1.distance < r2.distance
AND SUBSTRING(t.running_days, WEEKDAY(?) + 1, 1) = '1' -- Only running trains
GROUP BY t.train_ID, t.train_name, s.class, journey_day;
`;

  db.query(sql, [origin, destination, date, date], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/passenger_list", (req, res) => {
  const { trainId, date } = req.body;
  const sql = `
      SELECT p.passenger_ID, p.name, p.age, p.category, p.contact 
      FROM passengers p
      JOIN tickets t ON p.passenger_ID = t.passenger_ID
      WHERE t.train_ID = ? AND t.journey_date = ?`;

  db.query(sql, [trainId, date], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/wait_list", (req, res) => {
  const { trainId } = req.body;
  const sql = `SELECT 
  p.passenger_ID,
  p.name,
  p.age,
  p.category,
  p.contact,
  p.email,
  p.address,
  p.concession,
  t.ticket_number,
  t.pnr,
  t.seat_ID,
  t.origin_station,
  t.origin_time,
  t.destination_station,
  t.destination_time,
  t.fees,
  t.train_ID,
  t.journey_date
FROM 
  passengers p
JOIN 
  tickets t ON p.passenger_ID = t.passenger_ID
WHERE 
  t.train_ID = ?         -- Replace with the desired train ID
  AND t.status = 'WL';      -- Only waitlisted passengers`;

  db.query(sql, [trainId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/traincancel_refund", (req, res) => {
  const { trainId } = req.body;
  const sql = `SELECT train_ID, SUM(
        CASE 
            WHEN status = 'CNF' THEN fees * 0.80   -- 20% cancellation charge
            WHEN status = 'WL' THEN fees *0.90
            when status='RAC' then fees
            ELSE 0
        END
    ) AS total_refund
FROM tickets
WHERE train_ID = ?
GROUP BY train_ID;`;

  db.query(sql, [trainId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/revenue", (req, res) => {
  const { from, to } = req.body;
  const sql = `SELECT SUM(t.fees) AS total_fees
FROM tickets t
JOIN status s ON s.ticket_number = t.ticket_number
WHERE s.purchase_time BETWEEN ? AND ?;
`;

  db.query(sql, [from, to], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/cancel_records", (req, res) => {
  const {} = req.body;
  const sql = `SELECT 
    c.ticket_number,
    c.passenger_ID,
    p.name AS passenger_name,
    t.train_name,
    c.amount AS cancelled_amount,
    c.timestamp AS cancellation_time,
    r.amount AS refunded_amount,
    r.timestamp AS refund_time,
    CASE 
        WHEN r.log_id IS NOT NULL THEN 'Refunded'
        ELSE 'Not Refunded'
    END AS refund_status
FROM ticket_logs c
LEFT JOIN ticket_logs r 
    ON c.ticket_number = r.ticket_number 
    AND c.passenger_ID = r.passenger_ID
    AND c.train_ID = r.train_ID
    AND r.action = 'REFUNDED'
JOIN passengers p ON c.passenger_ID = p.passenger_ID
JOIN trains t ON c.train_ID = t.train_ID
WHERE c.action = 'CANCELLED';
`;

  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/busy_route", (req, res) => {
  const {} = req.body;
  const sql = `SELECT 
    r.route_ID,
    COUNT(t.ticket_number) AS passenger_count
FROM tickets t
JOIN trains tr ON t.train_ID = tr.train_ID
JOIN routes r ON tr.route_ID = r.route_ID
GROUP BY r.route_ID
ORDER BY passenger_count DESC
LIMIT 1;
`;

  db.query(sql, [], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/bill", (req, res) => {
  const { ticketId } = req.body;
  const sql = `SELECT 
    t.ticket_number,
    p.name AS passenger_name,
    p.category AS passenger_category,
    tr.train_name,
    os.station_name AS origin_station,
    ds.station_name AS destination_station,
    t.journey_date,
    s.class AS seat_class,
    -- Calculate the distance between stations
    (r_dest.distance - r_orig.distance) AS distance,
    -- Base fare: Distance * Price per Kilometer (2 Rs/km)
    (r_dest.distance - r_orig.distance) * 2 AS base_fare,
    -- Adjust base fare based on seat class
    CASE 
        WHEN s.class = '1A' THEN (r_dest.distance - r_orig.distance) * 2 * 1.8
        WHEN s.class = '2A' THEN (r_dest.distance - r_orig.distance) * 2 * 1.5
        WHEN s.class = '3A' THEN (r_dest.distance - r_orig.distance) * 2 * 1.3
        WHEN s.class = 'EA' THEN (r_dest.distance - r_orig.distance) * 2 * 1.7
        WHEN s.class = 'EC' THEN (r_dest.distance - r_orig.distance) * 2 * 1.6
        WHEN s.class = 'FC' THEN (r_dest.distance - r_orig.distance) * 2 * 1.8
        WHEN s.class = '3E' THEN (r_dest.distance - r_orig.distance) * 2 * 1.2
        WHEN s.class = 'CC' THEN (r_dest.distance - r_orig.distance) * 2 * 1.4
        WHEN s.class = 'SL' THEN (r_dest.distance - r_orig.distance) * 2 * 1.0
        WHEN s.class = '2S' THEN (r_dest.distance - r_orig.distance) * 2 * 1.0
        ELSE (r_dest.distance - r_orig.distance) * 2
    END AS adjusted_fare,
    -- Standard concession rates based on passenger category
    CASE 
        WHEN p.category = 'Senior Citizen' THEN 40.00
        WHEN p.category = 'Student' THEN 20.00
        WHEN p.category = 'Child' THEN 50.00
        -- You can add 'Disabled' category when database is updated
        -- WHEN p.category = 'Disabled' THEN 75.00
        ELSE COALESCE(p.concession, 0)
    END AS standard_concession_rate,
    -- Apply concessions based on passenger category
    ROUND(
        CASE 
            WHEN s.class = '1A' THEN (r_dest.distance - r_orig.distance) * 2 * 1.8 * 
                CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END
            WHEN s.class = '2A' THEN (r_dest.distance - r_orig.distance) * 2 * 1.5 * 
                CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END
            -- Similar pattern for other classes
            WHEN s.class IN ('3A', 'EA', 'EC', 'FC', '3E', 'CC', 'SL', '2S') THEN 
                (r_dest.distance - r_orig.distance) * 2 * 
                CASE 
                    WHEN s.class = '3A' THEN 1.3
                    WHEN s.class = 'EA' THEN 1.7
                    WHEN s.class = 'EC' THEN 1.6
                    WHEN s.class = 'FC' THEN 1.8
                    WHEN s.class = '3E' THEN 1.2
                    WHEN s.class = 'CC' THEN 1.4
                    WHEN s.class = 'SL' THEN 1.0
                    WHEN s.class = '2S' THEN 1.0
                    ELSE 1.0
                END * 
                CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END
            ELSE 0
        END, 2) AS concession_amount,
    -- Tax (5% of the adjusted fare after concession)
    ROUND(
        CASE 
            WHEN s.class IN ('1A', '2A', '3A', 'EA', 'EC', 'FC', '3E', 'CC', 'SL', '2S') THEN 
                (r_dest.distance - r_orig.distance) * 2 * 
                CASE 
                    WHEN s.class = '1A' THEN 1.8
                    WHEN s.class = '2A' THEN 1.5
                    WHEN s.class = '3A' THEN 1.3
                    WHEN s.class = 'EA' THEN 1.7
                    WHEN s.class = 'EC' THEN 1.6
                    WHEN s.class = 'FC' THEN 1.8
                    WHEN s.class = '3E' THEN 1.2
                    WHEN s.class = 'CC' THEN 1.4
                    WHEN s.class = 'SL' THEN 1.0
                    WHEN s.class = '2S' THEN 1.0
                    ELSE 1.0
                END * 
                (1 - CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END) * 0.05
            ELSE 0
        END, 2) AS tax,
    -- Fixed service charge
    20.00 AS service_charge,
    -- Final total fare
    ROUND(
        CASE 
            WHEN s.class IN ('1A', '2A', '3A', 'EA', 'EC', 'FC', '3E', 'CC', 'SL', '2S') THEN 
                -- Adjusted fare with class multiplier
                (r_dest.distance - r_orig.distance) * 2 * 
                CASE 
                    WHEN s.class = '1A' THEN 1.8
                    WHEN s.class = '2A' THEN 1.5
                    WHEN s.class = '3A' THEN 1.3
                    WHEN s.class = 'EA' THEN 1.7
                    WHEN s.class = 'EC' THEN 1.6
                    WHEN s.class = 'FC' THEN 1.8
                    WHEN s.class = '3E' THEN 1.2
                    WHEN s.class = 'CC' THEN 1.4
                    WHEN s.class = 'SL' THEN 1.0
                    WHEN s.class = '2S' THEN 1.0
                    ELSE 1.0
                END * 
                -- Apply concession based on passenger category
                (1 - CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END)
            ELSE 0
        END
        + 
        -- Add tax amount
        CASE 
            WHEN s.class IN ('1A', '2A', '3A', 'EA', 'EC', 'FC', '3E', 'CC', 'SL', '2S') THEN 
                (r_dest.distance - r_orig.distance) * 2 * 
                CASE 
                    WHEN s.class = '1A' THEN 1.8
                    WHEN s.class = '2A' THEN 1.5
                    WHEN s.class = '3A' THEN 1.3
                    WHEN s.class = 'EA' THEN 1.7
                    WHEN s.class = 'EC' THEN 1.6
                    WHEN s.class = 'FC' THEN 1.8
                    WHEN s.class = '3E' THEN 1.2
                    WHEN s.class = 'CC' THEN 1.4
                    WHEN s.class = 'SL' THEN 1.0
                    WHEN s.class = '2S' THEN 1.0
                    ELSE 1.0
                END * 
                (1 - CASE 
                    WHEN p.category = 'Senior Citizen' THEN 0.40
                    WHEN p.category = 'Student' THEN 0.20
                    WHEN p.category = 'Child' THEN 0.50
                    -- WHEN p.category = 'Disabled' THEN 0.75
                    ELSE COALESCE(p.concession, 0) / 100
                END) * 0.05
            ELSE 0
        END
        + 
        -- Add service charge
        20.00, 2) AS total_amount
FROM 
    tickets t
JOIN 
    passengers p ON t.passenger_ID = p.passenger_ID
JOIN 
    trains tr ON t.train_ID = tr.train_ID
JOIN 
    stations os ON t.origin_station = os.station_ID
JOIN 
    stations ds ON t.destination_station = ds.station_ID
JOIN 
    routes r_orig ON tr.route_ID = r_orig.route_ID AND t.origin_station = r_orig.station_ID
JOIN 
    routes r_dest ON tr.route_ID = r_dest.route_ID AND t.destination_station = r_dest.station_ID
JOIN 
    seats s ON t.seat_ID = s.seat_ID
WHERE 
    t.ticket_number = ?;
`;

  db.query(sql, [ticketId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/api/book_ticket", (req, res) => {
  const { passenger_ID, train_ID, Class, origin, destination, date } = req.body;
  const sql = `CALL book_ticket(?, ?, ?, ?, ?, ?) `;

  db.query(
    sql,
    [passenger_ID, train_ID, Class, origin, destination, date],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.post("/api/cancel_ticket", (req, res) => {
  const { pnr, reason } = req.body;
  const sql = `CALL cancel_ticket(?, ?)`;

  db.query(sql, [pnr, reason], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
