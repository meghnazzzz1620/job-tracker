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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs();
      setJobs(res.data);
    } catch (e) {
      alert("Failed to load jobs");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = async (jobId, status) => {
    setActionLoading(true);
    await updateJobStatus(jobId, status);
    await loadJobs();
    setActionLoading(false);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    setActionLoading(true);
    await deleteJob(jobId);
    await loadJobs();
    setActionLoading(false);
  };

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

  if (loading) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        <h2>Loading your applications…</h2>
        <p>Please wait ⏳</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 My Applications</h2>

      {/* STATS */}
      <div style={statsGrid}>
        {Object.entries(stats).map(([label, value], i) => (
          <div key={label} style={{ ...statCard, borderTop: `4px solid ${COLORS[i]}` }}>
            <h2>{value}</h2>
            <p>{label}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={card}>
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

      {/* FILTER */}
      <div style={filterBar}>
        <input
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={input}>
          <option value="All">All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={input}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* JOB LIST */}
      {filteredJobs.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h3>No applications found 🚀</h3>
          <p>Try adding one or changing filters.</p>
        </div>
      ) : (
        filteredJobs.map((job) => (
          <div key={job.jobId} style={jobCard}>
            <div>
              <h3>{job.company}</h3>
              <p>{job.role}</p>
              <small>Applied on {job.appliedDate}</small>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={job.status}
                disabled={actionLoading}
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
                disabled={actionLoading}
                style={{
                  ...deleteBtn,
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* STYLES */

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  marginBottom: "30px",
};

const statCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  textAlign: "center",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
  marginBottom: "30px",
};

const filterBar = {
  display: "flex",
  gap: "12px",
  marginBottom: "25px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const jobCard = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  marginBottom: "15px",
  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};
