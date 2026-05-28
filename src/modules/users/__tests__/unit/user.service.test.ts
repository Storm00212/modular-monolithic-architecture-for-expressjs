import {
  fetchUsers,
  findUserById,
  updateUserService,
  deleteUserService,
} from '../../services/user.service';

const getUsers = jest.fn();
const getUserById = jest.fn();
const updateUser = jest.fn();
const deleteUser = jest.fn();

jest.mock('../../user.repository', () => ({
  getUsers: () => getUsers(),
  getUserById: () => getUserById(),
  updateUser: () => updateUser(),
  deleteUser: () => deleteUser(),
}));

describe('user.service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should return all users', async () => {
      getUsers.mockResolvedValue([mockUser]);

      const result = await fetchUsers();
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
    });
  });

  describe('findUserById', () => {
    it('should return user by ID', async () => {
      getUserById.mockResolvedValue(mockUser);

      const result = await findUserById('user-123');
      expect(result?.id).toBe('user-123');
    });

    it('should return null if user not found', async () => {
      getUserById.mockResolvedValue(null);

      const result = await findUserById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('updateUserService', () => {
    it('should update user with provided data', async () => {
      updateUser.mockResolvedValue({ ...mockUser, name: 'Updated Name' });

      const result = await updateUserService('user-123', { name: 'Updated Name' });
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('deleteUserService', () => {
    it('should delete a user', async () => {
      deleteUser.mockResolvedValue(mockUser);

      const result = await deleteUserService('user-123');
      expect(result.id).toBe('user-123');
    });
  });
});