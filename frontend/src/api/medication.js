
import api from "../api";

export const getMedicationSchedule = async (userId) => {
  try {
    const res = await api.get(`/api/prescriptions/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to load medication schedule.");
  }
};

export const markMedicationTaken = async (prescriptionId) => {
  try {
    const res = await api.put(`/api/prescriptions/mark-taken/${prescriptionId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to mark medication as taken.");
  }
};
