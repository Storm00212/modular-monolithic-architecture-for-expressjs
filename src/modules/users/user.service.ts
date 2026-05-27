import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "./user.repository";

export const fetchUsers = async () => {
  return getUsers();
};

export const findUserById = async (id: string) => {
  return getUserById(id);
};

export const updateUserService = async (id: string, data: { name?: string; email?: string }) => {
  return updateUser(id, data);
};

export const deleteUserService = async (id: string) => {
  return deleteUser(id);
};
