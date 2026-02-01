import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/api";

export default function AddJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED", job);

    try {
      await createJob(job);
      navigate("/"); // ✅ redirect to dashboard
    } catch (err) {
      console.error("Error saving job", err);
      alert("Backend not reachable. Is Spring Boot running?");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Add Job</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          name="role"
          placeholder="Role"
          value={job.role}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="date"
          name="appliedDate"
          value={job.appliedDate}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="status"
          value={job.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={job.notes}
          onChange={handleChange}
          style={{ ...inputStyle, height: "80px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#1677ff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Save Job
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};
