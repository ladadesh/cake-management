import api from "./api";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "staff" | "delivery" | "chef";
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get("/api/users");
  return data;
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const { data } = await api.put(`/api/users/${id}`, userData);
  return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { data } = await api.delete(`/api/users/${userId}`);

  if (!data) {
    const errorData = await data.json();
    throw new Error(errorData.message || "Failed to delete user");
  }
};
