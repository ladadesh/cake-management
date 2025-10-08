"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  getUsers,
  updateUser,
  deleteUser,
  User,
} from "../services/userService";
import Loader from "../components/Loader";
import Modal from "../components/Modal";

const USER_ROLES: User["role"][] = ["admin", "staff", "delivery", "chef"];

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "staff" as User["role"],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users. You may not have permission.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const updatedUser = await updateUser(selectedUser._id, editFormData);
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      handleModalClose();
    } catch (err) {
      console.error("Failed to update user", err);
      setError("Failed to update user.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Failed to delete user", err);
      setError("Failed to delete user.");
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-pink-50 py-6 px-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

      {/* Mobile View - Card List */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEditClick(user)}
                  className="text-pink-600 hover:text-pink-800 p-1"
                  title="Edit User"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="text-pink-600 hover:text-pink-800 p-1"
                  title="Delete User"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">Role: </span>
              <span className="text-sm font-medium capitalize bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200">
                <td className="px-5 py-4 text-sm">{user.username}</td>
                <td className="px-5 py-4 text-sm">{user.email}</td>
                <td className="px-5 py-4 text-sm capitalize">{user.role}</td>
                <td className="px-5 py-4 text-sm flex items-center gap-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="text-pink-600 hover:text-pink-800"
                    title="Edit User"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-pink-600 hover:text-pink-800"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Edit User">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={editFormData.username}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={editFormData.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              value={editFormData.role}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role} className="capitalize">
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the user{" "}
            <strong>{userToDelete?.username}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
