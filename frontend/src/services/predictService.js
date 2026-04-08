import api from "./api";

export const predictPremium = async (data) => {
  const res = await api.post("/api/predict/", data);
  return res.data;
};

export const predictGuest = async (data) => {
  const res = await api.post("/api/predict/guest", data);
  return res.data;
};