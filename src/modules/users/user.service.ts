import { getUsers } from "./user.repository";

export const fetchUsers = async () => {
  return getUsers();
};
