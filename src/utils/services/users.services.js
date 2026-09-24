import axiosClient from "../axiosClient";

export const getUsersService = async () => {
  try {
    const response = await axiosClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("getUsersService error:", error);
  }
};

export const getUserByIdService = async (id) => {
  try {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("getUserByIdService error:", error);
  }
};
