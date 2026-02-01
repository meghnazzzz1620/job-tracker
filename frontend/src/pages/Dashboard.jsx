import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getJobs,
  updateJobStatus,
  deleteJob,
} from "../services/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const loadJobs = async () => {
    const res = await getJobs();
    setJobs(res.data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = async (jobId, status) => {
    await updateJobStatus(jobId, status);
    loadJobs();
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    await deleteJob(jobId);
    loadJobs();
  };

  /* ---------------- FILTER + SORT ---------------- */
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!a.appliedDate || !b.appliedDate) return 0;
      return sortOrder === "newest"
        ? new Date(b.appliedDate) - new Date(a.appliedDate)
        : new Date(a.appliedDate) - new Date(b.appliedDate);
    });

  /* ---------------- STATS ---------------- */
  const stats = {
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  const chartData = Object.keys(stats).map((key) => ({
    name: key,
    value: stats[key],
  }));

  const COLORS = ["#facc15", "#38bdf8", "#22c55e", "#ef4444"];
  const theme = darkMode ? dark : light;

  return (
    <div style={{ ...container, background: theme.bg, color: theme.text }}>
      {/* HEADER */}
      <div style={header}>
        <h2>📊 My Applications</h2>
        <button onClick={() => setDarkMode(!darkMode)} style={toggleBtn}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        {Object.entries(stats).map(([label, value], i) => (
          <div
            key={label}
            style={{
              ...glassCard,
              background: gradientMap[label],
            }}
            className="hover-card"
          >
            <h1>{value}</h1>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* PIE CHART */}
      <div style={{ ...glassBox, background: theme.glass }}>
        <h3>Status Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={chartData} dataKey="value" label>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* FILTER BAR */}
      <div style={filterBar}>
        <input
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={input}
        >
          <option value="All">All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={input}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* JOB CARDS */}
      {filteredJobs.map((job) => (
        <div
          key={job.jobId}
          style={{ ...glassRow, background: theme.glass }}
          className="hover-card"
        >
          <div>
            <h3>{job.company}</h3>
            <p>{job.role}</p>
            <small>Applied on {job.appliedDate}</small>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={job.status}
              onChange={(e) =>
                handleStatusChange(job.jobId, e.target.value)
              }
              style={input}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>

            <button
              onClick={() => handleDelete(job.jobId)}
              style={deleteBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* HOVER ANIMATIONS */}
      <style>{`
        .hover-card {
          transition: all 0.35s ease;
        }
        .hover-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}

/* ---------------- THEMES ---------------- */

const light = {
  bg: "linear-gradient(135deg,#e0e7ff,#f8fafc)",
  text: "#0f172a",
  glass: "rgba(255,255,255,0.65)",
};

const dark = {
  bg: "linear-gradient(135deg,#020617,#0f172a)",
  text: "#f8fafc",
  glass: "rgba(30,41,59,0.65)",
};

/* ---------------- STYLES ---------------- */

const container = {
  minHeight: "100vh",
  padding: "40px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const toggleBtn = {
  padding: "8px 16px",
  borderRadius: "999px",
  border: "none",
  cursor: "pointer",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "22px",
  marginBottom: "35px",
};

const glassCard = {
  color: "#fff",
  padding: "30px",
  borderRadius: "22px",
  backdropFilter: "blur(14px)",
};

const gradientMap = {
  Applied: "linear-gradient(135deg,#facc15,#f97316)",
  Interview: "linear-gradient(135deg,#38bdf8,#2563eb)",
  Offer: "linear-gradient(135deg,#22c55e,#16a34a)",
  Rejected: "linear-gradient(135deg,#ef4444,#b91c1c)",
};

const glassBox = {
  padding: "28px",
  borderRadius: "22px",
  backdropFilter: "blur(14px)",
  marginBottom: "35px",
};

const filterBar = {
  display: "flex",
  gap: "14px",
  marginBottom: "30px",
};

const input = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
};

const glassRow = {
  padding: "26px",
  borderRadius: "22px",
  marginBottom: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backdropFilter: "blur(14px)",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  cursor: "pointer",
};
