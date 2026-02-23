import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";

const mockUsers = [
  { id: 1, name: "Aarav Patil", city: "Nagpur", status: "active" },
  { id: 2, name: "Sneha Kale", city: "Mumbai", status: "active" },
  { id: 3, name: "Rohit Sharma", city: "Pune", status: "inactive" },
  { id: 4, name: "Meera Joshi", city: "Nagpur", status: "active" },
  { id: 5, name: "Kabir Singh", city: "Nashik", status: "active" },
];

const mockResorts = [
  { id: 101, name: "Elite Resort – Sea View", city: "Goa", category: "Luxury", status: "active", rooms: 62, priceFrom: 8999 },
  { id: 102, name: "Elite Resort – Hill Retreat", city: "Mahabaleshwar", category: "Nature", status: "active", rooms: 40, priceFrom: 6999 },
  { id: 103, name: "Elite Resort – City Premium", city: "Mumbai", category: "Business", status: "active", rooms: 55, priceFrom: 9999 },
  { id: 104, name: "Elite Resort – Budget Stay", city: "Nagpur", category: "Budget", status: "inactive", rooms: 28, priceFrom: 2999 },
  { id: 105, name: "Elite Resort – Lake Villa", city: "Udaipur", category: "Luxury", status: "active", rooms: 22, priceFrom: 14999 },
];

const mockContacts = [
  { id: 201, name: "Ananya", email: "ananya@mail.com", query: "Room availability for 3 nights?", date: "2026-02-18", status: "pending" },
  { id: 202, name: "Sahil", email: "sahil@mail.com", query: "Wedding event booking", date: "2026-02-20", status: "pending" },
  { id: 203, name: "Isha", email: "isha@mail.com", query: "Pool timings?", date: "2026-02-21", status: "resolved" },
];

function normalizeCity(city) {
  return (city || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function groupCount(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

function MetricCard({ title, value, icon, iconBg, iconColor }) {
  return (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="card metric-card h-100">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`metric-icon ${iconBg} ${iconColor}`}>
            <i className={`bi ${icon}`} />
          </div>
          <div className="flex-grow-1">
            <div className="metric-title">{title}</div>
            <div className="metric-value">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarList({ title, items }) {
  const max = useMemo(() => Math.max(1, ...items.map((i) => i.value)), [items]);

  return (
    <div className="card soft-card h-100">
      <div className="card-header soft-card-header d-flex align-items-center gap-2">
        <span className="soft-card-badge">
          <i className="bi bi-graph-up-arrow" />
        </span>
        <span className="soft-card-title">{title}</span>
      </div>

      <div className="card-body">
        <div className="barlist">
          {items.map((row) => {
            const pct = Math.round((row.value / max) * 100);
            return (
              <div className="barrow" key={row.label}>
                <div className="barrow-label">{row.label}</div>
                <div className="barrow-track">
                  <div className="barrow-fill bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="barrow-value">{row.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [resorts, setResorts] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setResorts(mockResorts);
      setContacts(mockContacts);
      setLoading(false);
    }, 400);
  }, []);

  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalRooms = resorts.reduce((acc, r) => acc + r.rooms, 0);
    const activeRooms = resorts.filter(r => r.status === "active")
                               .reduce((acc, r) => acc + r.rooms, 0);
    const inactiveRooms = totalRooms - activeRooms;

    return { totalUsers, totalRooms, activeRooms, inactiveRooms };
  }, [users, resorts]);

  const resortsByCategory = useMemo(() => {
    return groupCount(resorts, r => r.category.toLowerCase());
  }, [resorts]);

  const usersByCity = useMemo(() => {
    return groupCount(users, u => normalizeCity(u.city));
  }, [users]);

  const activeRoomsList = useMemo(() => {
    return resorts
      .filter(r => r.status === "active")
      .map(r => ({
        name: r.name,
        rooms: r.rooms,
        price: r.priceFrom
      }));
  }, [resorts]);

  return (
    <div className="container-fluid px-3 px-lg-4 py-4 dashboard-wrap">
      <h2 className="page-title mb-4">Dashboard</h2>

      {/* KPI */}
      <div className="row g-3 g-lg-4 mb-4">
        <MetricCard title="Total Users" value={metrics.totalUsers} icon="bi-people" iconBg="bg-primary-subtle" iconColor="text-primary" />
        <MetricCard title="Total Rooms" value={metrics.totalRooms} icon="bi-building" iconBg="bg-success-subtle" iconColor="text-success" />
        <MetricCard title="Active Rooms" value={metrics.activeRooms} icon="bi-check-circle" iconBg="bg-info-subtle" iconColor="text-info" />
        <MetricCard title="Inactive Rooms" value={metrics.inactiveRooms} icon="bi-x-circle" iconBg="bg-danger-subtle" iconColor="text-danger" />
      </div>

      {/* Charts */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12 col-lg-6">
          <BarList title="Rooms by Category" items={resortsByCategory} />
        </div>
        <div className="col-12 col-lg-6">
          <BarList title="Users by City" items={usersByCity} />
        </div>
      </div>

      {/* Active Rooms Table */}
      <div className="card soft-card">
        <div className="card-header soft-card-header">
          <h5 className="fw-bold mb-0">Active Rooms</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 table-soft">
            <thead>
              <tr>
                <th>Resort</th>
                <th className="text-end">Rooms</th>
                <th className="text-end">Price From</th>
              </tr>
            </thead>
            <tbody>
              {activeRoomsList.map((r, index) => (
                <tr key={index}>
                  <td>{r.name}</td>
                  <td className="text-end">{r.rooms}</td>
                  <td className="text-end fw-semibold">
                    ₹{r.price.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}