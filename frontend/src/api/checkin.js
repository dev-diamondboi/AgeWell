import api from "../api";

// ✅ Save a new check-in
export const saveCheckIn = async (data) => {
  try {
    const res = await api.post("/api/checkin", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    return error.response?.data?.message || "Failed to save check-in";
  }
};

// ✅ Get user's check-in history
export const getCheckIns = async () => {
  try {
    const res = await api.get("/api/checkin", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (error) {
    return [];
  }
};
