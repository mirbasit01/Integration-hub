import axiosClient from "../axiosClient";

export const getPostsService = async (limit = 5) => {
  try {
    const response = await axiosClient.get(`/posts?_limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("getPostsService error:", error);
  }
};

export const getPostByIdService = async (id) => {
  try {
    const response = await axiosClient.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("getPostByIdService error:", error);
  }
};

export const createPostService = async (title, body) => {
  try {
    const response = await axiosClient.post("/posts", { title, body, userId: 1 });
    return response.data;
  } catch (error) {
    console.error("createPostService error:", error);
  }
};

export const updatePostService = async (id, title, body) => {
  try {
    const response = await axiosClient.put(`/posts/${id}`, { title, body, userId: 1 });
    return response.data;
  } catch (error) {
    console.error("updatePostService error:", error);
  }
};

export const deletePostService = async (id) => {
  try {
    const response = await axiosClient.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("deletePostService error:", error);
  }
};
