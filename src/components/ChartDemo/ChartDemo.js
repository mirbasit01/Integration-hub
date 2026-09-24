import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsAction } from "../../redux/action/actions";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import "../ApiDemo/ApiDemo.css";

// Static demo data for charts
const staticData = [
  { name: "Mon", price: 120, volume: 400, users: 240 },
  { name: "Tue", price: 145, volume: 300, users: 139 },
  { name: "Wed", price: 132, volume: 600, users: 380 },
  { name: "Thu", price: 178, volume: 800, users: 430 },
  { name: "Fri", price: 165, volume: 500, users: 210 },
  { name: "Sat", price: 190, volume: 900, users: 520 },
  { name: "Sun", price: 210, volume: 750, users: 480 },
];

export default function ChartDemo() {
  const dispatch = useDispatch();
  const { data: apiData, loading } = useSelector((state) => state.prices);

  useEffect(() => { dispatch(fetchPostsAction()); }, [dispatch]);

  return (
    <div className="page-container">
      <h2 className="page-title">📊 Charts Integration</h2>
      <p className="page-desc">
        Using <code>recharts</code> for Line, Bar, and Area charts. Redux thunk fetches API data and maps it to chart format.
      </p>

      {/* Line Chart */}
      <div className="section">
        <h3>Line Chart — Price Over Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={staticData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #1e1e3a", color: "#fff" }} />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#7c6af7" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="section">
        <h3>Bar Chart — Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={staticData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #1e1e3a", color: "#fff" }} />
            <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart */}
      <div className="section">
        <h3>Area Chart — Users</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={staticData}>
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="name" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #1e1e3a", color: "#fff" }} />
            <Area type="monotone" dataKey="users" stroke="#06b6d4" fill="url(#userGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* API-driven chart */}
      <div className="section">
        <div className="section-header">
          <h3>API-Driven Chart (from Redux)</h3>
          {loading && <span style={{ color: "#888", fontSize: 13 }}>Loading...</span>}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={apiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
            <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 10 }} />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ background: "#0f0f1a", border: "1px solid #1e1e3a", color: "#fff" }} />
            <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
