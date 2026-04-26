import api from "./api";

export const predictPremium = async (data) => {
  const res = await api.post("/api/predict/", data);
  return res.data;
};

export const predictGuest = async (data) => {
  const res = await api.post("/api/predict/guest", data);
  return res.data;
};

export const whatIfSimulator = async (data) => {
  const res = await api.post("/api/predict/what-if", data);
  return res.data;
};

export const getHistory = async (page = 1) => {
  const res = await api.get(`/api/history/?page=${page}`);
  return res.data;
};

export const getStats = async () => {
  const res = await api.get("/api/history/stats/summary");
  return res.data;
};

export const deletePrediction = async (id) => {
  const res = await api.delete(`/api/history/${id}`);
  return res.data;
};

export const downloadReport = async (id) => {
  try {
    const res = await api.get(
      `/api/predict/report/${id}`,
      { responseType: "blob" }, // ← key fix
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `insurance_report_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Report download failed:", err);
    alert("Failed to download report. Please try again.");
  }
};