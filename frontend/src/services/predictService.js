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

export const downloadReport = (id) => {
  const token = localStorage.getItem("token");
  window.open(
    `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/predict/report/${id}?token=${token}`,
    "_blank",
  );
};