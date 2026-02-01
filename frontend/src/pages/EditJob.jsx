import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../services/api";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    company: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    notes: "",
  });

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    const res = await getJobById(id);
    setJob(res.data);
  };

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateJob(id, job);
    navigate("/");
  };

  return (
    <div style={container}>
      <h2>Edit Job</h2>

      <form onSubmit={handleSubmit} style={form}>
        <input name="company" value={job.company} onChange={handleChange} placeholder="Company" required />
        <input name="role" value={job.role} onChange={handleChange} placeholder="Role" required />
        <input type="date" name="appliedDate" value={job.appliedDate} onChange={handleChange} />
        
        <select name="status" value={job.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <textarea name="notes" value={job.notes} onChange={handleChange} placeholder="Notes" />

        <button type="submit">Update Job</button>
      </form>
    </div>
  );
}

const container = {
  maxWidth: "500px",
  margin: "40px auto",
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};
