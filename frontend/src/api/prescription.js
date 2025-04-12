import api from "../api";

// For healthcare CRUD
export const getPrescriptions = async (userId) => {
  const res = await api.get(`/api/prescriptions/user/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const addPrescription = async (userId, data) => {
  const res = await api.post(`/api/prescriptions/user/${userId}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const deletePrescription = async (userId, prescriptionId) => {
  await api.delete(`/api/prescriptions/user/${userId}/${prescriptionId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePrescription = async (userId, prescriptionId, data) => {
  const res = await api.put(`/api/prescriptions/user/${userId}/${prescriptionId}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
