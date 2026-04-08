import api from "./api";

export const predictPremium = async (data) => {
  const res = await api.post("/api/predict/", data);
  return res.data;
};